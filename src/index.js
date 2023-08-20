import axios from 'axios';
import ImagesApiService from './js/fetch-images-service.js';
// import cardsTemplate from './templates/cards.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const { searchForm, gallery, loadMoreBtn, endCollectionText } = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endCollectionText: document.querySelector('.end-collection-text'),
};

const imageApiService = new ImagesApiService();
const simpleLightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();
  gallery.innerHTML = '';

  const images = await imageApiService.fetchImages();
  console.log(images.hits);
  renderCards(images.hits);
  simpleLightbox.refresh();
}

async function onLoadMore(e) {
  imageApiService.incrementPage();
  simpleLightbox.destroy();
  const images = await imageApiService.fetchImages();
  simpleLightbox.refresh();
}

function creatMarkup(array) {
  return array
    .map(
      ({
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => ` <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
`
    )
    .join('');
}

function renderCards(data) {
  gallery.insertAdjacentHTML('beforeend', creatMarkup(data));
}
