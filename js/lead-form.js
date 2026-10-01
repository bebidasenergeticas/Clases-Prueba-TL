/**
 * DULCERA · formulario "Hablemos de tu pedido".
 *
 * Al enviar se construye el objeto del lead:
 *   { name, company, email, message }
 * y se entrega a handleLeadSubmission(lead).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  DÓNDE CONECTAR n8n
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. En n8n crea un flujo con un nodo "Webhook" (método POST, respuesta JSON).
 *  2. Copia su URL de producción y pégala en LEAD_CONFIG.webhookUrl (abajo), o define
 *     window.DULCERA_CONFIG = { webhookUrl: '…' } antes de cargar js/main.js.
 *  3. Recomendado en producción: NO expongas la URL del webhook en el cliente. Apunta webhookUrl
 *     a un endpoint propio (serverless) que valide, aplique rate-limit y reenvíe a n8n
 *     (variable de entorno N8N_WEBHOOK_URL). Ver WEB_BRIEF.md §6.5 para el payload extendido.
 *  Mientras webhookUrl sea null, NO se envía nada a ninguna red: el lead se guarda en memoria
 *  (window.__dulceraLeads) y se emite el evento `dulcera:lead` en window.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { INTENTS } from './data.js';

export const LEAD_CONFIG = {
  webhookUrl: (window.DULCERA_CONFIG && window.DULCERA_CONFIG.webhookUrl) || null, // ← URL del webhook de n8n
  timeoutMs: 10000,
};

/**
 * Punto único de integración. Recibe el lead ya validado y devuelve { ok, id, mode }.
 * Lanza un Error si el envío falla, para que la UI muestre el estado de error.
 * @param {{name: string, company: string, email: string, message: string}} lead
 */
export async function handleLeadSubmission(lead) {
  const id = (crypto.randomUUID && crypto.randomUUID()) || `lead-${Date.now()}`;

  if (LEAD_CONFIG.webhookUrl) {
    // ── Conexión real (desactivada en la demo) ──────────────────────────────
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), LEAD_CONFIG.timeoutMs);
    try {
      const res = await fetch(LEAD_CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: id,
          ...lead,
          meta: { page: location.pathname, sent_at: new Date().toISOString(), lang: 'es-MX', demo: true },
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
      return { ok: true, id, mode: 'webhook' };
    } finally {
      clearTimeout(t);
    }
  }

  // ── Modo demo: sin red ─────────────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 650)); // simula latencia para mostrar el estado "Enviando…"
  window.__dulceraLeads = window.__dulceraLeads || [];
  window.__dulceraLeads.push({ id, ...lead });
  window.dispatchEvent(new CustomEvent('dulcera:lead', { detail: { id, lead } }));
  console.info('[DULCERA demo] handleLeadSubmission()', { id, lead });
  return { ok: true, id, mode: 'demo' };
}

/* ------------------------------------------------------------------ validación */

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export const RULES = {
  name: (v) => (!v ? 'Escribe tu nombre.' : v.length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : v.length > 80 ? 'Máximo 80 caracteres.' : ''),
  company: (v) => (v.length > 100 ? 'Máximo 100 caracteres.' : ''),
  email: (v) => (!v ? 'Escribe tu correo.' : !EMAIL_RE.test(v) ? 'Escribe un correo válido, por ejemplo nombre@empresa.com.' : ''),
  message: (v) => (!v ? 'Cuéntanos qué necesitas.' : v.length < 20 ? `Agrega un poco más de detalle (mínimo 20 caracteres, llevas ${v.length}).` : v.length > 1000 ? 'Máximo 1000 caracteres.' : ''),
};

export function validateLead(lead) {
  const errors = {};
  Object.entries(RULES).forEach(([k, rule]) => {
    const msg = rule(lead[k] || '');
    if (msg) errors[k] = msg;
  });
  return errors;
}

/* ------------------------------------------------------------------ UI */

export function initLeadForm({ onSuccess } = {}) {
  const form = document.querySelector('[data-lead-form]');
  if (!form) return null;
  const success = document.querySelector('[data-lead-success]');
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const message = form.elements.message;
  const count = form.querySelector('[data-count]');
  const chips = [...form.querySelectorAll('[data-intent-chip]')];
  const touched = new Set();

  const read = () => ({
    name: form.elements.name.value.trim().replace(/\s+/g, ' '),
    company: form.elements.company.value.trim().replace(/\s+/g, ' '),
    email: form.elements.email.value.trim().toLowerCase(),
    message: form.elements.message.value.trim(),
  });

  function showField(key, msg) {
    const wrap = form.querySelector(`[data-field="${key}"]`);
    const input = form.elements[key];
    const err = wrap.querySelector('.field__error');
    err.textContent = msg || '';
    wrap.classList.toggle('is-invalid', !!msg);
    wrap.classList.toggle('is-valid', !msg && !!input.value.trim());
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function check(key) {
    const msg = RULES[key](read()[key]);
    showField(key, msg);
    return !msg;
  }

  Object.keys(RULES).forEach((key) => {
    const input = form.elements[key];
    input.addEventListener('blur', () => { touched.add(key); check(key); });
    input.addEventListener('input', () => { if (touched.has(key)) check(key); });
  });

  const updateCount = () => { count.textContent = String(message.value.length); };
  message.addEventListener('input', updateCount);

  // Chips de intención: insertan una frase de arranque editable
  let lastStarter = '';
  function applyIntent(key, { focus = false } = {}) {
    const text = INTENTS[key];
    if (!text) return;
    const current = message.value.trim();
    if (!current || current === lastStarter) {
      message.value = text;
      lastStarter = text;
    }
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.intentChip === key)));
    updateCount();
    if (touched.has('message')) check('message');
    if (focus) message.focus({ preventScroll: true });
  }
  chips.forEach((c) => c.addEventListener('click', () => applyIntent(c.dataset.intentChip, { focus: true })));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // honeypot: se ignora en silencio

    const lead = read();
    const errors = validateLead(lead);
    Object.keys(RULES).forEach((k) => { touched.add(k); showField(k, errors[k]); });
    const firstInvalid = Object.keys(RULES).find((k) => errors[k]);
    if (firstInvalid) {
      status.textContent = 'Revisa los campos marcados.';
      status.classList.add('is-error');
      form.elements[firstInvalid].focus();
      return;
    }

    status.textContent = '';
    status.classList.remove('is-error');
    submit.disabled = true;
    submitLabel.textContent = 'Enviando…';
    try {
      const result = await handleLeadSubmission({ name: lead.name, company: lead.company, email: lead.email, message: lead.message });
      success.querySelector('[data-success-email]').textContent = lead.email;
      success.querySelector('[data-success-json]').textContent = JSON.stringify({ name: lead.name, company: lead.company, email: lead.email, message: lead.message }, null, 2) + `\n\n// id: ${result.id} · modo: ${result.mode}`;
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
      onSuccess && onSuccess(success, result);
    } catch (err) {
      console.error('[DULCERA] Error al enviar el lead', err);
      status.textContent = 'No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo. Tus datos siguen aquí.';
      status.classList.add('is-error');
    } finally {
      submit.disabled = false;
      submitLabel.textContent = 'Enviar solicitud';
    }
  });

  success.querySelector('[data-lead-reset]').addEventListener('click', () => {
    form.reset();
    touched.clear();
    lastStarter = '';
    Object.keys(RULES).forEach((k) => showField(k, ''));
    form.querySelectorAll('.field').forEach((f) => f.classList.remove('is-valid'));
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    updateCount();
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  return { applyIntent, form, setMessage(t) { message.value = t; lastStarter = t; updateCount(); } };
}
