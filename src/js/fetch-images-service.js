import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
console.log(axios.defaults);

export default class ImagesApiService {
  constructor() {
    this.searchParams = {
      key: '38915840-62f3bbb09c35f3e37ff6ed2c8',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: 1,
      per_page: 40,
      q: '',
      endOfResults: false,
    };
  }

  async fetchImages() {
    const response = await axios.get('', {
      params: this.searchParams,
    });

    return await response.data;
  }

  incrementPage() {
    this.searchParams.page += 1;
  }
  resetPage() {
    this.searchParams.page = 1;
  }
  setEndOfResults(boolean) {
    this.searchParams.endOfResults = boolean;
  }

  get query() {
    return this.searchParams.q;
  }
  set query(newQuery) {
    this.searchParams.q = newQuery;
  }
}
