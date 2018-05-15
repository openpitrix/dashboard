import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class CategoryStore extends Store {
  @observable categories = [];
  @observable category = {};
  @observable isLoading = false;

  constructor(initialState) {
    super(initialState, 'categoryStore');
    this.totalCount = 0;
  }

  @action
  async fetchCategories() {
    this.isLoading = true;
    const result = await this.request.get('categories');
    this.categories = get(result, 'category_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  async fetchCategoryDetail(categoryId) {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { category_id: categoryId });
    this.category = get(result, 'category_set[0]', {});
    this.isLoading = false;
  }
}
