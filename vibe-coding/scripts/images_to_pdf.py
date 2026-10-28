"""Une capturas PNG 3840x2160 en un PDF 16:9 (13.333 x 7.5 in) listo para proyectar.

Uso: python3 scripts/images_to_pdf.py salida.pdf slide-01.png slide-02.png ...
"""
import sys
from PIL import Image


def main() -> None:
    out, *paths = sys.argv[1:]
    if not paths:
        raise SystemExit("No se recibieron imágenes")
    pages = [Image.open(p).convert("RGB") for p in paths]
    # 3840 px / 13.333 in = 288 ppp → tamaño de página de diapositiva estándar.
    pages[0].save(out, "PDF", save_all=True, append_images=pages[1:], resolution=288.0, quality=90,
                  title="Vibe Coding · Top Learning", author="Top Learning")
    print(f"✓ {out} ({len(pages)} páginas)")


if __name__ == "__main__":
    main()
