#!/bin/bash
set -e
cd "/Users/mac/www/paged/uzair portfolio"
mkdir -p assets/works assets/img
# src|slug|crop(percent height from north, 100=none)
MAP="
w07|chasing-the-light|100%x80%+0%+0%
w08|moonlit-serenity|100%x93%+0%+0%
w09|sailing-through-the-twilight|100%x78%+0%+0%
w10|sunset-over-lahore|461x704+202+269
w11|sunset-symphony|758x1088+38+64
w33|where-the-green-comes-alive|100%x80%+0%+0%
w01|circles-and-lines|100
w02|radial-hatching|100
w03|value-bands|100
w04|spirals-and-solids|100
w05|graphite-discs|100
w06|ellipses-and-boxes|100
w35|hatching-sheets|100
w12|apple|100
w13|geometric-forms|100
w14|sphere|100
w15|brass-ewer|100
w16|basketball-and-stool|100
w17|bolt-and-nut|100
w18|worn-sneaker|100
w19|eye-anatomy|100
w20|eyes-soft|100
w21|eye-and-brow|100
w22|eyes-grid|100
w23|noses-grid|100
w24|nose-three-quarter|100
w25|lips-studies|100
w26|lips-grid|100
w27|hair-flow|100
w28|ears-pair|100
w29|ears-three|100
w30|long-hair|100
w31|short-hair|100
w32|hair-volume|100
w34|hair-mass|100
"
echo "$MAP" | while IFS='|' read -r src slug crop; do
  [ -z "$src" ] && continue
  in="_src/$src.jpg"
  tmp="/tmp/_pp_$slug.jpg"
  if [ "$crop" = "100" ]; then cp "$in" "$tmp"; else
    magick "$in" -crop "$crop" +repage "$tmp"; fi
  magick "$tmp" -resize '1700x1700>' -strip -interlace Plane -sampling-factor 4:2:0 -quality 80 "assets/works/$slug-lg.jpg"
  magick "$tmp" -resize '900x900>'  -strip -interlace Plane -sampling-factor 4:2:0 -quality 78 "assets/works/$slug.jpg"
  rm -f "$tmp"
  printf "%-32s %s\n" "$slug" "$(magick identify -format '%wx%h' assets/works/$slug.jpg)"
done
magick _src/artist.jpg -resize '900x900>' -strip -quality 82 assets/img/uzair.jpg
du -sh assets
