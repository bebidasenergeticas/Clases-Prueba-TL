# DULCERA — Brief para la landing page

> **Aviso: marca ficticia con fines educativos.** La web no debe afirmar certificaciones, registros sanitarios, premios, años de experiencia, clientes, capacidad de producción, instalaciones, ventas ni métricas. Si un diseño necesita un dato así, se muestra `[DATO REAL PENDIENTE]`. Los precios, si aparecen, llevan la etiqueta `DEMO`. El footer incluye la nota de marca ficticia.

**Este documento no incluye código.** Define qué construir, en qué orden, con qué copy, con qué imágenes y con qué reglas.

**Fuentes de verdad:**
- Marca: [`brand/BRAND_GUIDE.md`](./brand/BRAND_GUIDE.md)
- Imágenes: [`brand/IMAGE_SHOTLIST.md`](./brand/IMAGE_SHOTLIST.md) (`img-XX`)
- Tokens: [`brand/design-tokens.css`](./brand/design-tokens.css)
- Logos: [`brand/`](./brand/)

---

## 1. Objetivo

| | |
|---|---|
| **Objetivo de negocio (demo)** | Generar **leads comerciales calificados** (empresas, eventos, tiendas, distribuidores, mayoreo) y despertar deseo B2C. |
| **Conversión principal** | Enviar el formulario **COTIZAR**. |
| **Conversiones secundarias** | Clic en "Ver productos", clic en WhatsApp `[número pendiente]`, descarga del catálogo `[PDF pendiente]`. |
| **Siguiente fase (fuera de alcance aquí)** | El lead del formulario se envía a un webhook de **n8n**. La **IA** lo clasifica, lo resume y redacta la primera respuesta, y el flujo lo registra en CRM o en una hoja de cálculo. El payload está en §6.5. |

## 2. Narrativa: la página como una caja en capas

La página se recorre como se abre la Caja Capas: primero impacto, luego producto, después detalle y al final el trato comercial.

| Acto | Qué siente o entiende el visitante | Secciones |
|---|---|---|
| 1. Impacto de marca | "Esto se ve rico y se ve bien." | HERO |
| 2. Producto | "Conozco estos sabores, pero no así." | PRODUCTOS |
| 3. Descubrimiento | "Hay líneas, y una es para mí." | COLECCIONES |
| 4. Experiencia | "Abrirla también es parte del regalo." | EXPERIENCIA DULCERA |
| 5. B2B (confianza) | "Lo hacen con cuidado." | FABRICACIÓN |
| 6. Eventos | "Puede ser mi mesa de dulces." | EVENTOS |
| 7. Empresas y mayoreo | "Sirve para mi empresa o mi tienda." | CORPORATIVO · MAYOREO |
| 8. Cotización | "Sé qué pedir y cómo." | COTIZAR |
| 9. Conversión | "Envié mi solicitud y sé qué sigue." | COTIZAR (estado de éxito) · FOOTER |

## 3. Estructura y navegación

```
[Header fijo]  logo-horizontal · Productos · Colecciones · Eventos · Empresas · Mayoreo · [Cotizar]
──────────────────────────────────────────────────────────────────────────────
01 HERO
02 PRODUCTOS              #productos
03 COLECCIONES            #colecciones
04 EXPERIENCIA DULCERA    #experiencia
05 FABRICACIÓN            #fabricacion
06 EVENTOS                #eventos
07 CORPORATIVO            #empresas
08 MAYOREO                #mayoreo
09 COTIZAR                #cotizar
10 FOOTER
```

- **Header:** fondo Nata al 90 % con desenfoque de fondo. Al hacer scroll se compacta de 88 a 64 px. El CTA "Cotizar" es el único elemento Jamaica del header.
- **Mobile:** logo, CTA "Cotizar" y menú hamburguesa. El menú es a pantalla completa, en Piloncillo con texto Nata en Fraunces grande.
- **Ritmo de fondos:** Nata, Nata, Arcilla, Nata, Piloncillo, Pitaya suave, Piloncillo, Nata, Arcilla, Piloncillo. Alterna capas claras y oscuras como en el símbolo.
- **Separadores entre secciones:** una fina franja de 3 capas (patrón "Capas", 12 px de alto) en el color de la sección siguiente. Es opcional y no debe repetirse en cada corte.

