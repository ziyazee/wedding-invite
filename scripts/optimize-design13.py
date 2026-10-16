"""Generate Design 13 responsive WebP assets without changing layout.
Run with Python 3 and Pillow installed: python3 scripts/optimize-design13.py
Original images are retained. Re-running regenerates variants from originals.
"""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'public/design13/index.html'
ASSETS = PAGE.parent / 'assets'
OUTPUT = ASSETS / 'optimized'
OUTPUT.mkdir(exist_ok=True)
PREFIX = '/design13/assets/optimized/'

class Attributes(HTMLParser):
    def handle_starttag(self, tag, attrs):
        self.attrs = dict(attrs)

def attributes(tag):
    parser = Attributes()
    parser.feed(tag)
    return parser.attrs

def original(url):
    name = Path(url).name
    if url.startswith(PREFIX):
        stem = re.sub(r'-\d+\.webp$', '', name)
        return next(path for path in ASSETS.iterdir() if path.is_file() and path.stem == stem)
    return ASSETS / name

html = PAGE.read_text()
tags = re.findall(r'<img\b[^>]*>', html)
sources = {original(attributes(tag)['src']) for tag in tags}
variants = {}
for source in sorted(sources):
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert('RGBA')
        width, height = image.size
        widths = sorted({min(width, target) for target in (640, 960, 1440, width)})
        # Avoid a nearly identical 1440px copy of a 1600px source.
        widths = [w for w in widths if w != 1440 or width > 1728 or w == width]
        files = []
        for w in widths:
            target = OUTPUT / f'{source.stem}-{w}.webp'
            scaled = image if w == width else image.resize((w, round(height * w / width)), Image.Resampling.LANCZOS)
            scaled.save(target, 'WEBP', quality=88, method=6, exact=True, icc_profile=opened.info.get('icc_profile', b''))
            files.append((w, PREFIX + target.name, target.stat().st_size))
        variants[source] = files
        print(f'{source.name}: {source.stat().st_size // 1024} KB -> {files[-1][2] // 1024} KB full, {files[0][2] // 1024} KB mobile', flush=True)

preloads = {}
index = 0

def set_attr(tag, key, value):
    attr = f'{key}="{escape(str(value), quote=True)}"'
    pattern = rf'(?<![\w-]){re.escape(key)}\s*=\s*(?:"[^"]*"|\x27[^\x27]*\x27)'
    return re.sub(pattern, lambda _: attr, tag) if re.search(pattern, tag) else tag[:-1] + ' ' + attr + '>'

def update(match):
    global index
    tag = match.group(0)
    attrs = attributes(tag)
    files = variants[original(attrs['src'])]
    srcset = ', '.join(f'{url} {w}w' for w, url, _ in files)
    sizes = attrs.get('sizes', '100vw')
    tag = set_attr(tag, 'src', files[-1][1])
    tag = set_attr(tag, 'srcset', srcset)
    tag = set_attr(tag, 'sizes', sizes)
    tag = set_attr(tag, 'decoding', 'async')
    if index < 4:
        tag = set_attr(tag, 'loading', 'eager')
        tag = set_attr(tag, 'fetchpriority', 'high')
        preloads[files[-1][1]] = (srcset, sizes)
    index += 1
    return tag

html = re.sub(r'<img\b[^>]*>', update, html)
html = re.sub(r'\n\s*<!-- d13-responsive-preloads -->[\s\S]*?<!-- /d13-responsive-preloads -->', '', html)
links = '\n'.join(f'    <link rel="preload" as="image" href="{url}" imagesrcset="{escape(srcset, quote=True)}" imagesizes="{escape(sizes, quote=True)}" fetchpriority="high">' for url, (srcset, sizes) in preloads.items())
html = re.sub(r'<meta name="viewport"[^>]*>', lambda match: match.group(0) + '\n    <!-- d13-responsive-preloads -->\n' + links + '\n    <!-- /d13-responsive-preloads -->', html, count=1)
PAGE.write_text(html)
old_total = sum(source.stat().st_size for source in sources)
new_total = sum(files[-1][2] for files in variants.values())
mobile_total = sum(next(item[2] for item in files if item[0] >= min(960, files[-1][0])) for files in variants.values())
print(f'Unique image payload: original {old_total / 1e6:.2f} MB; full-size WebP {new_total / 1e6:.2f} MB; up to 960px WebP {mobile_total / 1e6:.2f} MB', flush=True)
