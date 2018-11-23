import { observable, action } from 'mobx';
import { get, assign } from 'lodash';

import ts from 'config/translation';

import Store from '../Store';

export default class CategoryStore extends Store {
  @observable categories = [];

  @observable totalCount = 0;

  @observable category = {};

  @observable isLoading = false;

  @observable name = '';

  @observable description = '';

  @observable isModalOpen = false;

  @observable isDeleteOpen = false;

  @observable isDetailPage = false;

  initLoadNumber = 6;

  @observable appStore = null;

  @observable searchWord = '';

  @action
  fetchAll = async (params = {}, appStore) => {
    const defaultParams = {
      limit: this.maxLimit,
      offset: 0
    };

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }

    this.isLoading = true;
    const result = await this.request.get(
      'categories',
      assign(defaultParams, params)
    );
    this.categories = get(result, 'category_set', []);
    this.totalCount = get(result, 'total_count', 0);

    if (appStore) {
      for (
        let i = 0;
        i < this.initLoadNumber && i < this.categories.length;
        i++
      ) {
        await appStore.fetchAll({
          category_id: this.categories[i].category_id
        });
        this.categories[i] = {
          total: appStore.totalCount,
          apps: appStore.apps,
          ...this.categories[i]
        };
      }
    }
    this.isLoading = false;
  };

  @action
  onSearch = async word => {
    this.searchWord = word;
    await this.fetchAll({}, this.appStore);
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.fetchAll({}, this.appStore);
  };

  @action
  fetch = async category_id => {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { category_id });
    this.category = get(result, 'category_set[0]', {});
    this.isLoading = false;
  };

  postHandleResult = async (result, type) => {
    if (get(result, 'category_id', '')) {
      const msg = `${type} category successfully.`;
      this.hideModal();

      if (this.isDetailPage && type !== 'Delete') {
        await this.fetch(this.category.category_id);
      } else if (!this.isDetailPage) {
        await this.fetchAll({}, this.appStore);
      }
      this.success(ts(msg));
    } else {
      return result;
    }
  };

  @action
  create = async params => {
    // this.isLoading = true;
    const result = await this.request.post('categories', params);
    // this.isLoading = false;
    await this.postHandleResult(result, 'Create');
  };

  @action
  modify = async params => {
    // this.isLoading = true;
    const result = await this.request.patch('categories', params);
    // this.isLoading = false;
    await this.postHandleResult(result, 'Modify');
  };

  @action
  remove = async () => {
    const categoryIds = [this.category.category_id];
    const result = await this.request.delete('categories', {
      category_id: categoryIds
    });
    await this.postHandleResult(result, 'Delete');
  };

  @action.bound
  hideModal = () => {
    this.isModalOpen = false;
    this.isDeleteOpen = false;
  };

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };

  @action
  createOrModify = ev => {
    const method = this.category.category_id ? 'modify' : 'create';
    const params = {
      name: this.name,
      description: this.description,
      locale: '{}'
      // locale: `{${this.locale}}` // todo: used for i18n, json format: {zh-cn: '', en: ''}
    };
    if (method === 'modify') {
      params.category_id = this.category.category_id;
    }
    if (ev === 'from_index') {
      this.category = {};
    }
    if (!this.name) {
      this.info(ts('Please input category name!'));
    } else {
      this[method](params);
    }
  };

  // fixme
  @action
  showCreateCategory = () => {
    this.category = {};
    this.name = '';
    this.description = '';
    this.isModalOpen = true;
  };

  @action
  showModifyCategory = category => {
    this.category = category;
    this.name = category.name;
    this.description = category.description;
    this.isModalOpen = true;
  };

  @action
  showDeleteCategory = category => {
    this.category = category;
    this.isDeleteOpen = true;
  };

  @action
  reset() {
    this.searchWord = '';
    this.name = '';
    this.description = '';
    this.isLoading = false;
    this.isDetailPage = false;
    this.hideModal();

    this.categories = [];
    this.category = {};
  }
}
