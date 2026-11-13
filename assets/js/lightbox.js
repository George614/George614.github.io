import { wrapIndex } from './lib/gallery.js';

// Opens each photograph in a full-screen native modal dialog, which supplies the focus trap
// and closing with Escape. Without JavaScript each thumbnail is a plain link to the larger image.
const dialog = document.querySelector('dialog.lightbox');
const links = [...document.querySelectorAll('a.photo')];
// The viewer's image exists only when the script runs, so the static page has no image without a source.
const image = document.createElement('img');
image.sizes = '100vw';
image.decoding = 'async';
dialog.querySelector('figure').prepend(image);
const title = dialog.querySelector('[data-lightbox-title]');
const album = dialog.querySelector('[data-lightbox-album]');
const position = dialog.querySelector('[data-lightbox-position]');
let current = 0;

function show(index) {
  current = wrapIndex(index, links.length);
  const link = links[current];
  const base = link.getAttribute('href').replace(/-2000\.webp$/, '');
  image.removeAttribute('src');
  image.width = Number(link.dataset.width);
  image.height = Number(link.dataset.height);
  image.alt = link.querySelector('img').alt;
  image.srcset = `${base}-1400.webp 1400w, ${base}-2000.webp 2000w`;
  image.src = `${base}-1400.webp`;
  title.textContent = link.dataset.title;
  album.textContent = link.dataset.album;
  position.textContent = `${current + 1} of ${links.length}`;
}

links.forEach((link, index) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    show(index);
    dialog.showModal();
  });
});

dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(current - 1));
dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => show(current + 1));
dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());

dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') show(current - 1);
  else if (event.key === 'ArrowRight') show(current + 1);
  else return;
  event.preventDefault();
});

dialog.addEventListener('close', () => links[current].focus());
