---
title: Image Handling
read_when:
  - adding or replacing images in the project
  - optimizing images for the web
---

# Image Handling

## Allowed Formats

Only **SVG** and **WebP** are allowed in `public/images/`. No JPEG or PNG.

## Optimization Rules

- Resize raster images to their **actual display size × 2** (for retina) before adding them to `public/images/`. Never serve oversized images and rely on CSS to shrink them.
- Compress WebP to quality ~80.
- Set `width` and `height` attributes matching the actual file dimensions.

## Example

An image displayed at 250px wide in a grid column should be exported at 500px wide (2× retina) as WebP at quality 80 — typically under 100 KB for a photo.

## Source Files

Original unprocessed media files live outside the repo or in git-ignored directories3 (e.g. `.local/`). Only optimized outputs go into `public/images/`.
