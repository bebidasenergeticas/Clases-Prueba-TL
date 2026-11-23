#!/usr/bin/env node
/**
 * test_openrouter.js - Prueba minima de OpenRouter (chat completions) con fetch de Node >= 18.
 *
 * Uso (PowerShell):
 *   $env:OPENROUTER_API_KEY = "<tu clave, escrita por ti, nunca en un chat>"
 *   node test_openrouter.js "Responde en una frase: que es una API?"
 *
 * La clave se lee SOLO de process.env.OPENROUTER_API_KEY y nunca se imprime.
 * En una app real esto va en el BACKEND; el navegador no ve la clave.
 *
 * Docs oficiales (verificado 23/11/2026):
 *   https://openrouter.ai/docs/api_reference/errors-and-debugging.md
 *   https://openrouter.ai/docs/api_reference/limits.md
 *   https://openrouter.ai/docs/api_reference/authentication.md
 *   https://openrouter.ai/docs/guides/routing/model-variants/free.md
 *
 * Salida: 0 OK | 1 fallo tras reintentos | 2 falta clave | 3 error fatal (400/401/402/403)
 * Variables opcionales: OPENROUTER_MODEL, OPENROUTER_FALLBACK_MODELS (coma), OPENROUTER_BASE_URL (solo pruebas),
 *   OPENROUTER_REFERER, OPENROUTER_TITLE.
 * Nota proxy (solo entornos con proxy corporativo): NODE_USE_ENV_PROXY=1 en Node >= 22.21.
 */
'use strict';

const BASE_URL = (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';
const TIMEOUT_MS = 60_000;
const MAX_RETRIES_PER_MODEL = 3;
const BACKOFF_BASE_MS = 1000;
const BACKOFF_CAP_MS = 20_000;
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);
const FATAL = new Set([400, 401, 402, 403]);

const MENSAJES = {
  400: '400 Solicitud invalida: revisa "model" y "messages". Si viene del navegador puede ser CORS: llama desde tu backend.',
  401: '401 Credencial invalida: clave ausente, mal copiada, borrada/deshabilitada o caducada. Crea otra en https://openrouter.ai/keys.',
  402: '402 Creditos insuficientes o limite de la clave agotado. Revisa error.metadata.limit_source.',
  403: '403 Prohibido: permisos, guardrail, presupuesto o moderacion. Lee error.message y error.metadata.',
  404: '404 No encontrado: el ID del modelo no existe o ya no esta disponible. Consulta https://openrouter.ai/api/v1/models.',
  408: '408 Tiempo de espera agotado.',
  429: '429 Limite de peticiones (modelo gratis o proveedor saturado). Espera con backoff.',
  502: '502 El modelo/proveedor no responde o devolvio algo invalido.',
  503: '503 No hay proveedor disponible que cumpla tus requisitos.',
};

const log = (m) => console.error(m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class FatalError extends Error {
  constructor(status, detail) { super(detail); this.status = status; }
}

function backoffMs(intento, retryAfter) {
  const ra = Number(retryAfter);
  if (Number.isFinite(ra) && ra > 0) return Math.min(ra * 1000, 60_000);
  return Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** intento) + Math.random() * 500;
}

