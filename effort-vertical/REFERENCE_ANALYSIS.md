# REFERENCE_ANALYSIS — "Claude effort levels" (original 16:9)

> **Fuente del análisis.** `reference.mp4` **no estaba en el repositorio** cuando se hizo este análisis.
> Se trabajó con los tres materiales que se entregaron en la conversación:
>
> 1. Una hoja de contactos de una grabación de pantalla (OBS) de 12 fotogramas, en 0.0 / 6.2 / 12.5 / 18.7 / 24.9 / 31.2 / 37.4 / 43.6 / 49.9 / 56.1 / 62.3 / 68.5 s.
> 2. Un fotograma en alta resolución del robot base (≈1365×577).
> 3. Un fotograma en alta resolución de ULTRACODE con el ejército (≈1363×679).
>
> Cuando se coloque `reference.mp4` en esta carpeta, `npm run analyze:reference` ejecuta `ffprobe`
> y extrae fotogramas y una hoja de contactos en `reference-frames/`, para validar o corregir este documento.
> Los valores marcados con **(estimado)** salen de la hoja de contactos y deben verificarse con el video.

## 1. Duración y formato

| Dato | Valor | Nivel de certeza |
|---|---|---|
| Duración del video original | **0:59** (el reproductor de x.com muestra `0:00 / 0:59`) | Verificado en el fotograma de 6.2 s |
| Desfase de la grabación OBS | El video empieza ≈ 6.2 s después de iniciar la grabación | Inferido |
| Relación de aspecto | 16:9 horizontal | Verificado |
| FPS / códec | Desconocido sin el archivo | Pendiente |
| Audio | Desconocido sin el archivo | Pendiente |

**Decisión:** la versión vertical dura **59.0 s = 3540 frames a 60 fps**.

## 2. Escenas y timestamps (tiempo del video = tiempo de grabación − 6.2 s)

El badge inferior se escribe con efecto máquina de escribir al inicio de cada nivel. Se ve a medio escribir
(`eff`, `ef`, `effo`, `effort: ultracod`), así que el inicio de cada fase se puede deducir con bastante precisión.

| Fase | Inicio (estimado) | Evidencia en la hoja de contactos |
|---|---|---|
| LOW | 0.0 s | 0.0 s: robot base, pill `low` activa, un objeto beige empieza a asomar bajo el cuerpo |
| MEDIUM | ≈ 6.0 s | 6.3 s: headset con micrófono, ceño fruncido, teclado beige delante; badge `✦ eff` |
| HIGH | ≈ 12.2 s | 12.5 s: tablero de ajedrez en perspectiva con marco de madera; manos sobre el tablero; badge `✦ ef` |
| XHIGH | ≈ 18.3 s | 18.7 s: gafas redondas enormes con ojos grandes; badge `✦ effo` |
| (XHIGH, 2.º beat) | ≈ 24–25 s | 25.0 s: robot base sin gafas y **burbujas de pensamiento** dibujadas a lápiz sobre la cabeza; la pill sigue en `xhigh` |
| MAX | ≈ 28.5 s | 31.2 s: mecha con armadura beige, visor negro con lentes ámbar y HUD `EFFORT: MAX` |
| ULTRACODE | ≈ 36.0 s | 37.4 s: fila horizontal de clones y el robot principal con ojos violeta; badge `✦ effort: ultracod` |
| (ULTRACODE, ejército) | ≈ 40–47 s | 43.7 s: ejército en perspectiva, más de 15 filas; el robot principal delante y más bajo |
| ULTRATHINK | ≈ 48.0 s | 49.9 s: cuerpo arcoíris con bandas onduladas verticales y ojos cápsula blancos; badge con texto arcoíris |
| (ULTRATHINK, clímax) | ≈ 53–58 s | 56.1 s: halo pastel concéntrico, elipses de energía en el suelo y partículas |
| Final | ≈ 58–59 s | En la grabación ya no se ve, porque OBS corta. Según el brief, el robot vuelve a su estado normal |