---

## 4. Secciones

> Formato por sección: **Objetivo · Copy · Imágenes · Layout desktop · Layout mobile · Interacción · Notas.** El copy es final o casi final; solo se ajusta para que quepa.

### 4.1 HERO

- **Objetivo:** impacto de marca en 3 segundos y doble camino (B2C / B2B).
- **Copy:**
  - Eyebrow: `DULCES MEXICANOS CONTEMPORÁNEOS`
  - H1: **México, en capas.** (Fraunces `display-xl`, con "capas" en itálica)
  - Subtítulo: Dulces mexicanos de siempre, hechos con otro cuidado. Para darte un gusto, regalar o llevar a tu empresa y a tu evento.
  - CTA primario: **Ver productos** (Jamaica)
  - CTA secundario: **Cotizar para empresa o evento** (contorno Piloncillo)
  - Microcopy bajo los CTAs: `Pedidos individuales · Cajas de regalo · Eventos · Corporativo · Mayoreo`
- **Imagen:** `img-01` (Caja Capas en escalera).
- **Layout desktop:** imagen a sangre completa, 100 vh (mínimo 640 px). El texto ocupa las columnas 1–6 de una retícula de 12, alineado abajo a la izquierda. El producto queda en la mitad derecha.
- **Layout mobile:** `img-01` en recorte 4:5 arriba; texto debajo sobre Nata. El H1 mide 52 px. Los CTAs van apilados a ancho completo.
- **Interacción:** al cargar, las tres charolas de la imagen tienen un *parallax* sutil de 3 capas (máximo 12 px) si se genera la imagen en 3 recortes. Si no, un *fade-up* del texto (400 ms, `ease-out`). Se respeta `prefers-reduced-motion`.
- **Notas:** sin carrusel en el hero. Una sola imagen, una sola idea.

### 4.2 PRODUCTOS

- **Objetivo:** mostrar el catálogo y provocar antojo.
- **Copy:**
  - Eyebrow: `PRODUCTOS`
  - H2: Sabores que ya conoces. Terminados que no esperabas.
  - Intro: Doce piezas en seis líneas. Cada una parte de un sabor mexicano reconocible y le agrega un detalle: sal, tostado, corte o una capa más.
- **Contenido:** rejilla de tarjetas. Primero un **destacado** a ancho doble con 08 Caja Capas · Degustación (`img-02`); después los productos individuales:

| Tarjeta | Imagen | Línea (etiqueta) | Nombre | Línea de sabor | Precio |
|---|---|---|---|---|---|
| Destacado | `img-02` | REGALO | Caja Capas · Degustación | 9 piezas en 3 capas | `DEMO` |
| 1 | `img-07` | CLASSIC | Leche Quemada | lácteo · tostado · salino | `DEMO` |
| 2 | `img-08` | CLASSIC | Cocada Tostada | coco · tostado · húmedo | `DEMO` |
| 3 | `img-06` | FRUIT | Jamaica Cristal | floral · ácido · brillante | `DEMO` |
| 4 | `img-03` | FRUIT | Mango Chile | mango · ácido · picor suave | `DEMO` |
| 5 | `img-09` | FRUIT | Tamarindo y Sal | agridulce · terroso · salino | `DEMO` |
| 6 | `img-04` | CACAO | Bombón Cacao-Vainilla | vainilla · cacao · esponjoso | `DEMO` |
| 7 | `img-10` | CACAO | Tableta Capa de Cajeta | cacao · cajeta · sal | `DEMO` |

- **Tarjeta (anatomía):**
  1. Imagen 1:1 o 4:5.
  2. Etiqueta de línea en píldora del color de la línea.
  3. Nombre del producto en Fraunces `heading`.
  4. Perfil de sabor en Manrope y color Cacao.
  5. Presentaciones en `label`.
  6. Enlace "Pedir" que lleva a COTIZAR con el producto preseleccionado.
- **Precios:** si se muestran, el formato es `$000 MXN · DEMO`, con la etiqueta `DEMO` visible en DM Mono. Lo recomendado es ocultarlos y usar "Pedir".
- **Layout desktop:** 4 columnas; el destacado ocupa 2 × 2.
- **Layout mobile:** carrusel horizontal con *scroll-snap*, tarjetas al 80 % del ancho y paginación de capas `01 / 08`.
- **Interacción:** al pasar el cursor, la imagen hace *zoom* a 1.04 y aparece "Pedir →". Los productos 10–12 (eventos y corporativo) no van aquí; viven en sus secciones.

