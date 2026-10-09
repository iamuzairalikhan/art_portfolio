# Uzair Ali Khan — Artist & Painter Portfolio

A single-page portfolio site showcasing Oil on canvas with palette knife impasto, hyper-realistic framed charcoal & graphite portraits, and classical drawing foundation studies.

- **Artist Location:** Rawalpindi, Pakistan
- **Instagram:** [@khayaleuzair](https://instagram.com/khayaleuzair)
- **TikTok:** [@khayaaleuzair](https://www.tiktok.com/@khayaaleuzair)

No build step, no dependencies: open `index.html` or upload the folder.

## What's here

```
index.html              the whole page
assets/site.css         styles
assets/site.js          drag-strip, work viewer, masthead
assets/works/           paintings, framed portraits, and study sheets
                          name.jpg      ~900px  — used in the page
                          name-lg.jpg   ~1800px — used in the viewer
assets/img/             portrait, share image, favicon
_src/                   clean-named copies of the originals
_build-images.sh        regenerates assets/works from _src
```

## Publishing it

Any static host works. Drag this folder onto **netlify.com/drop** — it's live in about ten seconds,
and you can attach a custom domain (e.g. `uzairalikhan.com`) from the Netlify dashboard.
Cloudflare Pages, Vercel and GitHub Pages all work the same way.

## Adding a new painting

1. Drop the photo into `_src/` with a short name, e.g. `_src/w36.jpg`.
2. Add a line to the `MAP` block in `_build-images.sh`:
   `w36|title-in-lowercase-with-dashes|100`
   The third field is the crop. `100` means no crop. To crop, use pixel geometry
   measured on the original — `WIDTHxHEIGHT+X+Y`, e.g. `758x1088+38+64`.
   (ImageMagick reads offsets in a `%` geometry as pixels, so always use pixels.)
3. Run `bash _build-images.sh`.
4. Copy an existing `<div class="plate p6">…</div>` block in `index.html`, point it at the new
   filenames, and update the title, medium line and note.

## Things worth changing

- **Location.** Set to Rawalpindi, Pakistan (in hero, about, colophon, and JSON-LD).
- **Dimensions.** Added to all paintings (square: 18″ × 18″, Moonlit Serenity: 12″ × 18″, rectangular: 24″ × 36″) in both labels and viewer metadata.
- **Years.** Every painting is currently labelled 2026, taken from the photo dates. Correct any that are older.
- **The notes under each painting** describe the technique visible in the photograph. Read them
  and make them yours; they're the part a gallery will actually read.
- The 36 loose `.jpg`/`.jpeg` files in the project root are the untouched originals. They aren't
  referenced by the site and can be moved out of the folder before publishing.
