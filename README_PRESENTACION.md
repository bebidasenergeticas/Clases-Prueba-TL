# Masterclass 3D · E1577 · 19 de octubre de 2026

**Archivo:** `TOP_LEARNING_E1577_19_OCT_2026_MASTERCLASS_3D.html`
**Tema:** De agentes inteligentes a agentes que ejecutan acciones (Tools · Skills · MCP · Telegram · Human-in-the-Loop)
**Clase:** Top Learning · Grupo E1577 · Semana 25/28 · Nivel 2 · Módulo 5 Agentes · 20:30–22:00 (CDMX)

## Cómo abrirla
1. Haz doble clic en el archivo HTML. Se abre en Chrome o Edge **sin internet y sin servidor**.
2. Pulsa **F** para pantalla completa.
3. En Google Meet, comparte **la pestaña** (mejor que toda la pantalla) y abre las notas (**N**) en otro monitor si tienes uno, o consúltalas antes de compartir.

> Las notas del presentador reducen el escenario para no taparlo. Si compartes la pestaña, **los alumnos también verán las notas**. Para una vista privada, ábrelas solo antes de compartir o usa un segundo monitor.

## Controles
| Tecla / botón | Acción |
|---|---|
| → · ← · Espacio · RePág/AvPág | Siguiente / anterior |
| Inicio / Fin | Primera / última diapositiva |
| **F** | Pantalla completa |
| **O** | Vista general (clic para saltar) |
| **N** | Notas del presentador (hora CDMX, bloque, cronómetro) |
| **P** | Pausar / reanudar animaciones |
| **T** | Reiniciar cronómetro de clase |
| ↑ ↓ (diap. 7) | Recorrer capas de la anatomía |
| A / R (diap. 21) | Aprobar / Rechazar cuando la solicitud está pendiente |
| A / B / C (diap. 29) | Responder el quiz |
| `#n` en la URL | Abrir directo en la diapositiva n (ej. `...html#21`) |

También funciona con la barra inferior, el mouse y deslizando en pantallas táctiles. Respeta la preferencia del sistema *reducir movimiento*.

## Estructura (31 escenas · 90 min)
| Acto | Horario | Escenas |
|---|---|---|
| I · El agente que construimos | 20:30–20:42 | 1–6 |
| II · Anatomía de un agente real | 20:42–20:55 | 7–10 |
| III · Del procedimiento a la automatización | 20:55–21:07 | 11–14 |
| IV · Nuestro agente sale del chat | 21:07–21:20 | 15–17 |
| V · Human-in-the-Loop (tema oficial) | 21:20–21:36 | 18–22 |
| VI · Seguridad | 21:36–21:46 | 23–26 |
| VII · El próximo nivel (anticipo) | 21:46–21:50 | 27–28 |
| VIII · Evaluación y cierre | 21:50–22:00 | 29–31 |

## Qué es simulado y qué es real
**Todo lo interactivo se ejecuta en JavaScript local con datos ficticios.** No hay llamadas a APIs, ni credenciales, ni conexión a Hermes, Telegram, Gmail o n8n.

| Escena | Tipo |
|---|---|
| 7 Anatomía · 10 Constructor de capacidades | Simulación educativa conceptual |
| 14 Agenda 7:00 | Lista de verificación: márcala **solo** con evidencia real de tu demo |
| 15 Teléfono Telegram | SIMULACIÓN EDUCATIVA (también es el plan B si falla la demo) |
| 17 Laboratorio en vivo | **Demo real del profesor**: la diapositiva solo es referencia |
| 21 Botón que detiene a la IA | SIMULACIÓN EDUCATIVA de un flujo estilo n8n (sin conexión real) |
| 23 Prompt injection · 25 Cambio de modelo · 29 Quiz | Interacciones locales |

## Verificación de fuentes
- **Comprobado en la documentación oficial de Hermes (repositorio NousResearch/hermes-agent, guía Messaging → Telegram):** `hermes gateway setup | start | status | stop`, `hermes -p <perfil> gateway start`, `~/.hermes/.env` con `TELEGRAM_BOT_TOKEN` y `TELEGRAM_ALLOWED_USERS` (sin esa lista el gateway niega a todos), BotFather `/newbot` y `/revoke`, ID numérico vía @userinfobot, aprobación de comandos riesgosos respondiendo yes/no, `/skills`, `/<nombre-skill>`, creación autónoma de skills, compatibilidad con agentskills.io, `hermes model` y `/model`, soporte de servidores MCP.
- **Marcado como ilustrativo / por verificar en tu versión:** formato exacto de `SKILL.md`, cualquier comando tipo `/learn` (no aparece en la documentación revisada), comandos exactos de tareas programadas (*Cron Scheduling*), nombres y opciones de nodos de n8n (Schedule Trigger, *Send and Wait for Response*, Wait, IF, Data table) y revisión humana de tool calls en agentes de n8n.
- **No se pudo consultar:** los documentos de seguimiento del 12 y 14 de octubre (Google Docs sin acceso) ni el sitio hermes-agent.nousresearch.com (no resolvió desde el entorno de construcción). El contenido de continuidad se basa en el contexto escrito por el profesor.

## Seguridad durante la clase
- No muestres el token del bot en pantalla: pausa la pantalla compartida al editar `.env`.
- Si se filtra: `/revoke` en @BotFather.
- Las “indicaciones institucionales” de la última diapositiva son un recordatorio: usa las oficiales de Top Learning.

## Pruebas realizadas (Chromium sin conexión)
- 31 diapositivas cargan sin errores de JavaScript a 1920×1080 y 1366×768; ningún elemento se sale del área visible.
- Ninguna petición de red durante la carga (todas bloqueadas en la prueba: 0 intentos).
- 34/34 pruebas de interacción: teclas (←, →, Inicio, Fin, F, O, N, P), vista general, notas sin tapar el escenario, línea del tiempo, anatomía, constructor, agenda, teléfono, flujo HITL (aprobar → EJECUTADO, rechazar → CANCELADO, registro, reinicio), prompt injection, cambio de modelo, quiz 4/4 y reinicios.
- Falta probarlo en tu equipo real (Ryzen 5 con gráficos integrados) y compartiendo por Meet. Si notas lentitud, pulsa **P**.