### 4.3 COLECCIONES

- **Objetivo:** ordenar el descubrimiento por línea, para que cada persona encuentre "la suya".
- **Copy:**
  - Eyebrow: `COLECCIONES`
  - H2: Tres líneas. Una para cada antojo.
  - CLASSIC: **Para quien extraña.** Leche, coco y caramelo, como los recuerdas pero mejor terminados.
  - FRUIT: **Para quien quiere ácido.** Jamaica, mango con chile y tamarindo con sal.
  - CACAO: **Para quien quiere más.** Cacao en capas, del bombón a la tableta.
  - Bloque REGALO: **¿No sabes cuál?** La Caja Capas trae las tres. · CTA: Arma tu caja
- **Imágenes:** `img-11` (trío de cajas) como imagen de sección. Cada panel lleva su imagen de línea (`img-07`, `img-06`, `img-10`).
- **Layout desktop:** tres paneles verticales de igual ancho. El fondo de cada panel es el color de la línea al 12 % sobre Arcilla, con una franja superior sólida del color de la línea.
- **Layout mobile:** acordeón de 3 capas. La primera está abierta.
- **Interacción:** al pasar el cursor, el panel se expande al 40 % y los otros se reducen al 30 % (300 ms).
- **Notas:** el bloque REGALO (09 Caja Arma tu Capa) enlaza a COTIZAR con el tipo "Caja personalizada".

### 4.4 EXPERIENCIA DULCERA

- **Objetivo:** vender el momento de abrir la caja, que es el diferencial fotografiable.
- **Copy:**
  - Eyebrow: `EXPERIENCIA DULCERA`
  - H2: Una caja que se abre en tres tiempos.
  - Paso `01 / 03` · **Rompe el sello.** El sello rojo es la primera mordida.
  - Paso `02 / 03` · **Levanta la tapa.** Adentro dice: *México, en capas.*
  - Paso `03 / 03` · **Baja capa por capa.** Classic, Fruit, Cacao. Nueve piezas en orden.
  - Cierre: Hecho para morder. Y para fotografiar.
- **Imágenes:** `img-12`, `img-13`, `img-14` y `img-02` como cierre.
- **Layout desktop:** *scroll* fijo (*sticky*). La imagen está a la izquierda y cambia con cada paso; los pasos se desplazan a la derecha.
- **Layout mobile:** tres bloques apilados con imagen 4:5 y texto debajo. Indicador de progreso de 3 capas fijo arriba.
- **Interacción:** la transición entre imágenes es un *crossfade* de 500 ms. Con `prefers-reduced-motion`, se muestran tres bloques estáticos.

### 4.5 FABRICACIÓN

- **Objetivo:** dar confianza B2B mostrando el proceso como concepto, **sin afirmar instalaciones, capacidad ni certificaciones**.
- **Fondo:** Piloncillo, con texto Nata.
- **Copy:**
  - Eyebrow: `FABRICACIÓN`
  - H2: Dulce, bien hecho.
  - Intro: Cada pieza pasa por tres pasos con la misma atención: cocción, corte y empaque.
  - **Cocción.** El caramelo se trabaja hasta su punto: ni antes, ni después.
  - **Corte.** Medidas exactas para que cada pieza se vea igual que la anterior.
  - **Empaque.** Pliegue a pliegue, para que abrirlo también se sienta.
  - Bloque de información para B2B: Fichas técnicas, ingredientes, alérgenos, vida de anaquel y documentación sanitaria: `[DATO REAL PENDIENTE]`. Puedes solicitarlas en el formulario.
- **Imágenes:** `img-15` (ancho completo), `img-16` y `img-17`, todas con el pie **"Imagen ilustrativa"**.
- **Layout desktop:** `img-15` en banda de 16:9; debajo, 3 columnas (paso, imagen y texto).
- **Layout mobile:** banda y 3 pasos apilados.
- **Prohibido en esta sección:** "planta de X m²", "producimos X toneladas", "certificados por…", "desde 19XX", sellos o logos de certificación.

