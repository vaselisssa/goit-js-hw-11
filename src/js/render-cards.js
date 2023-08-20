import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');

const simpleLightbox = new SimpleLightbox('.gallery a');

function creatMarkup(array) {
  return array
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => ` <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" >
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
  simpleLightbox.refresh();
}

export { renderCards };
