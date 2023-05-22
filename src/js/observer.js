import refs from './refs';
import Image from './pixabayAPI';
import createMarkup from './markup';

const image = new Image();

export default function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(entries);
      image
        .fetchImages()
        .then(({ hits, totalHits }) => {
          if (image.perPage >= totalHits) {
            observer.unobserve(refs.target);
            return Report.info(
              'INFO',
              "We're sorry, but you've reached the end of search results."
            );
          }

          refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

          image.incrementHits(hits);
        })
        .catch(error => console.log(error));
    }
  });
}
