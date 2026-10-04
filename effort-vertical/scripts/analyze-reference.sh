#!/usr/bin/env bash
# Phase-1 helper: inspect reference.mp4 and dump frames + a contact sheet.
# Usage: npm run analyze:reference [-- path/to/reference.mp4]
set -euo pipefail
REF="${1:-reference.mp4}"
OUT="reference-frames"
if [ ! -f "$REF" ]; then
  echo "No se encontró $REF. Coloca el video original como reference.mp4 en esta carpeta." >&2
  exit 1
fi
mkdir -p "$OUT"
echo "== ffprobe =="
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,sample_rate,channels -of default=noprint_wrappers=1 "$REF" | tee "$OUT/ffprobe.txt"
echo "== 1 frame por segundo -> $OUT/ =="
ffmpeg -loglevel error -y -i "$REF" -vf "fps=1,scale=960:-2" -q:v 3 "$OUT/sec_%03d.jpg"
echo "== hoja de contactos (cada 2 s) -> $OUT/contact-sheet.jpg =="
ffmpeg -loglevel error -y -i "$REF" -vf "fps=0.5,scale=480:-2,tile=5x6:padding=6:margin=6:color=white" -frames:v 1 -q:v 3 "$OUT/contact-sheet.jpg"
echo "== cambios de escena (umbral 0.25) =="
ffmpeg -hide_banner -i "$REF" -vf "select='gt(scene,0.25)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | tee "$OUT/scene-changes.txt" || true
echo "== nivel de audio (si existe) =="
ffmpeg -hide_banner -i "$REF" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume" || echo "sin pista de audio"
echo "Listo. Revisa $OUT/ y actualiza REFERENCE_ANALYSIS.md / src/utils/timing.ts si los tiempos difieren."
