# DULCERA · Landing — documentación técnica

> **Marca ficticia con fines educativos.** Productos, imágenes, contacto y redes son de demostración. El formulario no envía datos a ninguna red mientras no se configure un webhook.

La landing sigue la identidad de [`brand/BRAND_GUIDE.md`](brand/BRAND_GUIDE.md), la estructura de [`WEB_BRIEF.md`](WEB_BRIEF.md) y las tomas de [`brand/IMAGE_SHOTLIST.md`](brand/IMAGE_SHOTLIST.md).

---

## 1. Cómo ejecutarla

No hay paso de build ni dependencias que instalar: todas las librerías están vendorizadas en `/vendor` y las fuentes en `/assets/fonts`, así que la demo funciona sin conexión.

```bash
# desde la raíz del repositorio
npm start                  # = python3 -m http.server 4173 --bind 127.0.0.1
# o, sin Python:
npm run start:node         # = npx http-server . -p 4173
```

Después abre **http://127.0.0.1:4173**.

> Hace falta un servidor HTTP: abrir `index.html` con doble clic (`file://`) bloquea los módulos ES y `fetch()`.

## 2. Arquitectura

```
index.html                 Marcado semántico de las 9 secciones (todo el contenido existe sin JS)
css/main.css               Estilos; consume brand/design-tokens.css (colores, tipografía, espaciado)
js/
  main.js                  Orquestación: Lenis, ScrollTrigger, intro, navegación, secciones, cursor, hoja de línea
  hero-scene.js            Escena Three.js del hero y su línea de tiempo ligada al scroll
  three/kit.js             Kit 3D compartido: caja con tapa, charolas, 7 dulces, texturas desde los SVG de /brand
  media.js                 Imágenes: final (/assets/generated) o render provisional (/assets/placeholders)
  lead-form.js             Validación del formulario + handleLeadSubmission() (punto de integración n8n)
  data.js                  Contenido: 24 tomas (IDs, nombres de archivo, alt text), líneas y productos, frases de intención
brand/                     Sistema de marca y SVG oficiales (logotipos usados por la web)
assets/
  fonts/                   Fraunces, Manrope y DM Mono (woff2, licencia OFL incluida)
  placeholders/            Renders 3D provisionales de las 24 tomas (ph-XX.webp 1600 px + ph-XX-800.webp)
  generated/               ← aquí van las imágenes finales + manifest.json
tools/
  qa.mjs                   QA automatizado en Chromium (ver §8)
  placeholder-studio.html  Estudio Three.js que compone cada toma provisional
  render-placeholders.mjs  Exporta los renders del estudio a WebP
  scan-assets.mjs          Detecta imágenes finales y reescribe assets/generated/manifest.json
  scene-test.html          Prueba aislada de la escena del hero (?p=0…1)
vendor/                    three (bundle ESM con solo lo usado), gsap + ScrollTrigger, lenis
```

### Narrativa y técnica por sección

