# Build side-by-side review sheets from out/stills/*.png (needs Pillow).
import sys, glob, os
from PIL import Image, ImageDraw
files = sorted(glob.glob('out/stills/f*.png'))
if len(sys.argv) > 1:
    want = set(int(a) for a in sys.argv[1:])
    files = [f for f in files if int(os.path.basename(f)[1:5]) in want]
per = 3
w, h = 432, 768
os.makedirs('out/sheets', exist_ok=True)
for i in range(0, len(files), per):
    group = files[i:i+per]
    sheet = Image.new('RGB', (w*len(group), h+28), 'white')
    d = ImageDraw.Draw(sheet)
    for j, f in enumerate(group):
        im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS)
        sheet.paste(im, (j*w, 28))
        fr = int(os.path.basename(f)[1:5])
        d.text((j*w+8, 6), f"frame {fr}  t={fr/60:.2f}s", fill='black')
    out = f"out/sheets/sheet_{i//per:02d}.png"
    sheet.save(out)
    print(out)
