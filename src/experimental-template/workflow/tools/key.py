#!/usr/bin/env python3
"""Chroma-key a generated asset (flat blue background) to a transparent webp.

Usage: key.py <in.png|jpg> <out.webp> [--width 600] [--quality 88] [--tol 70] [--soft 60]

Steps: sample the real border colour (median of edge pixels, since generators drift off #0057FF),
soft-key by colour distance, despill the blue fringe, crop to content, resize, write webp.
Needs: pillow, numpy. (PIP_USER=0 python -m pip install --isolated pillow numpy)
"""
import argparse
import numpy as np
from PIL import Image


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('dst')
    ap.add_argument('--width', type=int, default=0, help='output width in px (0 = keep)')
    ap.add_argument('--quality', type=int, default=88)
    ap.add_argument('--tol', type=float, default=70, help='distance below which a pixel is fully removed')
    ap.add_argument('--soft', type=float, default=60, help='extra distance over which alpha ramps in')
    ap.add_argument('--pad', type=int, default=4)
    ap.add_argument('--spill', choices=['blue', 'magenta'], default='blue', help='fringe colour to despill (use magenta when the art itself contains blue)')
    a = ap.parse_args()

    im = Image.open(a.src).convert('RGB')
    px = np.asarray(im).astype(np.float32)
    h, w, _ = px.shape
    edge = np.concatenate([px[0], px[-1], px[:, 0], px[:, -1]])
    bg = np.median(edge, axis=0)

    dist = np.linalg.norm(px - bg, axis=2)
    alpha = np.clip((dist - a.tol) / max(a.soft, 1), 0, 1)

    # Despill: where blue exceeds the other channels in semi-transparent pixels, pull it back.
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    if a.spill == 'magenta':
        limit = g + 14
        spill = (alpha < 1) & (r > limit) & (b > limit)
        r = np.where(spill, limit, r)
        b = np.where(spill, limit, b)
    else:
        limit = np.maximum(r, g) + 12
        spill = (b > limit) & (alpha < 1)
        b = np.where(spill, limit, b)
    out = np.dstack([r, g, b, alpha * 255]).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(out, 'RGBA')

    bbox = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        l, t, rr, bb = bbox
        img = img.crop((max(l - a.pad, 0), max(t - a.pad, 0), min(rr + a.pad, w), min(bb + a.pad, h)))
    if a.width and img.width != a.width:
        img = img.resize((a.width, round(img.height * a.width / img.width)), Image.LANCZOS)

    img.save(a.dst, 'WEBP', quality=a.quality, method=6)
    print(f'{a.dst}: {img.width}x{img.height}, bg sampled {tuple(int(v) for v in bg)}')


if __name__ == '__main__':
    main()
