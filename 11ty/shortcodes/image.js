const Image = require('@11ty/eleventy-img');
const { imagePaths, imageUrlPath } = require('../constants/images');
const sharp = require('sharp');

const GALLERY_IMAGE_WIDTH = 192;
const LANDSCAPE_LIGHTBOX_IMAGE_WIDTH = 2000;
const PORTRAIT_LIGHTBOX_IMAGE_WIDTH = 720;

/** Returns optimized image markup. Expects to receive a root-relative absolute path to the image (e.g., src/assets/images/image.png).
 * Example usage: `{% image 'src/assets/images/image.png', 'Alt text' %}`.
 */
async function imageShortcode(src, alt = '', widths = [300, 600], formats = ['avif', 'jpeg', 'webp'], sizes = '100vw') {
  const metadata = await Image(src, {
    widths,
    formats,
    // e.g., _site/assets/images/
    outputDir: imagePaths.output,
    // e.g., /assets/images/name.extension
    urlPath: imageUrlPath,
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  };

  return Image.generateHTML(metadata, imageAttributes);
}

function galleryShortcode(content, name) {
  return `
      <div>
          <div class="gallery" id="gallery-${name}">
              ${content}
          </div>
          <script type="module">
              import PhotoSwipeLightbox from '/js/photoswipe-lightbox.esm.min.js';
              import PhotoSwipe from '/js/photoswipe.esm.min.js';
              const lightbox = new PhotoSwipeLightbox({
                  gallery: '#gallery-${name}',
                  children: 'a',
                  pswpModule: PhotoSwipe,
                  preload: [1, 1]
              });
              lightbox.init();
          </script>
      </div>
  `.replace(/(\r\n|\n|\r)/gm, '');
}

async function galleryImageShortcode(src, alt) {
  let lightboxImageWidth = LANDSCAPE_LIGHTBOX_IMAGE_WIDTH;

  const metadata = await sharp(src).metadata();

  if (metadata.height > metadata.width) {
    lightboxImageWidth = PORTRAIT_LIGHTBOX_IMAGE_WIDTH;
  }

  const options = {
    formats: ['webp'],
    widths: [GALLERY_IMAGE_WIDTH, lightboxImageWidth],
    urlPath: '/assets/images/gen',
    outputDir: './public/assets/images/gen/',
  };

  const genMetadata = await Image(src, options);
  console.log(genMetadata);

  return `
        <a href="${genMetadata.webp[0].url}" 
        data-pswp-width="${genMetadata.webp[0].width}" 
        data-pswp-height="${genMetadata.webp[0].height}" 
        target="_blank">
            <img src="${genMetadata.webp[0].url}" alt="${alt}" />
        </a>
    `.replace(/(\r\n|\n|\r)/gm, '');
}

module.exports = { imageShortcode, galleryShortcode, galleryImageShortcode };