| # | Sección | Qué ocurre | Técnica |
|---|---|---|---|
| — | Intro | El símbolo se arma capa por capa y la cortina sube | GSAP; failsafe CSS de 4 s si falla el JS |
| 01 | **Hero** | Wordmark gigante y caja DULCERA flotando con dulces suspendidos. Con el scroll: se rompe el sello, se abre la tapa (interior Jamaica con *México, en capas.*), las tres charolas suben en escalera y todo se reordena en **cinco colecciones**. La caja se oscurece hasta Piloncillo y se convierte en la Caja Corporativa. | Three.js; sección `sticky` de 360vh; ScrollTrigger con scrub → `setProgress()`; suavizado exponencial por tiempo; parallax del puntero |
| 02 | **Productos** | Las cinco líneas como paneles editoriales en scroll horizontal. "Ver la línea" abre una hoja a pantalla completa. | Desktop: pin + `containerAnimation` (máscaras `clip-path` y parallax internos). Móvil: carril con `scroll-snap`. Hoja: `<dialog>` con revelado `clip-path: circle()` desde el punto de clic |
| 03 | **Experiencia** | Macros sensoriales que se apilan como capas, con sabor, notas e ingredientes conceptuales, más un marquee de ingredientes | Tarjetas `position: sticky` + escala scrubbed + zoom lento de imagen |
| 04 | **DULCERA en movimiento** | IDEA → DISEÑO → PRODUCCIÓN → EMPAQUE → ENTREGA: un SVG construye el símbolo (mordida, trazo de la D, capas, caja, sello). Incluye aviso de narrativa conceptual. | Escenario sticky + estados GSAP por paso (`attr`, `stroke-dashoffset`, `scaleX`) |
| 05 | **Eventos** | "Haz que el evento también se pueda probar." Mosaico editorial (mesas, recuerdos, cajas, regalos) y personalizador en vivo del Recuerdo (nombre, fecha, paleta) | Grid de 12 columnas, parallax `data-speed`, revelado con máscara |
| 06 | **Corporativo** | "DULCERA para empresas": Regalos, Eventos, Kits y Cajas personalizadas (con prueba de faja "DULCERA × TU MARCA"). CTA *Solicitar cotización*. | Imagen que se ensancha (`clip-path` scrubbed) |
| 07 | **Mayoreo** | Tiendas, Distribución y Retail. CTA *Quiero distribuir DULCERA*. | — |
| 08 | **Hablemos de tu pedido** | Formulario con validación real, chips de intención y estado de éxito que muestra el objeto del lead | `lead-form.js` |
| 09 | **Footer** | Logo, navegación, contacto y redes marcados como DEMO, nota de marca ficticia | Redes como botones sin enlace (muestran un aviso) |

**Transiciones internas.** Los enlaces de navegación que saltan más de unas dos pantallas barren la vista con las tres capas (Mango, Jamaica, Cacao), saltan debajo y la descubren. Los saltos cortos usan scroll suave con Lenis.

**Microinteracciones.**
- Cursor sutil, solo con puntero fino: crece sobre elementos interactivos y muestra "Ver línea" sobre las fotos de producto.
- Botones con barrido de color.
- Subrayados animados en la navegación.
- Indicador de sección en el header.
- El header se oculta al bajar y reaparece al subir.

## 3. Librerías