### 4.6 EVENTOS

- **Objetivo:** captar leads de organizadores y particulares con evento.
- **Fondo:** Pitaya al 35 % sobre Nata.
- **Copy:**
  - Eyebrow: `DULCERA EVENTOS`
  - H2: Tu mesa de dulces, en la paleta de tu evento.
  - Intro: Bodas, bautizos, lanzamientos o fiestas de empresa. Elegimos las piezas por color y por número de invitados, y te mandamos una propuesta.
  - Producto 1: **Mesa DULCERA.** Selección por pieza, curada por paleta.
  - Producto 2: **Recuerdo DULCERA.** Cajita de 2 piezas con sticker personalizado: nombres, fecha o logotipo.
  - Mini proceso: `01` Cuéntanos la fecha y el número de invitados → `02` Elige la paleta → `03` Recibe tu propuesta.
  - CTA: **Cotizar mi evento**, que lleva a COTIZAR con el tipo "Evento".
- **Imágenes:** `img-18` (mesa) e `img-19` (recuerdo), con el pie "Imagen ilustrativa".
- **Layout desktop:** imagen 16:9 a la izquierda (7 columnas) y texto a la derecha (5 columnas). Debajo, dos tarjetas de producto.
- **Layout mobile:** imagen, texto, tarjetas y CTA fijo al fondo de la sección.
- **Notas:** no se muestran "eventos realizados" ni testimonios. Si se quiere prueba social, se usa `[TESTIMONIO REAL PENDIENTE]` y no se publica hasta tenerlo.

### 4.7 CORPORATIVO

- **Objetivo:** captar leads de empresas para regalo institucional.
- **Fondo:** Piloncillo, con `img-05` como imagen de fondo. Texto Nata.
- **Copy:**
  - Eyebrow: `DULCERA CORPORATIVO`
  - H2: Regalos que se abren con calma y se recuerdan.
  - Intro: La Caja Corporativa Capas es sobria por fuera y tiene color por dentro. Lleva una faja con tu marca junto a la nuestra y una tarjeta con tu mensaje.
  - Beneficios en lista de 3 capas:
    - **Co-branding sobrio.** DULCERA × tu marca en la faja.
    - **Mensaje personalizado.** Tarjeta impresa para cada destinatario.
    - **Formatos de 9 o 16 piezas.** Selección recomendada o a tu elección.
  - Casos de uso: fin de año · bienvenida a nuevos equipos · clientes · eventos de marca.
  - CTA: **Cotizar regalos para mi empresa**, que lleva a COTIZAR con el tipo "Corporativo".
- **Imágenes:** `img-05` (fondo) e `img-20` (escritorio, pie "Imagen ilustrativa").
- **Layout desktop:** `img-05` a sangre con el texto a la izquierda; `img-20` en una tarjeta flotante a la derecha.
- **Layout mobile:** `img-05` recortada arriba y texto debajo sobre Piloncillo.
- **Notas:** no se incluyen logos de empresas cliente, ni "empresas que confían en nosotros", ni tiempos de entrega no definidos. Los tiempos se muestran como `[por definir]`.

### 4.8 MAYOREO

- **Objetivo:** captar tiendas, distribuidores y compradores por volumen.
- **Fondo:** Nata.
- **Copy:**
  - Eyebrow: `MAYOREO Y DISTRIBUCIÓN`
  - H2: Formatos para tu mostrador, tu tienda o tu red.
  - Intro: Las líneas CLASSIC, FRUIT y CACAO están disponibles en formatos pensados para vender.
  - Tabla de formatos:

| Formato | Para | Qué incluye |
|---|---|---|
| Exhibidor de mostrador | Cafeterías y tiendas | Piezas individuales en un display listo para barra |
| Caja master | Distribuidores | Exhibidores o bolsas por línea |
| Granel | Mayoreo y eventos | Piezas sin caja individual |

  - Nota: Cantidades mínimas, precios por volumen y condiciones: `[DATO REAL PENDIENTE]`. Te los enviamos con tu propuesta.
  - CTA doble: **Quiero vender DULCERA** (tienda) · **Quiero distribuir DULCERA** (distribuidor). Ambos llevan a COTIZAR con el tipo preseleccionado.
