import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class CategorieStore extends Store {
  @observable categories = [];
  @observable categorie = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'categorieStore');
  }

  @action
  async fetchCategories() {
    this.isLoading = true;
    const result = await this.request.get('categories');
    this.categories = get(result, 'categorie_set', []);
    this.isLoading = false;
  }

  @action
  async fetchCategorieDetail(categorieId) {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { categorie_id: categorieId });
    this.categorie = get(result, 'categorie_set[0]', {});
    this.isLoading = false;
  }
}
