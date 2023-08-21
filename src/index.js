import ImagesApiService from './js/fetch-images-service.js';
import LoadMoreBtn from './js/components/load-more-button.js';
import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { renderCards } from './js/render-cards.js';

const { searchForm, gallery } = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const imageApiService = new ImagesApiService();

let currentHits = 0;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  clearGallery();
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();

  if (imageApiService.query === '') {
    return notification.emptyQuery();
  }

  loadMoreBtn.disable();
  const { hits, totalHits } = await imageApiService.fetchImages();

  currentHits = hits.length;
  loadMoreBtn.enable();

  try {
    if (totalHits === 0) {
      clearGallery();
      notification.noMatches();
      loadMoreBtn.hide();
    }

    if (totalHits > 0) {
      notification.imagesFound(totalHits);
      renderCards(hits);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (totalHits < imageApiService.perPage) {
      notification.endOfSearch();
    } else {
      loadMoreBtn.show();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore(e) {
  imageApiService.incrementPage();
  loadMoreBtn.disable();
  const response = await imageApiService.fetchImages();
  console.log(response);
  loadMoreBtn.enable();
  renderCards(response.hits);
  currentHits += response.hits.length;

  if (currentHits >= response.totalHits) {
    notification.endOfSearch();
    loadMoreBtn.hide();
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

const notification = {
  emptyQuery() {
    Notify.failure('Please input your search query!');
  },

  imagesFound(quantity) {
    Notify.success(`Hooray! We found ${quantity} images.`);
  },

  noMatches() {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  },

  endOfSearch() {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  },
};