- **Imágenes:** `img-21` (barra) e `img-22` (cajas master), con el pie "Imagen ilustrativa".
- **Layout desktop:** 2 columnas: imagen 4:5 a la izquierda; tabla y CTAs a la derecha. `img-22` en una banda angosta debajo.
- **Layout mobile:** la tabla se convierte en 3 tarjetas apiladas.

### 4.9 COTIZAR

- **Objetivo:** convertir. Es la sección más importante para la fase de IA y n8n.
- **Fondo:** Arcilla, con `img-23` como textura lateral (desktop).
- **Copy:**
  - Eyebrow: `COTIZAR`
  - H2: Cuéntanos qué necesitas.
  - Intro: Te respondemos con una propuesta. Entre más detalle nos des, más precisa será.
  - Microcopy de privacidad: Usamos tus datos solo para responder esta solicitud. `[Aviso de privacidad pendiente]`
  - Botón: **Enviar solicitud**
  - Éxito: **Recibimos tu solicitud.** Te escribiremos a [correo] con los siguientes pasos. Mientras tanto, mira los productos. · (Se muestra el símbolo DULCERA).
  - Error: No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo. Tus datos siguen aquí.
- **Formulario:** especificación completa en §6.
- **Layout desktop:** 5 columnas para texto y textura, 7 columnas para el formulario en tarjeta Azúcar.
- **Layout mobile:** formulario a ancho completo. El paso actual se indica con 3 capas.

### 4.10 FOOTER

- **Fondo:** Piloncillo. Logotipo: `logo-monochrome-light.svg`.
- **Contenido:**
  - Columna 1: logotipo y slogan *México, en capas.*
  - Columna 2: Productos · Colecciones · Experiencia
  - Columna 3: Eventos · Empresas · Mayoreo · Cotizar
  - Columna 4: Contacto `[correo pendiente]` · WhatsApp `[pendiente]` · Instagram `[pendiente]` · TikTok `[pendiente]`
  - Banda inferior: © DULCERA (marca ficticia) · Aviso de privacidad `[pendiente]` · Términos `[pendiente]`
  - **Nota legal obligatoria:** *DULCERA es una marca ficticia creada con fines educativos. Productos, imágenes y precios son ilustrativos.*
- **Imagen opcional:** `img-24` (pieza con mordida) como cierre visual antes del footer.

---

## 5. Sistema visual web

### 5.1 Tokens

Se usan [`brand/design-tokens.css`](./brand/design-tokens.css) como única fuente. Resumen:

| Token | Valor |
|---|---|
| `--color-piloncillo` | `#2A1A14` |
| `--color-nata` | `#F5EDE1` |
| `--color-jamaica` | `#C8274A` |
| `--color-mango` | `#E39A2D` |
| `--color-pitaya` | `#F2B8C6` |
| `--color-cacao` | `#5B3A2C` |
| `--color-arcilla` | `#E4D5C3` |
| `--color-azucar` | `#FFFBF5` |
| `--font-display` | Fraunces → Georgia → serif |
| `--font-text` | Manrope → system-ui → sans-serif |
| Radio | `--radius-s` 6 px · `--radius-m` 14 px · `--radius-pill` 999 px |
| Espaciado | Escala de 4 px: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 |
| Retícula | 12 columnas, máximo 1280 px, *gutter* de 24 px (desktop) / 4 columnas y 16 px (mobile) |

### 5.2 Componentes

| Componente | Especificación |
|---|---|
| **Botón primario** | Fondo Jamaica, texto Nata, Manrope 600 a 16 px, alto 52 px, radio *pill*. *Hover*: Jamaica oscurecido un 8 %. *Focus*: anillo de 3 px en Piloncillo con 2 px de separación. |
| **Botón secundario** | Contorno de 1.5 px en Piloncillo, texto Piloncillo. Sobre fondo oscuro, la versión Nata. |
| **Etiqueta de línea** | Píldora de 24 px de alto, en el color de la línea. Manrope 500 a 12 px, mayúsculas, +10 %. El texto es Piloncillo sobre Mango o Pitaya y Nata sobre Jamaica, Cacao o Piloncillo. |
| **Tarjeta de producto** | Fondo Azúcar, radio 14 px, sin sombra, borde de 1 px en Arcilla. |
| **Indicador de capas** | Tres barras de 24 × 4 px separadas 3 px. La activa va en Jamaica y las demás en Arcilla. Se usa en carruseles, pasos y formulario. |
| **Pie de imagen ilustrativa** | DM Mono a 11 px, en Nata al 80 % sobre la imagen (abajo a la izquierda) o en Cacao debajo. |
| **Campos de formulario** | Fondo Azúcar, borde de 1 px en Arcilla (Cacao en *focus*), radio 6 px, alto 52 px. Etiqueta siempre visible arriba. El error va en Jamaica con un ícono y nunca depende solo del color. |

