# Template Asset Audit — Active Templates

Audited: 2026-11-05. Referenced assets only (unused files already moved to `public/unused/`).

---

## Native React (done or near-done)

| ID | Template | Images | Video | Audio | Total | Status |
|----|----------|--------|-------|-------|-------|--------|
| 5 | Secret Garden | 1.6 MB | 1.0 MB | 938 KB | 3.5 MB | Done |
| 1 | Royal Grace | 688 KB | 2.7 MB | 1.5 MB | 4.9 MB | Done |
| 2 | Majestic | 1.5 MB | 1.1 MB | 1.1 MB | 3.7 MB | Done |

## Standalone React (React components, not using shared contract)

| ID | Template | Images | Video | Audio | Total | Status |
|----|----------|--------|-------|-------|-------|--------|
| 4 | Mandap at Dusk | 1.8 MB | 975 KB | 667 KB | 2.8 MB | Done |
| 3 | A Timeless Union | 8.0 MB | — | 733 KB | 8.7 MB | Done |
| 8 | Artful Love Story | 17.2 MB | — | — | 18.8 MB | Done |

## AnimatedInvitation (HTML + DOM parsing — needs migration)

| ID | Template | Images | Video | Audio | Total | Status |
|----|----------|--------|-------|-------|-------|--------|
| 7 | Bloom | 690 KB | 2.3 MB | 2.1 MB | 5.1 MB | Done |
| 6 | Embroidered Garden | 1.6 MB | 761 KB | 2.7 MB | 3.5 MB | Done |

## OrderFrame / iframe (needs migration)

| ID | Template | Images | Video | Audio | Total | Status |
|----|----------|--------|-------|-------|-------|--------|
| 9 | Maroon Letter | 283 KB | 973 KB | 963 KB | 2.2 MB | Clean |
| 10 | Emerald Parchment | 291 KB | 1.1 MB | 987 KB | 2.4 MB | Clean |
| 13 | Raabta | 2.3 MB | — | 1.6 MB | 3.9 MB | Clean |
| 11 | Royal Jodhpur | 695 KB | — | 4.0 MB | 4.7 MB | MP3 compress |
| 15 | Mangal | 4.6 MB | — | 1.0 MB | 5.5 MB | Done |
| 14 | Qubool | 5.3 MB | — | 636 KB | 5.9 MB | Done |
| 12 | Destination Wedding | 3.2 MB | — | 636 KB | 7.6 MB | Done |
| 17 | Tajmahal | 1.5 MB | 8.0 MB | 772 KB | 10.2 MB | Done |
| 16 | Viah | 13 MB | — | 1.5 MB | 14.5 MB | 29 PNGs → WebP (zero conversion done) |

---

## Priority Order — Migration to Native React + Asset Optimization

| # | Template | Current Type | Asset Fix | Migration Complexity |
|---|----------|-------------|-----------|---------------------|
| 1 | Viah | OrderFrame | 29 PNGs, ~13 MB savings | Medium |
| 2 | Embroidered Garden | AnimatedInvitation | 5 PNGs + MOV + 6.8 MB MP3 | High |
| 3 | Tajmahal | OrderFrame | 2 PNGs + 6 MB video | Medium |
| 4 | Bloom | AnimatedInvitation | 5.2 MB MP3 | High |
| 5 | Destination Wedding | OrderFrame | JPG compress | Medium |
| ~~6~~ | ~~Mandap at Dusk~~ | ~~Standalone~~ | ~~Done~~ | ~~Done~~ |
| 7 | Qubool | OrderFrame | Clean | Medium |
| 8 | Mangal | OrderFrame | Clean | Medium |
| 9 | Royal Jodhpur | OrderFrame | 4 MB MP3 | Medium |
| 10 | Raabta | OrderFrame | Clean | Medium |
| 11 | Maroon Letter | OrderFrame | Clean | Low |
| 12 | Emerald Parchment | OrderFrame | Clean | Low |
| ~~13~~ | ~~A Timeless Union~~ | ~~Standalone~~ | ~~Done~~ | ~~Done~~ |
| ~~14~~ | ~~Artful Love Story~~ | ~~Standalone~~ | ~~Done~~ | ~~Done~~ |
