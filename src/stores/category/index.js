import { observable, action } from 'mobx';
import { get, assign } from 'lodash';
import Store from '../Store';

export default class CategoryStore extends Store {
  @observable categories = [];
  @observable category = {};
  @observable isLoading = false;

  @observable name = '';
  @observable locale = '';
  @observable categoryId = '';
  @observable categoryDetail = {};
  @observable isModalOpen = false;

  // menu actions
  @observable
  handleCate = {
    action: '' // create, modify, delete
  };

  @action
  async fetchAll() {
    this.isLoading = true;
    const result = await this.request.get('categories');
    this.categories = get(result, 'category_set', []);
    this.isLoading = false;
  }

  @action
  async fetch(categoryId) {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { category_id: categoryId });
    this.category = get(result, 'category_set[0]', {});
    this.isLoading = false;
  }

  @action
  async create(params) {
    this.isLoading = true;
    const result = await this.request.post('categories', params);
    if (result.category) this.categories.unshift(result.category);
    this.isLoading = false;
  }

  @action
  async modify(params) {
    this.isLoading = true;
    await this.request.patch('categories', params);
    this.isLoading = false;
  }

  @action
  async remove(categoryIds) {
    this.isLoading = true;
    await this.request.delete('categories', { category_id: categoryIds });
    this.isLoading = false;
  }

  @action.bound
  showModal() {
    this.isModalOpen = true;
  }

  @action.bound
  hideModal() {
    this.isModalOpen = false;
  }

  setAction(action) {
    this.handleCate.action = action;
  }

  // fixme: ///
  @action
  showCreateCategory = () => {
    this.categoryDetail = {};
    this.setAction('create_cate');
    this.showModal();
  };

  @action
  showModifyCategory = category => {
    this.categoryDetail = category;
    this.setAction('modify_cate');
    this.showModal();
  };

  @action
  showDeleteCategory = id => {
    this.categoryId = id;
    this.setAction('delete_cate');
    this.showModal();
  };

  @action
  categorySubmit = async (categoryStore, categoryId, type) => {
    const params = {
      name: this.name || this.categoryDetail.name,
      locale: this.locale || this.categoryDetail.locale
    };
    if (categoryId) {
      await categoryStore.modifyCategory(assign(params, { category_id: categoryId }));
    } else {
      await categoryStore.createCategory(params);
    }
    this.isModalOpen = false;
    if (type === 'detail') {
      await categoryStore.fetchCategoryDetail(categoryId);
    } else {
      await categoryStore.fetchAll();
    }
  };

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeLocale = e => {
    this.locale = e.target.value;
  };

  @action
  deleteCategory = async categoryStore => {
    await categoryStore.deleteCategory([this.categoryId]);
    this.hideModal();
    await categoryStore.fetchAll();
  };
}