async function llamarModelo(apiKey, modelo, prompt, system, sleepFn = sleep) {
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (process.env.OPENROUTER_REFERER) headers['HTTP-Referer'] = process.env.OPENROUTER_REFERER; // opcional
  if (process.env.OPENROUTER_TITLE) headers['X-OpenRouter-Title'] = process.env.OPENROUTER_TITLE; // opcional
  const messages = [...(system ? [{ role: 'system', content: system }] : []), { role: 'user', content: prompt }];
  const body = JSON.stringify({ model: modelo, messages, max_tokens: 200 });

  let ultimo = 'sin intentos';
  for (let intento = 0; intento < MAX_RETRIES_PER_MODEL; intento++) {
    let resp;
    try {
      resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST', headers, body, signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      ultimo = `red/timeout (${e.name})`;
      log(`[${modelo}] ${ultimo}; intento ${intento + 1}/${MAX_RETRIES_PER_MODEL}`);
      await sleepFn(backoffMs(intento));
      continue;
    }

    const status = resp.status;
    let data = null;
    try { data = await resp.json(); } catch { /* cuerpo no JSON */ }

    if (status === 200) {
      const err = data?.error ?? data?.choices?.[0]?.error; // error dentro de un 200
      if (err) {
        ultimo = `error dentro de 200: ${err.code} ${err.message}`;
        log(`[${modelo}] ${ultimo}`);
        await sleepFn(backoffMs(intento));
        continue;
      }
      const texto = data?.choices?.[0]?.message?.content ?? '';
      if (!texto.trim()) {
        ultimo = 'respuesta vacia';
        log(`[${modelo}] ${ultimo}; reintento`);
        await sleepFn(backoffMs(intento));
        continue;
      }
      log(`[ok] modelo usado: ${data.model ?? modelo}`);
      return texto;
    }

    const msg = data?.error?.message ?? '';
    const explicacion = MENSAJES[status] ?? `HTTP ${status}`;
    ultimo = `${explicacion} | servidor dijo: ${JSON.stringify(msg)}`;
    if (FATAL.has(status)) throw new FatalError(status, ultimo);
    if (status === 404) throw new Error(ultimo); // mismo ID no mejora: siguiente modelo
    if (RETRYABLE.has(status) || status >= 500) {
      const espera = backoffMs(intento, resp.headers.get('retry-after'));
      log(`[${modelo}] ${explicacion} intento ${intento + 1}/${MAX_RETRIES_PER_MODEL}; espero ${(espera / 1000).toFixed(1)}s`);
      await sleepFn(espera);
      continue;
    }
    throw new Error(ultimo);
  }
  throw new Error(`agotados ${MAX_RETRIES_PER_MODEL} intentos: ${ultimo}`);
}

async function preguntar(apiKey, prompt, { system = null, modelos = [DEFAULT_MODEL], sleepFn = sleep } = {}) {
  const fallos = [];
  for (const m of modelos) {
    try {
      return await llamarModelo(apiKey, m, prompt, system, sleepFn);
    } catch (e) {
      if (e instanceof FatalError) throw e;
      fallos.push(`- ${m}: ${e.message}`);
      log(`[fallback] ${m} no funciono; paso al siguiente.`);
    }
  }
  throw new Error('Ningun modelo respondio:\n' + fallos.join('\n'));
}

async function main() {
  const args = process.argv.slice(2);
  const allowNoKey = args.includes('--allow-no-key'); // SOLO para documentar el error sin clave
  const prompt = args.filter((a) => !a.startsWith('--'))[0] || 'Responde en una frase: que es una API?';
  const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();
  if (!apiKey && !allowNoKey) {
    log('Falta OPENROUTER_API_KEY. Defina la variable de entorno (no pegue la clave en chats, codigo ni GitHub).');
    log("PowerShell:  $env:OPENROUTER_API_KEY = '<su clave>'");
    return 2;
  }
  const modelos = [DEFAULT_MODEL, ...(process.env.OPENROUTER_FALLBACK_MODELS || '').split(',').map((s) => s.trim()).filter(Boolean)];
  const dePago = modelos.filter((m) => m !== 'openrouter/free' && !m.endsWith(':free'));
  if (dePago.length) log(`[aviso] estos modelos podrian generar cargos: ${dePago.join(', ')}`);
  try {
    console.log(await preguntar(apiKey || null, prompt, { modelos }));
    return 0;
  } catch (e) {
    log(`${e instanceof FatalError ? 'ERROR FATAL' : 'ERROR'}: ${e.message}`);
    return e instanceof FatalError ? 3 : 1;
  }
}

module.exports = { preguntar, llamarModelo, FatalError };
if (require.main === module) main().then((c) => process.exit(c));
