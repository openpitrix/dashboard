import { observable, action } from 'mobx';
import _, { get, assign, isObject, isArray, isEmpty, find } from 'lodash';
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
    const result = await this.request.get('categories', assign(defaultParams, params));
    this.categories = get(result, 'category_set', []);
    this.totalCount = get(result, 'total_count', 0);

    if (appStore) {
      for (let i = 0; i < this.initLoadNumber && i < this.categories.length; i++) {
        await appStore.fetchAll({ category_id: this.categories[i].category_id });
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
    await this.fetchAll(this.appStore);
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.fetchAll(this.appStore);
  };

  @action
  fetch = async category_id => {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { category_id: category_id });
    this.category = get(result, 'category_set[0]', {});
    this.isLoading = false;
  };

  postHandleResult = async (result, type) => {
    let msg = type + ' category successfully.';
    if (!result.category_id) {
      msg = result.errDetail || result.err || 'Operation fail!';
      this.error(msg);
    } else {
      this.hideModal();
      if (this.isDetailPage) {
        await this.fetch(this.category.category_id);
      } else {
        await this.fetchAll(this.appStore);
      }
      this.success(msg);
    }
  };

  @action
  create = async params => {
    //this.isLoading = true;
    const result = await this.request.post('categories', params);
    //this.isLoading = false;
    await this.postHandleResult(result, 'Create');
  };

  @action
  modify = async params => {
    //this.isLoading = true;
    const result = await this.request.patch('categories', params);
    //this.isLoading = false;
    await this.postHandleResult(result, 'Modify');
  };

  @action
  remove = async () => {
    const categoryIds = [this.category.category_id];
    //this.isLoading = true;
    const result = await this.request.delete('categories', { category_id: categoryIds });
    this.category = {};
    //this.isLoading = false;
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
    let method = this.category.category_id ? 'modify' : 'create';
    let params = {
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
      this.info('Please input category name!');
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
    this.isModalOpen = true;
  };

  @action
  showDeleteCategory = category => {
    this.category = category;
    this.isDeleteOpen = true;
  };

  @action
  reset() {
    this.category = {};
    this.isLoading = false;
    this.searchWord = '';
    this.name = '';
    this.description = '';
    this.hideModal();
  }

  getCategoryApps = (categories = [], apps = []) => {
    if (categories.toJSON) {
      categories = categories.toJSON();
    }
    if (apps.toJSON) {
      apps = apps.toJSON();
    }

    categories = categories.map(cate => {
      cate = _.pick(cate, ['category_id', 'name', 'description']);

      let cate_apps = apps.filter(app => {
        return _.find(app.category_set, { category_id: cate.category_id });
      });

      return { apps: cate_apps, ...cate };
    });

    return categories;
  };
}