### 5.3 Movimiento

- La duración base es de 300 ms, con `cubic-bezier(.2,.7,.2,1)`.
- Solo se usan *fade-up*, *crossfade*, *parallax* de 3 capas (máximo 12 px) y *zoom* en *hover* (máximo 1.04).
- Con `prefers-reduced-motion: reduce` se elimina todo movimiento no esencial.

### 5.4 Prohibiciones de diseño

- No usar carruseles automáticos.
- No usar *pop-ups* de entrada ni contadores de urgencia falsos.
- No usar íconos de caricatura, emojis ni ilustraciones folclóricas.
- No poner más de una zona Jamaica dominante por vista.
- No mostrar sellos, certificaciones, logos de clientes, cifras ni testimonios inventados.

---

## 6. Formulario comercial (especificación)

### 6.1 Principios

- **Un solo formulario para todos los segmentos**, con campos condicionales según el tipo de solicitud.
- **Tres pasos** (que corresponden a las tres capas): ① Quién eres → ② Qué necesitas → ③ Detalles y envío.
- Los datos deben ser útiles para que la IA clasifique el lead y para que n8n lo enrute sin intervención manual.

### 6.2 Campos

**Paso 1 · Quién eres**

| Campo | `name` | Tipo | Obligatorio | Validación |
|---|---|---|---|---|
| Nombre completo | `nombre` | texto | Sí | 2–80 caracteres |
| Correo | `email` | email | Sí | Formato de email |
| Teléfono / WhatsApp | `telefono` | tel | Sí | 10 dígitos para MX; acepta prefijo +52 |
| Empresa / negocio | `empresa` | texto | Condicional* | 2–100 caracteres |
| Ciudad | `ciudad` | texto | Sí | 2–60 caracteres |
| Estado | `estado` | lista (32 entidades de México y "Fuera de México") | Sí | — |

\* Es obligatorio cuando `tipo_solicitud` ∈ {corporativo, tienda, distribuidor, mayoreo}.

**Paso 2 · Qué necesitas**

| Campo | `name` | Tipo | Obligatorio | Opciones |
|---|---|---|---|---|
| Tipo de solicitud | `tipo_solicitud` | tarjetas seleccionables (radio) | Sí | `personal` Pedido personal / regalo · `caja_personalizada` Caja personalizada · `evento` Evento · `corporativo` Regalo corporativo · `tienda` Vender en mi tienda · `distribuidor` Distribución · `mayoreo` Mayoreo |
| Productos de interés | `productos` | checkboxes | No | Los 12 productos del catálogo, agrupados por línea |
| Cantidad aproximada | `cantidad_rango` | lista | Sí | `1-10` · `11-50` · `51-200` · `201-1000` · `1000+` (en piezas o cajas, según el tipo) |
| Unidad | `cantidad_unidad` | radio | Sí | `piezas` · `cajas` |
| Fecha requerida | `fecha_requerida` | fecha | Condicional (evento y corporativo) | Fecha futura |
| Presupuesto estimado | `presupuesto_rango` | lista | No | `sin_definir` · `bajo` · `medio` · `alto`. Los rangos en MXN se marcan `DEMO` hasta que se definan. |

**Campos condicionales según el tipo**

