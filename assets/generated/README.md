# /assets/generated — imágenes finales

Aquí van las fotografías finales (generadas con IA o producidas en estudio) de las 24 tomas de
[`brand/IMAGE_SHOTLIST.md`](../../brand/IMAGE_SHOTLIST.md). Mientras una toma no esté aquí, la web
muestra su **render provisional** de `/assets/placeholders` con la etiqueta "Provisional · img-XX".

## Nombres de archivo esperados

Un archivo por toma (`.webp`, `.avif`, `.jpg` o `.png`):

```
dulcera-img-01-hero-caja-capas.webp
dulcera-img-02-degustacion-cenital.webp
...
```

O varias anchuras para `srcset` (recomendado):

```
dulcera-img-03-macro-mango-chile-800.webp
dulcera-img-03-macro-mango-chile-1600.webp
dulcera-img-03-macro-mango-chile-2400.webp
```

La lista completa de nombres está en `js/data.js` (`SHOTS[id].file`).

## Activar las imágenes

```bash
node tools/scan-assets.mjs
```

El script detecta los archivos de esta carpeta y reescribe `manifest.json`. La web solo pide las
imágenes que aparecen en el manifest, así que no genera errores 404 por tomas faltantes.

## Reglas (BRAND_GUIDE.md §11.4)

- Las imágenes de IA son representaciones conceptuales: no se presentan como fotos reales.
- Las tomas 15–22 se muestran con el pie "Imagen ilustrativa" (lo agrega la web automáticamente).
- El logotipo nunca se genera con IA: se coloca en postproducción con los SVG de `/brand`.
