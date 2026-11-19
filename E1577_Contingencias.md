# E1577 | Contingencias, respaldo y checklist

**Sesión:** miércoles 18 de noviembre de 2026 · 40 min · Google Meet
Regla general: no terminar anticipadamente la llamada; si algo falla, se convierte en la lección ("fallemos y corrijamos").

## 1. Errores comunes y soluciones

| Síntoma | Causa probable | Solución |
|---|---|---|
| `EADDRINUSE` / puerto ocupado | Otra app o una instancia anterior usa el puerto | Cerrar la instancia anterior o usar otro puerto (`PORT=3001 npm start`); pedir a OpenCode la corrección 2 de la práctica. |
| `node` / `npm` no se reconoce | Node.js no está instalado o no está en el PATH | Verificar con `node -v`. Instalar Node.js (versión LTS reciente) desde su sitio oficial, con permiso y fuera de la sesión grabada; mientras tanto, usar el dashboard de respaldo o seguir la demo. |
| 401 de OpenRouter | Clave faltante, mal copiada o no cargada | Revisar `.env` en privado, reiniciar el servidor, comprobar `/api/health`; si no se resuelve, Ruta B (modo demostración). |
| 402 de OpenRouter | Falta de créditos o saldo en la cuenta | Verificar el saldo/créditos en la cuenta de OpenRouter, o usar un modelo permitido por la cuenta (confirmar en su panel); si no, Ruta B. |
| Modelo no válido / sin respuesta | OPENROUTER_MODEL mal escrito o ya no disponible | Copiar el identificador exacto del catálogo de OpenRouter (cambia con el tiempo); probar otro modelo. |
| CORS | Se abrió `index.html` con doble clic y se llama al backend desde otro origen | Abrir la app desde la URL del servidor (por ejemplo http://localhost:3000), no desde el archivo; el frontend debe llamar a `/api/chat` con ruta relativa. |
| OpenCode lento | Modelo saturado, límite de uso o tarea grande | Esperar 30–60 s; si sigue, cambiar de modelo (cambia solo esa sesión), dividir la instrucción en partes o pasar al ejemplo local preparado. |
| 429 | Límite de uso | Esperar, o usar modo demostración. |
| El chat se queda en "escribiendo..." | Error no manejado en el frontend/backend | Revisar la consola del servidor y del navegador; pedir a OpenCode la corrección 2. |
| OpenCode no ve los archivos | Se abrió en otra carpeta | Cerrar y reabrir en la carpeta del proyecto; pedirle que liste los archivos. |

## 2. Si nadie participa

Provocar un error intencional y corregirlo en vivo:
1. Quitar la clave del `.env` (sin proyectarlo) o poner un modelo inválido, y reiniciar.
2. Preguntar: "¿Qué creen que vamos a ver: modo demostración, 401 o un error técnico?"
3. Leer en voz alta el mensaje, revisar `/api/health`, y pedir a OpenCode la corrección 1.
4. Comprobar que ahora responde y cerrar con: "¿Qué cambió y cómo lo sabemos?"
También: preguntar por nombre a quien dijo tener un proyecto el 13/11; leer 2 dudas preparadas (sección 4 del guion) y resolverlas.

## 3. Si falla el internet

- **El profesor se cae:** reconectar por Meet y avisar por el canal oficial del grupo; no dar por terminada la sesión.
- **Falla OpenRouter/OpenCode pero hay Meet:** modo demostración local y dashboard de respaldo, ambos funcionan sin internet.
- **Sin Meet:** reconectar con datos móviles desde el celular y compartir pantalla solo si es posible; si no, avisar y confirmar con Coordinación cómo reprogramar.
- Tener abiertos antes de la sesión: la app preparada y `dashboard_financiero.html`.

## 4. Plan abreviado de 30 minutos

| Min | Bloque |
|---|---|
| 0–2 | Portada, disculpa breve y agenda (diap. 1–2) |
| 2–4 | Comprobar y arquitectura (diap. 3–4) |
| 4–6 | Café Horizonte AI (diap. 5) |
| 6–14 | OpenCode: demo en 7 pasos, 2 preguntas (precio y domicilio) |
| 14–19 | Fallar y corregir (diap. 7) |
| 19–21 | Muse por niveles (diap. 8) |
| 21–25 | Consultorio: duda de Juan + 2 dudas |
| 25–27 | Despedida (diap. 10–11) |
| 27–30 | Evaluación, registro y recordatorio institucional |

(Si la sesión sigue programada a 40 min, mantener los 40 min; este plan solo se usa si Coordinación lo autoriza.)

## 5. Alternativa de respaldo: dashboard financiero HTML autónomo

Para alumnos sin entorno o si falla la herramienta. Datos ficticios (MXN): Caja $12,000; Inventario $18,000; Equipo $15,000; Deuda proveedores $9,000; Deuda bancaria $11,000 -> activos $45,000, pasivos $20,000, patrimonio $25,000.

**Prompt completo (copiar y pegar):**
```text
Actúa como experto en desarrollo web, dashboards y análisis de datos sencillos.

Crea UN SOLO archivo "dashboard_financiero.html" (HTML + CSS + JavaScript en el mismo archivo). Debe funcionar abriéndolo con doble clic, sin servidor y SIN servicios externos (sin CDN, sin fuentes remotas, sin APIs); dibuja la gráfica con canvas o SVG propio.

Datos de ejemplo (MXN): Activos: Caja $12,000; Inventario $18,000; Equipo $15,000. Pasivos: Deuda a proveedores $9,000; Deuda bancaria $11,000. Totales esperados: activos $45,000; pasivos $20,000; patrimonio (activos - pasivos) $25,000.

Funciones: tarjetas con Total activos, Total pasivos y Patrimonio en formato de moneda MXN; tabla editable (campos numéricos, sin texto ni negativos) que recalcula todo al instante; gráfica de barras Activos vs Pasivos vs Patrimonio que se actualiza; botón "Restablecer datos de ejemplo"; diseño limpio, responsive, buen contraste; aviso "Datos ficticios con fines educativos".

Proceso: crea el archivo, verifica que los totales iniciales sean 45,000 / 20,000 / 25,000, dime cómo abrirlo y explica en 10 líneas cómo funciona.
```

**Prompt de corrección:**
```text
En dashboard_financiero.html, al cambiar un monto la gráfica no se actualiza o el patrimonio no coincide con activos menos pasivos. Corrige: (1) centraliza el cálculo en una función que lea todos los campos, (2) llámala en cada evento "input", (3) redibuja la gráfica después de cada cálculo, (4) trata valores vacíos o inválidos como 0, (5) confirma que con los datos iniciales dé 45,000 / 20,000 / 25,000. Sin librerías externas. Indica qué líneas cambiaste.
```

**Compartirlo (duda de Juan):** el HTML pegado en el muro solo aparece como enlace y no se ejecuta. Un archivo HTML se abre en el navegador; una vista previa local solo existe en el equipo; un archivo adjunto se descarga y se abre; un enlace público requiere una app alojada. Sugerencia de la clase del 13/11: subirlo como archivo a la carpeta del curso. Si la plataforma lo permite, adjuntar el `.html`; qué formatos acepta, confirmar con Coordinación.

## 6. Checklist operativo institucional

**Antes (T-30 min)**
- [ ] Enlace de Meet correcto; horario confirmado y comunicado por los canales oficiales (evitar repetir la confusión del 13/11).
- [ ] Confirmación con Coordinación Académica de que es sesión extraordinaria y de requisitos de asistencia/registro.
- [ ] Café Horizonte AI probada (modo demostración y, si aplica, real); puerto libre.
- [ ] `.env` fuera de pantalla; ventanas con claves cerradas; notificaciones silenciadas.
- [ ] `dashboard_financiero.html` abierto como respaldo.
- [ ] Prompts de la práctica y de corrección listos; presentación de 12 diapositivas cargada.
- [ ] Instrucciones de evaluación y registro a la mano.

**Durante**
- [ ] Iniciar grabación y avisarlo.
- [ ] Registrar asistencia.
- [ ] No pedir claves ni proyectar `.env`.
- [ ] Respetar tiempos; despedida entre min 29 y 32.
- [ ] Anotar dudas que haya que confirmar con Coordinación.

**Cierre**
- [ ] Evaluación y registro completados (hasta el min 38).
- [ ] Recordatorio institucional (min 38–40); no terminar antes.
- [ ] Verificar que la grabación se guardó y compartirla por el canal oficial si procede.
- [ ] Enviar a Coordinación asistentes y pendientes.