**Ritmo:** las cuatro primeras fases duran ≈ 6 s cada una. XHIGH (≈ 10 s), ULTRACODE (≈ 12 s) y ULTRATHINK (≈ 10 s)
son más largas: el video acelera la complejidad visual hacia el final.

**Ciclo de vida del badge:** aparece al inicio de la fase, se escribe a ≈ 12–14 caracteres/s, se mantiene unos segundos
y **desaparece** a mitad de fase (no se ve en 25.0 s, 31.2 s ni 43.7 s).

## 3. Paleta (muestreada de los fotogramas)

| Elemento | Muestra | Uso en la versión vertical |
|---|---|---|
| Papel (mediana) | `#E8E7DF` / `#E8E7E0` | Base `#ECEAE2`, con manchas `#F3F1E9` / `#E1DED5` |
| Cuerpo (centro) | `#D77756` | `#DB7452` |
| Brillos (vetas arriba a la izquierda) | hasta `#EE9270` | `#F0936D` |
| Banda derecha del cuerpo | `#D15440` | `#CF5540` |
| Banda inferior del cuerpo | `#C84B3C` | `#C44A3A` |
| Contorno | `#2F1D20` | `#2C1E1F` |
| Ojos | `#301B20` | `#2E1C1F` |
| Sombra en el suelo (trama) | `#BDB8B2` | Trazos `#6F675F`, con opacidad baja |
| Línea de suelo | `#D1CFC8` | `#CFCBC2`, 2 px |
| Menú inactivo | `#DFDCD5` (muy tenue) | `#CFCBC3` |
| Pill / badge | `#1E1519` | `#1A1416` |
| Ojos violeta (ULTRACODE) | anillo `#AA7DC1`, núcleo `#F6EAFD` | Mismos valores, con halo `#B9A3E8` |
| Halo violeta | `#D8CBDE` | Glow con desenfoque |
| Ejército lejano | `#B9ACA9` (desaturado hacia el papel) | Mezcla por profundidad hacia el papel |
| Armadura MAX | `#F0E1C7` | `#EFE2CA`, con sombra `#D9CDB8` |
| Lentes MAX | `#EFC88E` | `#F6C27A` → brillo `#FFB347` |
| HUD | Fondo `#291E1B`, `MAX` en ámbar | `#1A1416`, ámbar `#F2A24A` |
| Arcoíris ULTRATHINK | `#F06D4D` `#FA8B4D` `#FDBA55` `#8FB679` `#7FA0C1` `#8392C9` `#9A80BB` `#BB6FB0` | Las mismas bandas |

## 4. Layout del original (16:9)

- **Menú:** esquina superior izquierda, a ≈ 4.5 % del ancho y ≈ 6 % del alto. Siete filas con interlineado ≈ 3.4 % del alto.
  Fuente monoespaciada con remates (slab), muy parecida a **IBM Plex Mono**.
  - Niveles completados: casilla con un check dibujado a mano que sobresale de la caja.
  - Nivel actual: pill negra con icono `✦`.
  - Niveles pendientes: casilla vacía y texto casi invisible.
- **Robot:** centrado, con el cuerpo ≈ 19 % del ancho del frame. Proporción del cuerpo 1.62:1. Ver la geometría en la sección 5.
- **Suelo:** línea de 1–2 px de ≈ 8 % a 92 % del ancho, a ≈ 74 % del alto. Las patas apoyan justo sobre ella.
- **Badge:** esquina inferior izquierda, a ≈ 5 % del ancho y ≈ 91 % del alto. Pill negra con sombra.
- **Mucho espacio negativo lateral.** Es la razón principal para recomponer en vertical en lugar de recortar.

## 5. Geometría del robot (medida sobre el fotograma en alta resolución)

