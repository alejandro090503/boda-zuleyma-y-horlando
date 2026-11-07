"""Portada del link (og-image.jpg 1200x630): fondo + THE WEDDING OF / Zuleyma & Horlando / APRIL 3, 2027.
Uso: python tools/og.py <fondo> [salida]"""
import sys, urllib.request, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(BASE, 'og-image.jpg')
W, H = 1200, 630

bg = ImageOps.fit(Image.open(src).convert('RGB'), (W, H), Image.LANCZOS, centering=(0.5, 0.5))
# velo ivory suave al centro para que el texto respire
veil = Image.new('L', (W, H), 0); ImageDraw.Draw(veil).ellipse((210, 90, 990, 540), fill=150)
veil = veil.filter(ImageFilter.GaussianBlur(70))
bg = Image.composite(Image.new('RGB', (W, H), (253, 248, 236)), bg, veil)

cg = os.path.join(BASE, 'tools', 'CormorantGaramond-SemiBold.ttf')
if not os.path.exists(cg):
    urllib.request.urlretrieve('https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf', cg)
gv = os.path.join(BASE, 'fonts', 'GreatVibes.ttf')

def gold(size):
    g = Image.new('RGB', size)
    d = ImageDraw.Draw(g)
    stops = [(0, (122, 94, 46)), (.3, (176, 140, 74)), (.48, (228, 203, 146)), (.62, (160, 124, 62)), (1, (110, 84, 40))]
    for x in range(size[0]):
        t = x / max(1, size[0] - 1)
        for i in range(len(stops) - 1):
            if stops[i][0] <= t <= stops[i + 1][0]:
                a, b = stops[i], stops[i + 1]; k = (t - a[0]) / (b[0] - a[0])
                c = tuple(int(a[1][j] + (b[1][j] - a[1][j]) * k) for j in range(3)); break
        d.line([(x, 0), (x, size[1])], fill=c)
    return g

def put(text, font, cy, tracking=0, shadow=True):
    tmp = Image.new('L', (W, 400), 0); d = ImageDraw.Draw(tmp)
    if tracking:
        x = 0
        for ch in text:
            d.text((x, 100), ch, font=font, fill=255); x += font.getlength(ch) + tracking
        tw = x - tracking
    else:
        d.text((0, 100), text, font=font, fill=255); tw = font.getlength(text)
    bbox = tmp.getbbox(); m = tmp.crop(bbox); w, h = m.size
    x0 = (W - w) // 2; y0 = int(cy - h / 2)
    if shadow:
        sh = Image.new('L', (W, H), 0); sh.paste(m, (x0, y0 + 2)); sh = sh.filter(ImageFilter.GaussianBlur(3))
        bg.paste(Image.new('RGB', (W, H), (120, 96, 60)), (0, 0), sh.point(lambda v: v * 0.35))
    bg.paste(gold((w, h)), (x0, y0), m)
    return x0, y0, w, h

bd = os.path.join(BASE, 'fonts', 'BodoniModa.ttf')
f1 = ImageFont.truetype(bd, 24)
try: f1.set_variation_by_axes([500, 24])
except Exception: pass
put('THE WEDDING OF', f1, 168, tracking=9, shadow=False)
put('Zuleyma & Horlando', ImageFont.truetype(gv, 138), 300)
f2 = ImageFont.truetype(bd, 32)
try: f2.set_variation_by_axes([500, 24])
except Exception: pass
x, y, w, h = put('APRIL 3, 2027', f2, 452, tracking=10, shadow=False)
d = ImageDraw.Draw(bg); cy = y + h // 2
for a, b in [(x - 150, x - 30), (x + w + 30, x + w + 150)]:
    d.line([(a, cy), (b, cy)], fill=(176, 140, 74), width=2)
for cx in (x - 30, x + w + 30):
    d.polygon([(cx, cy - 6), (cx + 6, cy), (cx, cy + 6), (cx - 6, cy)], fill=(176, 140, 74))
bg.save(out, quality=88, optimize=True, progressive=True)
print('ok', out)
