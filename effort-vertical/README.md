# Claude · effort levels — versión vertical 9:16

Recreación de la animación de los niveles de esfuerzo de Claude, rediseñada de forma nativa para formato vertical (TikTok, Reels y Shorts).

Todo está construido con código: React, TypeScript y Remotion, con ilustraciones en SVG procedural. No usa imágenes, capturas ni assets externos.

| Salida | Valor |
|---|---|
| Resolución | 1080 × 1920 (9:16) |
| FPS | 60 |
| Duración | 59.0 s (3540 frames), igual que el original |
| Códec | MP4 H.264, CRF 16, yuv420p |
| Archivo | `out/effort-vertical.mp4` |

## Uso

```bash
npm install
npm run dev            # Remotion Studio: previsualización interactiva
npm run render         # render final -> out/effort-vertical.mp4
```

### Otros scripts

| Script | Qué hace |
|---|---|
| `npm run render:preview` | Render rápido a media resolución -> `out/effort-vertical-preview.mp4` |
| `npm run render:frame -- --frame=1800` | Un solo fotograma -> `out/frame.png` |
| `npm run render:stills -- 120 960 2600` | Varios fotogramas de revisión en `out/stills/`. Sin argumentos usa un set por escena. Se añade `--scale=0.5` para ir más rápido |
| `npm run analyze:reference` | `ffprobe`, fotogramas por segundo, hoja de contactos y cambios de escena de `reference.mp4` (en `reference-frames/`) |
| `npm run sfx` | Sintetiza los efectos de sonido opcionales en `public/sfx/` |
| `npm run render:sfx` | Render con la pista de efectos -> `out/effort-vertical-sfx.mp4` |
| `npm run typecheck` | Comprobación de tipos de TypeScript |

> **Chromium sin conexión.** Si el entorno no puede descargar Chrome Headless Shell, se puede indicar un Chromium ya instalado:
> `REMOTION_BROWSER_EXECUTABLE=/ruta/a/chrome npm run render`.

## Estructura

```
src/
  Root.tsx                    composición 1080×1920 @ 60 fps
  fonts.ts                    IBM Plex Mono local (public/fonts, licencia OFL)
  compositions/
    EffortEvolution.tsx       ensambla capas: fondo, escena con cámara, UI
    director.ts               frame -> pose/look del robot + cámara + flash
  components/
    PaperBackground.tsx       papel procedural (feTurbulence + fibras + motas)
    EffortMenu.tsx            lista superior con pill deslizante y checks a mano
    EffortBadge.tsx           pill inferior "✦ effort: …" con efecto máquina de escribir
    Ground.tsx                línea de suelo + sombra con trama de lápiz
    RobotBase.tsx             el robot: geometría, poses, ojos, texturas, slots
    RobotLow.tsx              laptop
    RobotMedium.tsx           headset, display de código, teclado
    RobotHigh.tsx             teclado -> tablero de ajedrez, piezas, manos
    RobotXHigh.tsx            gafas, burbujas, bobinas Tesla, cables, matraz
    RobotMax.tsx              armadura mecha, visor, HUD
    RobotUltraCode.tsx        ojos violeta + aura
    RobotUltraThink.tsx       arcoíris, cápsulas, halo, órbitas, fade final
  effects/
    SketchTexture.tsx         trama y vetas procedurales (bucketed paths)
    Electricity.tsx           rayos por desplazamiento de punto medio
    CloneArmy.tsx             ejército en perspectiva con 3 niveles de detalle
    EnergyHalo.tsx            halo pastel concéntrico + anillos orbitales
    Particles.tsx             partículas deterministas sin estado
    Grain.tsx / Flash.tsx / Filters.tsx
  audio/
    sfx.ts, SoundLayer.tsx    hoja de cues sincronizada con BEATS
  utils/
    timing.ts                 fases y beats (fuente única de verdad)
    animation.ts              easings, springs, parpadeo, respiración
    colors.ts                 paleta muestreada de la referencia
    random.ts                 random con semilla (render 100 % reproducible)
    sketch.ts                 trazos "a mano": wobble, rounded rects, hatch
```

## Cómo funciona

- **Una sola línea de tiempo.** `utils/timing.ts` define las 7 fases y cada beat interno: transiciones, golpes de cámara, cues de audio. Para retocar el ritmo basta con editar ese archivo.
- **El director.** `director.ts` parte de una pose idle con respiración, parpadeos semialeatorios, micro-movimiento de ojos y brazos. Después aplica en orden la contribución de cada nivel (`applyLow` … `applyUltraThink`). Así las transiciones se superponen sin cortes.
- **Look dibujado a mano.**
  - Los contornos se desplazan con ruido suave y "hierven" cada 6 frames.
  - Las superficies llevan vetas claras y trama diagonal oscura generadas con semilla.
  - El suelo usa una sombra de trazos de lápiz.
  - El papel combina `feTurbulence` estático (rasterizado una sola vez) con un grano animado que solo se desplaza.
- **Rendimiento del ejército.**
  - Las filas cercanas usan `RobotBase` con detalle medio.
  - Las intermedias usan un robot ligero.
  - Las lejanas se dibujan como un puñado de `<path>` por fila.
  - En total hay unos 470 agentes en pantalla con un DOM contenido.
- **Determinista.** No hay `Math.random()`: cualquier frame se renderiza igual en cualquier máquina y en cualquier orden.

## Referencia

`REFERENCE_ANALYSIS.md` documenta el análisis del video original: duración, timestamps, paleta muestreada, geometría del robot, estados y decisiones de adaptación a 9:16.

`reference.mp4` no estaba disponible al construir el proyecto. El análisis se hizo sobre la hoja de contactos y los fotogramas compartidos. Si se añade el video, `npm run analyze:reference` extrae lo necesario para verificar o ajustar los tiempos en `src/utils/timing.ts`.