| Si `tipo_solicitud` = | Se muestra |
|---|---|
| `evento` | `tipo_evento` (boda, XV años, bautizo, cumpleaños, empresa, otro) · `invitados` (número) · `paleta_evento` (texto libre: "colores de tu evento") · `requiere_recuerdos` (sí/no) |
| `corporativo` | `num_destinatarios` (número) · `cobranding` (sí/no) · `mensaje_tarjeta` (sí/no) · `envio_multiple` (sí/no: varios domicilios) |
| `caja_personalizada` | `tamano_caja` (4 / 9 / 16) · `texto_sticker` (máximo 40 caracteres) |
| `tienda` | `tipo_negocio` (cafetería, tienda gourmet, concept store, otro) · `num_sucursales` (número) |
| `distribuidor` | `zona_cobertura` (texto) · `canales` (checkbox: tiendas, cafeterías, autoservicio, online, otro) |
| `mayoreo` | `frecuencia` (única, mensual, otra) · `lineas_interes` (CLASSIC / FRUIT / CACAO) |

**Paso 3 · Detalles y envío**

| Campo | `name` | Tipo | Obligatorio | Validación |
|---|---|---|---|---|
| Mensaje | `mensaje` | textarea | No | Máximo 1000 caracteres. Placeholder: "Cuéntanos tu idea, fecha, colores o cualquier detalle." |
| Medio de contacto preferido | `contacto_preferido` | radio | Sí | `email` · `whatsapp` · `llamada` |
| ¿Cómo nos conociste? | `origen` | lista | No | Instagram · TikTok · Recomendación · Búsqueda · Evento · Otro |
| Aceptación de privacidad | `acepta_privacidad` | checkbox | Sí | Debe estar marcado. Enlaza al aviso `[pendiente]`. |
| Antispam | `website` | oculto (*honeypot*) | — | Debe llegar vacío |

**Campos ocultos (automáticos):** `producto_preseleccionado` (desde "Pedir"), `seccion_origen` (qué CTA abrió el formulario), `utm_source`, `utm_medium`, `utm_campaign`, `pagina`, `fecha_envio` (ISO 8601), `idioma`.

### 6.3 Reglas de UX

- Las etiquetas están siempre visibles; el placeholder no sustituye a la etiqueta.
- La validación ocurre al salir del campo (*on blur*) y al pasar de paso. Los mensajes de error van en español claro: "Escribe un correo válido, por ejemplo nombre@empresa.com".
- El botón "Siguiente" está siempre activo; si hay errores, el foco se mueve al primer campo con error.
- Se guarda un borrador en `sessionStorage` para no perder datos si se recarga la página.
- El indicador de 3 capas avanza por paso. Se puede volver atrás sin perder datos.
- Envío: el botón queda en estado de carga ("Enviando…") y deshabilitado para evitar el doble envío.

### 6.4 Lead scoring sugerido (para la fase IA)

Esta sección solo especifica qué podrá hacer la IA en n8n; no se implementa aquí.

| Señal | Peso orientativo |
|---|---|
| `tipo_solicitud` ∈ {corporativo, distribuidor, mayoreo} | Alto |
| `cantidad_rango` ≥ `201-1000` | Alto |
| `fecha_requerida` en menos de 15 días | Prioridad (urgente) |
| `empresa` informada y email de dominio propio | Medio |
| `mensaje` con detalle (más de 80 caracteres) | Medio |
| `tipo_solicitud` = personal y `cantidad_rango` = `1-10` | Se dirige a la tienda online `[pendiente]` |

**Clasificación de salida de la IA:** `segmento` (B2C / B2B-evento / B2B-corporativo / B2B-retail / B2B-distribución), `prioridad` (alta / media / baja), `resumen` (2 líneas), `siguiente_paso` y `borrador_respuesta` (en el tono de la guía §12).

### 6.5 Payload JSON hacia el webhook de n8n

```json
{
  "lead_id": "uuid-generado-en-cliente",
  "fecha_envio": "2026-10-01T12:00:00-06:00",
  "fuente": {
    "pagina": "/",
    "seccion_origen": "corporativo",
    "producto_preseleccionado": "caja-corporativa-capas",
    "utm_source": "instagram",
    "utm_medium": "social",
    "utm_campaign": "demo"
  },
  "contacto": {
    "nombre": "Nombre Apellido",
    "email": "nombre@empresa.com",
    "telefono": "+525500000000",
    "empresa": "Empresa Demo",
    "ciudad": "Ciudad",
    "estado": "Ciudad de México",
    "contacto_preferido": "email"
  },
  "solicitud": {
    "tipo_solicitud": "corporativo",
    "productos": ["caja-corporativa-capas", "caja-capas-degustacion"],
    "cantidad_rango": "51-200",
    "cantidad_unidad": "cajas",
    "fecha_requerida": "2026-12-01",
    "presupuesto_rango": "sin_definir",
    "detalles": {
      "num_destinatarios": 120,
      "cobranding": true,
      "mensaje_tarjeta": true,
      "envio_multiple": false
    },
    "mensaje": "Texto libre del cliente"
  },
  "consentimiento": { "acepta_privacidad": true },
  "meta": { "idioma": "es-MX", "demo": true }
}
```

