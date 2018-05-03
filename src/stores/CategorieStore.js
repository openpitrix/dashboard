import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class CategorieStore {
  @observable categories = {};
  @observable categorie = {};
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.categorieStore);
    }
  }

  @action
  async fetchCategories() {
    this.isLoading = true;
    const result = await request.get('api/v1/categories');
    this.categories = result;
    this.isLoading = false;
  }

  @action
  async fetchCategorieDetail(categorieId) {
    this.isLoading = true;
    const result = await request.get(`api/v1/categories/${categorieId}`);
    this.categorie = result;
    this.isLoading = false;
  }
}
