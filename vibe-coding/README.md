# VIBE CODING · Presentación

**De una idea escrita a una aplicación funcional: cómo la inteligencia artificial está transformando la creación de software.**

Clase en vivo del programa *Inteligencia Artificial y Automatización con n8n* de Top Learning · 27 de octubre de 2026 · 25 minutos · español de México · personas adultas sin experiencia obligatoria en programación.

## Entregables

| Archivo | Para qué sirve |
|---|---|
| [`dist/vibe-coding.html`](dist/vibe-coding.html) | **Presentación principal.** Un solo archivo autocontenido (Three.js, fuentes, estilos y escenas incrustados). Se abre con doble clic y funciona sin internet. |
| [`dist/vibe-coding.pdf`](dist/vibe-coding.pdf) | Versión para proyectar o compartir: 16 páginas a 3840 × 2160 (15 diapositivas + anexo de fuentes), con todos los pasos visibles. |
| [`dist/vibe-coding.pptx`](dist/vibe-coding.pptx) | PowerPoint 16:9: cada diapositiva es una imagen 4K y el guion completo va en las **notas del presentador**. El texto de las diapositivas no es editable (decisión acordada); las notas sí. |
| [`dist/guion-docente.pdf`](dist/guion-docente.pdf) · [`.md`](dist/guion-docente.md) | Guion docente imprimible: tiempos, guion oral, explicación técnica, analogía, pregunta, transición, errores que evitar y fuentes por diapositiva. |
| [`materiales/prompt-referencia.md`](materiales/prompt-referencia.md) | Especificación lista para copiar en Claude Code, Codex, Cursor u OpenCode para el ejercicio, con datos ficticios, valores de control y errores frecuentes. |

## Cómo presentar

1. Abre `dist/vibe-coding.html` en **Chrome o Edge** actualizados (la aceleración por hardware debe estar activa para las escenas 3D).
2. Pulsa **P** para abrir la **vista de presentador** en otra ventana: notas, cronómetro total (25:00), tiempo por diapositiva y qué viene después. Si el navegador bloquea la ventana emergente, permítela para ese archivo.
3. Pulsa **F** para pantalla completa en la ventana de la presentación.
4. En **Google Meet**: *Presentar ahora* → **Una pestaña** (o *Una ventana*) y elige la de la presentación, no la del presentador. Compartir una pestaña suele dar mejor nitidez que compartir toda la pantalla.
5. Si el equipo va lento durante la videollamada, pulsa **L** (modo ligero: menos partículas y menor resolución WebGL).

| Tecla | Acción |
|---|---|
| → · Espacio · AvPág · clic | Siguiente paso o diapositiva |
| ← · RePág | Paso o diapositiva anterior |
| Inicio · Fin | Primera / última |
| número + pausa | Ir a esa diapositiva (por ejemplo, 9) |
| P | Vista de presentador |
| N | Notas en esta ventana (para ensayar) |
| G | Índice con tiempos |
| T | Iniciar / pausar cronómetro |
| L | Modo ligero |
| ? | Ayuda |

Enlace directo a una diapositiva y paso: `vibe-coding.html#/9/2`.

## Estructura y tiempos (25:00)

| # | Diapositiva | Tiempo | Visual principal |
|---|---|---|---|
| 1 | VIBE CODING: el software cambia de paradigma | 1:00 | WebGL: núcleo de partículas (idea) que fluye hacia capas de vidrio (software) |
| 2 | El problema antes de la IA | 1:30 | Dos pistas de etapas: sin IA / con IA |
| 3 | ¿Qué es exactamente el vibe coding? | 2:30 | Cita de Karpathy, dos sentidos del término y línea de tiempo |
| 4 | ¿Cómo funciona? | 2:00 | Circuito animado de 7 etapas con roles persona / IA |
| 5 | Qué sucede detrás de una instrucción | 2:00 | WebGL: LLM → frontend, backend y base de datos + glosario |
| 6 | Tres formas de desarrollar software | 2:00 | Mapa conceptual (no medido) + comparativa |
| 7 | Herramientas del ecosistema | 1:30 | Tres familias no equivalentes |
| 8 | De un prompt básico a una especificación útil | 2:00 | Prompt vago → especificación de 7 campos |
| 9 | Caso práctico: dashboard financiero | 2:30 | WebGL: Excel → backend → API → dashboard, con simulación de cambio |
| 10 | Cómo comprobar que funciona | 1:30 | Ciclo de validación + error de signos real |
| 11 | Aplicaciones reales en empresas | 1:30 | Cuatro mini-interfaces con «necesita además» |
| 12 | Riesgos y limitaciones | 1:30 | Línea de flotación: lo que la demo no muestra |
| 13 | De prototipo a producto profesional | 1:00 | Escalera isométrica de madurez |
| 14 | El ejercicio de hoy | 1:30 | Seis pasos + dashboard de referencia |
| 15 | Conclusión | 1:00 | WebGL de cierre + mensaje y pregunta final |
| A | Anexo · Fuentes | — | Fuera de los 25 minutos |

