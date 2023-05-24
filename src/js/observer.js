import refs from './refs';
import Image from './pixabayAPI';
import { refs } from './refs';

const image = new Image();

export default function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      image
        .fetchImages()
        .then(({ hits, totalHits }) => {
          if (image.perPage >= totalHits || image.perPage >= 480) {
            observer.unobserve(refs.target);
            return;
          }
          btnNothidden();

          image.incrementHits(hits);
        })
        .catch(error => console.log(error));
    } else {
      refs.buttonLoadMore.hidden = true;
      refs.buttonLoadMore.classList.remove('load');
    }
  });
}

function btnNothidden() {
  refs.buttonLoadMore.hidden = false;
  refs.buttonLoadMore.classList.add('load');
}