| Parte | Proporción respecto al cuerpo (A = ancho, H = alto) |
|---|---|
| Cuerpo | A:H = 1.62:1, radio de esquina ≈ 0.06 H, contorno ≈ 0.018 A |
| Ojos | ancho 0.085 A, alto 0.25 H; centros en x = 0.235 A y 0.754 A, y = 0.44 H; brillo blanco cuadrado arriba |
| Brazos | 0.15 A × 0.28 H, centrados en y = 0.57 H y sobresaliendo del cuerpo; el derecho con banda oscura |
| Patas | 4 patas de 0.085 A × 0.28 H, con centros en x = 0.135 / 0.304 / 0.677 / 0.85 A |
| Sombra | Elipse de trama a lápiz de ≈ 1.42 A de ancho |
| Texturas | Vetas horizontales claras arriba a la izquierda, trama diagonal oscura (8–20 %) abajo a la derecha, cross-hatching en la esquina inferior derecha |

## 6. Descripción de cada estado

1. **LOW:** robot base relajado. El brief añade una laptop beige con tapa y círculo central (en la referencia asoma un objeto beige bajo el cuerpo). Movimiento mínimo.
2. **MEDIUM:** headset negro sobre la parte superior, auriculares laterales y micrófono hacia la boca. Ojos con ceño, porque un párpado diagonal corta la parte superior del ojo. Los brazos bajan sobre un teclado beige ancho con una tecla naranja.
3. **HIGH:** tablero de ajedrez en perspectiva (trapecio) con marco de madera, casillas crema y canela, y piezas blancas y negras simplificadas. Los brazos se apoyan en los bordes del tablero.
4. **XHIGH:** gafas redondas negras muy grandes, con iris marrón y pupila oscura. En el 2.º beat aparecen burbujas de pensamiento a lápiz. El brief añade bobinas Tesla, cables, electricidad verde, matraz y levitación.
5. **MAX:** cuerpo naranja con armadura beige:
   - hombreras en las esquinas superiores y placas laterales con ranuras;
   - visor negro con dos lentes ámbar unidas por una línea;
   - placa pectoral con un engranaje;
   - patas convertidas en dos botas grandes.

   El HUD queda arriba a la derecha y se une al robot con una línea fina ámbar. Tiene esquinas de mira, `EFFORT: MAX` (MAX en ámbar), 5 rombos y `PWR 100%`.
6. **ULTRACODE:** robot base con ojos violeta brillantes y un halo violeta alrededor. Los clones aparecen primero en fila y luego como ejército en perspectiva. Las filas lejanas son más pequeñas, desaturadas y se funden con el papel.
7. **ULTRATHINK:** cuerpo arcoíris con bandas onduladas verticales y ojos cápsula blancos con destellos. Las patas y los brazos toman colores del arcoíris y hay un contorno rosado brillante. Lo acompañan un halo pastel enorme, elipses de energía en el suelo y partículas.

## 7. Cámara

En los fotogramas, la cámara es **fija**: el robot no cambia de escala entre fases, salvo en el ejército, donde baja para dejar
ver la profundidad. Los movimientos de cámara del brief (push-in, micro-shake) se aplican con mucha sutileza para no romper esa sensación.

## 8. Transiciones observadas o inferidas

Entre fotogramas separados por más de 6 s no se pueden medir las transiciones directamente. Sí se infiere lo siguiente:

- El robot conserva la **posición en el suelo** en todas las fases. Las transformaciones ocurren *sobre* el personaje, no con cortes de escena.
- Los accesorios aparecen y desaparecen en torno al cuerpo, que sigue siendo el mismo (teclado → tablero, ojos → gafas → visor).
- El 2.º beat de XHIGH (burbujas y robot sin gafas) muestra que dentro de una misma fase hay sub-momentos.

## 9. Decisiones de adaptación a 9:16 (no son del original)

- El robot es ≈ 1.75× más grande proporcionalmente: cuerpo de 420×258 px en un frame de 1080 px de ancho.
- El menú está en x = 70, y = 120 con fuente de 28 px. El badge está en x = 70, y ≈ 1660.
- El suelo está en y = 1300.
- En XHIGH las bobinas ocupan casi todo el ancho. En ULTRACODE el ejército sube en perspectiva hasta y ≈ 470. En ULTRATHINK un halo de 850 px rodea al robot levitando.
- Al final, el menú se reinicia en cascada y vuelve a `low` para que el video haga **loop perfecto** en Reels/TikTok.
  Es una mejora propia, no algo visto en la referencia.