El guion oral está escrito a 65–120 palabras por minuto para dejar tiempo a preguntas, pausas y animaciones.

**Arco didáctico.** La secuencia pedida PROBLEMA → CONCEPTO → EJEMPLO → FUNCIONAMIENTO → LIMITACIONES → APLICACIÓN REAL y el orden de diapositivas solicitado no coinciden del todo: el funcionamiento (4–5) aparece antes del ejemplo (8–10) y las aplicaciones (11) antes de las limitaciones (12–13). Se respetó el orden de diapositivas pedido; el guion lo explica.

## Precisión y fuentes

- **Hechos documentados:** Andrej Karpathy acuñó «vibe coding» en X el 2 de febrero de 2025 (citas textuales en la diapositiva 3); Simon Willison distinguió vibe coding y programación asistida por IA (19 de marzo de 2025); Martin Fowler describe usos y riesgos en su bliki; Collins Dictionary lo eligió palabra del año 2025 (6 de noviembre de 2025); la «alucinación de paquetes» está documentada por Spracklen et al. (USENIX Security 2025).
- **Interpretaciones (señaladas como tales):** el «uso amplio» del término en 2026, el mapa conceptual de la diapositiva 6 y la agrupación de herramientas.
- **No se incluyen** estadísticas de productividad, cuotas de mercado, precios ni predicciones.
- **Verificación:** las referencias se contrastaron con búsquedas web en octubre de 2026. El entorno donde se construyó la presentación no tenía acceso directo a x.com, simonwillison.net, martinfowler.com ni code.visualstudio.com; por eso las citas textuales usadas son solo los fragmentos confirmados por varias fuentes coincidentes. **Antes de la clase conviene abrir los enlaces del anexo** y comprobar que siguen vigentes. La fecha exacta de publicación del bliki de Fowler no se pudo confirmar y no se menciona.
- Las capacidades de las herramientas (diapositiva 7) cambian con frecuencia; se describen de forma general según su documentación oficial.
- **Datos del caso práctico:** 100 % ficticios. Todas las cifras salen de [`src/content/data.js`](src/content/data.js) y el build comprueba la aritmética (ingresos 2,750,000 − egresos 2,038,000 = flujo neto 712,000; tras la simulación, 682,000).

## Diseño

- Paleta estricta: `#101C27` (fondo), `#222522` (grafito), `#C8EC88` (único acento), `#F3F0E5` (texto) y grises neutros.
- Tipografía: Inter Tight (titulares), Inter (texto) y JetBrains Mono (etiquetas), incrustadas.
- Escenario fijo 16:9 de 1920 × 1080 escalado a cualquier pantalla; el canvas WebGL se dibuja hasta 3840 × 2160.
- El 3D se reserva para las diapositivas donde aporta claridad (1, 5, 9 y 15); el resto usa diagramas SVG y CSS 3D.
- Texto mínimo en pantalla de 14 px sobre 1920 (fuera de las maquetas decorativas), pensado para la compresión de una videollamada; respeta `prefers-reduced-motion`.

## Reconstruir

Requisitos: Node.js 18+, Python 3 con Pillow y python-pptx, Chromium de Playwright.

```bash
npm install
```

```bash
npm run build    # dist/vibe-coding.html, guion .md, notas y prompt de referencia (verifica datos y tiempos)
```

```bash
npm run qa       # recorre las 62 combinaciones de diapositiva y paso: consola, desbordes, superposiciones
```

```bash
npm run export   # PNG 4K, dist/vibe-coding.pdf y dist/guion-docente.pdf
```

```bash
npm run pptx     # dist/vibe-coding.pptx
```

Para cambiar cifras, textos o tiempos, edita `src/content/` (`data.js`, `notes.js`, `sources.js`) y `src/index.html`; el build vuelve a comprobar que los tiempos sumen 25:00 y que la aritmética del caso sea coherente.

## Estructura del código

```
src/
  index.html            diapositivas
  styles/deck.css       sistema visual
  content/              datos del caso, notas docentes y fuentes (única fuente de verdad)
  js/deck.js            navegación, pasos, índice, notas
  js/presenter.js       vista de presentador y cronómetro
  js/charts.js          gráficos SVG generados desde los datos
  js/scenes/            escenas Three.js (portada/cierre, arquitectura, flujo Excel)
scripts/                build, QA, exportación y PPTX
```