| Librería | Versión | Uso | Licencia |
|---|---|---|---|
| [Three.js](https://threejs.org) | 0.186.1 | Escena 3D del hero y estudio de placeholders. Bundle ESM propio (`vendor/three/three.bundle.min.js`), generado con esbuild con solo las clases usadas más `RoundedBoxGeometry` y `RoomEnvironment` | MIT |
| [GSAP](https://gsap.com) + ScrollTrigger | 3.15.0 | Animación, scroll-linked, pin, scrub, `matchMedia` | Licencia estándar de GSAP (uso gratuito) |
| [Lenis](https://lenis.darkroom.engineering) | 1.3.26 | Scroll suave (desactivado con movimiento reducido) | MIT |
| Fraunces · Manrope · DM Mono | Google Fonts | Tipografía de marca (BRAND_GUIDE §6), servida localmente | SIL OFL 1.1 |

No hay frameworks ni bundler en tiempo de desarrollo.

Para regenerar el bundle de Three.js (por ejemplo, si una pieza nueva usa otra clase):

```bash
# entry.js:  export { Scene, Mesh, … } from 'three';  export { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'; …
npx esbuild entry.js --bundle --format=esm --minify --outfile=vendor/three/three.bundle.min.js
```

## 4. Dónde están los assets

| Qué | Dónde |
|---|---|
| Logotipos (header, footer, favicon, texturas de la caja 3D) | `brand/logo-horizontal.svg`, `brand/logo-monochrome-light.svg`, `brand/logo-mark.svg`, `brand/concepts/concept-a-wordmark.svg`, `brand/concepts/concept-c-monograma.svg` |
| Wordmark del hero y del footer | Rutas idénticas a `brand/concepts/concept-a-wordmark.svg`, incrustadas en `index.html` para animarlas letra por letra |
| Tokens de color y tipografía | `brand/design-tokens.css` |
| Renders provisionales | `assets/placeholders/ph-XX.webp` y `ph-XX-800.webp` |
| Imágenes finales | `assets/generated/` (vacía por ahora) |

**Corrección de marca realizada en esta fase.** Las rutas de las letras D y R del wordmark rellenaban sus contraformas (regla `nonzero`). Se añadió `fill-rule="evenodd"` en todos los SVG de `/brand`. La geometría no cambió.

## 5. Cómo reemplazar las imágenes

Cada `<figure class="media" data-shot="XX">` decide su imagen en `js/media.js`:

1. **Genera o produce** la toma según `brand/IMAGE_SHOTLIST.md`, que incluye prompts y prompts negativos.
2. **Guárdala** en `assets/generated/` con el nombre de `js/data.js → SHOTS[XX].file`. Puede ser un solo archivo:
   ```
   assets/generated/dulcera-img-03-macro-mango-chile.webp
   ```
   o varias anchuras para `srcset` (recomendado):
   ```
   dulcera-img-03-macro-mango-chile-800.webp
   dulcera-img-03-macro-mango-chile-1600.webp
   dulcera-img-03-macro-mango-chile-2400.webp
   ```
3. **Actualiza el manifest:**
   ```bash
   npm run assets:scan        # = node tools/scan-assets.mjs
   ```
4. Recarga la página. La toma deja de mostrar la etiqueta "Provisional" y usa el alt text final.

La web solo solicita imágenes listadas en `manifest.json`, así que las tomas faltantes no generan errores 404. Las tomas 15 a 22 muestran automáticamente "Imagen ilustrativa" (`illustrative: true` en `data.js`). Para cambiar qué toma aparece en un lugar, edita el atributo `data-shot` en `index.html`.

Para **volver a renderizar los placeholders** (por ejemplo, tras cambiar el kit 3D):

```bash
npm start   # en otra terminal
npm run placeholders              # todas
node tools/render-placeholders.mjs 05 12    # solo algunas
```

## 6. Dónde conectar n8n

Todo pasa por **`handleLeadSubmission(lead)`** en [`js/lead-form.js`](js/lead-form.js).

Al enviar el formulario, si es válido, se construye exactamente este objeto:

```js
{ name, company, email, message }
```

**Modo demo (actual).** Con `LEAD_CONFIG.webhookUrl = null` no hay petición de red:
- Espera unos 650 ms para mostrar el estado "Enviando…".
- Guarda el lead en `window.__dulceraLeads`.
- Emite `window.dispatchEvent(new CustomEvent('dulcera:lead', { detail: { id, lead } }))`.
- Muestra el objeto en el estado de éxito ("Ver el objeto del lead").

**Conectar.**

1. En n8n, crea un flujo con un nodo **Webhook** (POST, *Respond: JSON*).
2. Copia su URL de producción y elige una de dos opciones:
   - Edita `LEAD_CONFIG.webhookUrl` en `js/lead-form.js`, o
   - Define la URL antes de cargar `main.js`, sin tocar el código:
     ```html
     <script>window.DULCERA_CONFIG = { webhookUrl: 'https://tu-n8n/webhook/dulcera-leads' };</script>
     ```
3. `handleLeadSubmission()` hace entonces `POST` con JSON:
   ```json
   { "lead_id": "uuid", "name": "…", "company": "…", "email": "…", "message": "…",
     "meta": { "page": "/", "sent_at": "ISO-8601", "lang": "es-MX", "demo": true } }
   ```
   Tiene un timeout de 10 s. Una respuesta distinta de 2xx muestra el estado de error y conserva los datos del formulario.
4. **En producción**, no expongas la URL de n8n en el cliente. Apunta `webhookUrl` a un endpoint propio (por ejemplo, una función serverless) que valide de nuevo, aplique rate-limit, revise el honeypot (`website`) y reenvíe a n8n desde una variable de entorno `N8N_WEBHOOK_URL`.
5. **Siguiente fase (IA).** En n8n, un nodo LLM puede clasificar el lead (segmento, prioridad, resumen, siguiente paso y borrador de respuesta), según WEB_BRIEF.md §6.4. El payload extendido está en §6.5.

**Prueba rápida en consola:**

```js
await handleLeadSubmission({ name: 'Ana', company: 'Demo', email: 'ana@demo.com', message: 'Mensaje de prueba de al menos veinte caracteres.' })
```

## 7. Accesibilidad, rendimiento y respaldos

| Tema | Implementación |
|---|---|
| Movimiento reducido | Sin Lenis, sin historia de scroll en el hero (la caja se muestra abierta y estática, renderizada una sola vez), sin pin horizontal (los productos pasan a rejilla), sin marquee, sin cortina ni cursor |
| Sin WebGL o si Three.js falla | `html.no-webgl`: el hero muestra el render `img-01` y todo lo demás funciona |
| Sin JS | Todo el contenido y las anclas son HTML. El loader se oculta y las figuras muestran su ID pendiente. |
| WebGL | DPR limitado a `Math.min(devicePixelRatio, 1.75)`. El render solo corre mientras el hero está visible (IntersectionObserver) y la pestaña activa. Sin pase de transmisión. Sombra de contacto falsa en lugar de shadow map. |
| Imágenes | `loading="lazy"`, `decoding="async"`, `srcset` 800/1600 (o el de las finales) con `sizes` por contexto |
| Teclado | Skip link; `:focus-visible` de 3 px. El menú móvil se cierra con Escape y pone `inert` en el contenido. El `<dialog>` atrapa el foco y se cierra con Escape. Tras navegar, el foco va al título de la sección (o al primer campo del formulario). |
| Formularios | Etiquetas visibles, `aria-describedby`, `aria-invalid`, errores con `aria-live`, contador de caracteres, honeypot. El foco va al primer error. |
| Contraste | Solo los pares verificados en BRAND_GUIDE §5.4. Jamaica sobre Piloncillo solo en botones con texto Nata (4.7:1). |
| Alt text | Desde `data.js`. Los renders provisionales se anuncian como "Render provisional. Representa: …". |

## 8. Qué fue verificado

Se verificó con `node tools/qa.mjs` (Playwright + Chromium headless con SwiftShader) y revisión visual de cada captura.

| Verificación | Resultado |
|---|---|
| Viewports | 1920×1080 · 1440×900 · 1366×768 · tablet 820×1180 · móvil 390×844 |
| Carga sin errores de consola ni peticiones fallidas (404) | ✓ en todos |
| Sin scroll horizontal ni elementos fuera del viewport | ✓ en todos |
| Logos SVG de `/brand` cargados (header, footer, favicon, texturas 3D) | ✓ |
| Hero: WebGL inicializa; historia de scroll a 0 %, 22 %, 50 % y 97 % (sello → tapa → escalera → cinco colecciones) | ✓ |
| Navegación: cada enlace del menú (y del menú móvil) llega a su sección | ✓ |
| CTA "Cotizar mayoreo" prellena el mensaje del formulario | ✓ |
| Hoja de línea: abre con transición y cierra con Escape | ✓ |
| Formulario vacío marca nombre, correo y mensaje; correo y mensaje inválidos se detectan | ✓ |
| Envío válido → `handleLeadSubmission()` recibe exactamente `{ name, company, email, message }` y se muestra el estado de éxito | ✓ |
| Menú móvil abre y cierra | ✓ |
| Movimiento reducido: sin historia de scroll, sin errores, sin overflow | ✓ |
| Sin WebGL (`--disable-webgl`): se activa la imagen de respaldo, sin errores | ✓ |

**Problemas detectados y corregidos durante la QA:**
- Error de inicialización (TDZ) en `main.js`.
- Contraformas de D y R en los SVG de marca.
- Toast vacío visible en el borde inferior.
- El atributo `hidden` era anulado por `display: grid` (el formulario no cedía su lugar al estado de éxito).
- Imagen del footer encimada sobre el contenido.
- Textura del formulario que restaba contraste al texto.
- Desfase de la escena 3D cuando bajan los fps: el suavizado ahora es exponencial por tiempo.
- Loop de render activo con movimiento reducido.
- Pase de transmisión costoso eliminado.
- Escenario del proceso en móvil que dejaba asomar texto.

**Limitaciones conocidas:**
- El QA corre con WebGL por software (unos 7 fps), así que la fluidez real se debe confirmar en un navegador con GPU.
- El revelado `clip-path: circle()` del `<dialog>` requiere un navegador moderno; en navegadores antiguos el diálogo abre sin animación.
- Los placeholders son renders estilizados, no fotografía: su función es dar escala, color y composición hasta que existan las imágenes de `/assets/generated`.

Para correrlo:

```bash
npm start                                     # terminal 1
node tools/qa.mjs --out qa-output             # terminal 2 · --quick = solo 1440 y 390
```

El reporte queda en `qa-output/report.json`, junto con las capturas por sección.