- Los IDs de producto son *slugs*: `leche-quemada`, `cocada-tostada`, `jamaica-cristal`, `mango-chile`, `tamarindo-sal`, `bombon-cacao-vainilla`, `tableta-capa-cajeta`, `caja-capas-degustacion`, `caja-arma-tu-capa`, `mesa-dulcera`, `recuerdo-dulcera`, `caja-corporativa-capas`.
- La URL del webhook va en una variable de entorno (`N8N_WEBHOOK_URL`) y **nunca en el código del cliente**. El envío pasa por un endpoint propio o *serverless* que valida el *honeypot* y aplica *rate-limit*.
- Respuesta esperada: `200 { "ok": true, "lead_id": "…" }`. Ante un error, el cliente muestra el estado de error de §4.9.

---

## 7. Accesibilidad

- Se apunta a **WCAG 2.2 AA**. Los pares de color permitidos están en la guía §5.4. Jamaica sobre Piloncillo se usa solo para el logotipo o texto de 24 px o más.
- Hay un enlace de salto a "Ir al contenido".
- Se usa HTML semántico: `header`, `nav`, `main`, `section` con `aria-labelledby` y `footer`.
- Todo es operable con teclado, con *focus* visible (anillo de 3 px).
- Las imágenes llevan alt descriptivo; las decorativas (texturas, `img-23`), `alt=""`.
- Los errores del formulario se anuncian con `aria-live="polite"` y se asocian con `aria-describedby`.
- Se respeta `prefers-reduced-motion`.
- Las áreas táctiles miden al menos 44 × 44 px.

## 8. SEO y metadatos

| Elemento | Valor |
|---|---|
| `<title>` | DULCERA · Dulces mexicanos contemporáneos (demo) |
| Meta description | Dulces mexicanos de siempre, hechos con otro cuidado. Cajas de regalo, eventos, regalos corporativos y mayoreo. Marca ficticia de demostración. |
| H1 único | México, en capas. |
| Open Graph | `img-01` a 1200 × 630, con el logotipo en postproducción |
| Favicon | `brand/logo-mark.svg` (y PNG de 32 y 180 px derivados) |
| Idioma | `lang="es-MX"` |
| Datos estructurados | Solo `Organization` básica sin datos inventados. Se omiten `aggregateRating` y `review`. |
| Indexación | `noindex` mientras sea demo educativa |

## 9. Rendimiento

- Las imágenes van en AVIF/WebP con `srcset`; las que están fuera del primer viewport, con *lazy-load*. `img-01` se carga con `fetchpriority="high"`.
- Las fuentes se cargan con `display=swap`. Fraunces va limitada a los ejes y pesos usados.
- Objetivo: LCP < 2.5 s, CLS < 0.1 y INP < 200 ms. Son metas técnicas de diseño, no métricas de negocio.

## 10. Checklist de aceptación

- [ ] Las 10 secciones están en el orden de §3, con el copy de §4.
- [ ] Todas las imágenes corresponden a un ID de `IMAGE_SHOTLIST.md` y llevan el pie "Imagen ilustrativa" donde se indica.
- [ ] Logos: `logo-horizontal.svg` en el header, `logo-monochrome-light.svg` en el footer y `logo-mark.svg` como favicon.
- [ ] Colores y tipografías solo desde los tokens.
- [ ] El formulario cumple §6: campos, condicionales, validaciones, *honeypot* y payload.
- [ ] Los precios, si aparecen, están marcados `DEMO`.
- [ ] No hay certificaciones, premios, cifras, clientes, instalaciones ni testimonios inventados.
- [ ] El footer incluye la nota de marca ficticia.
- [ ] Se pasaron la revisión de accesibilidad (§7) y la de rendimiento (§9).
