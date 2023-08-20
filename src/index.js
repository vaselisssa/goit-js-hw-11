import ImagesApiService from './js/fetch-images-service.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { renderCards } from './js/render-cards.js';

const { searchForm, gallery, loadMoreBtn } = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imageApiService = new ImagesApiService();

let currentHits = 0;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();

  if (imageApiService.query === '') {
    Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  const { hits, totalHits } = await imageApiService.fetchImages();
  currentHits = hits.length;

  if (totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
  }
  try {
    if (totalHits > 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      gallery.innerHTML = '';
      renderCards(hits);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.classList.add('is-hidden');
      endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore(e) {
  imageApiService.incrementPage();
  const { hits, totalHits } = await imageApiService.fetchImages();

  renderCards(hits);
  currentHits += hits.length;

  if (currentHits === totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  }
}
