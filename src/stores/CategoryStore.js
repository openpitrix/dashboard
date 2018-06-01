import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class CategoryStore extends Store {
  @observable categories = [];
  @observable category = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'categoryStore');
  }

  @action
  async fetchCategories() {
    this.isLoading = true;
    const result = await this.request.get('categories');
    this.categories = get(result, 'category_set', []);
    this.isLoading = false;
  }

  @action
  async fetchCategoryDetail(categoryId) {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { category_id: categoryId });
    this.category = get(result, 'category_set[0]', {});
    this.isLoading = false;
  }

  @action
  async createCategory(params) {
    this.isLoading = true;
    const result = await this.request.post('categories', params);
    if (result.category) this.categories.unshift(result.category);
    this.isLoading = false;
  }

  @action
  async deleteCategory(categoryIds) {
    this.isLoading = true;
    await this.request.delete('categories', { category_id: categoryIds });
    this.isLoading = false;
  }
}
