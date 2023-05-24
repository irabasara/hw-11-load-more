import Image from './pixabayAPI';
import createMarkup from './markup';
import { refs } from './refs';
import onLoad from './observer';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Report } from 'notiflix';

const image = new Image();
const lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.buttonLoadMore.addEventListener('click', onLoadMoreClick);

function onSearchFormSubmit(event) {
  event.preventDefault();
  image.query = event.currentTarget.elements.searchQuery.value;
  image.resetPage();
  observer.unobserve(refs.target);

  image
    .fetchImages()
    .then(({ hits, totalHits }) => {
      if (image.query !== '') {
        event.target.reset();
      }
      if (totalHits === 0 || image.query === '') {
        refs.buttonLoadMore.hidden = true;
        Report.info(
          'INFO',
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

      observer.observe(refs.target);
      lightbox.refresh();
    })
    .catch(error => console.log(error));

  clearMarkup();
}

function onLoadMoreClick() {
  image
    .fetchImages()
    .then(({ hits, totalHits }) => {
      if (image.perPage >= totalHits || image.perPage >= 480) {
        return Report.info(
          'INFO',
          "We're sorry, but you've reached the end of search results."
        );
      }

      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      lightbox.refresh();

      image.incrementHits(hits);
    })
    .catch(error => console.log(error));
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);
