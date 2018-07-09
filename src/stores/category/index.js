import { observable, action } from 'mobx';
import _, { get, assign, isObject, isArray, isEmpty, find } from 'lodash';
import Store from '../Store';

export default class CategoryStore extends Store {
  @observable categories = [];
  @observable category = {};
  @observable isLoading = false;

  @observable name = '';
  @observable description = '';
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
  async fetch(category_id) {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { category_id: category_id });
    this.category = get(result, 'category_set[0]', {});
    this.isLoading = false;
  }

  postHandleResult(result) {
    this.postHandleApi(result, async () => {
      this.hideModal();

      if (!isEmpty(this.category)) {
        await this.fetch(this.category.category_id);
      } else {
        await this.fetchAll();
      }
    });
  }

  @action
  async create(params) {
    this.isLoading = true;
    const result = await this.request.post('categories', params);
    this.isLoading = false;
    this.postHandleResult(result);
  }

  @action
  async modify(params) {
    this.isLoading = true;
    const result = await this.request.patch('categories', params);
    this.isLoading = false;
    this.postHandleResult(result);
  }

  @action
  async remove(category_ids) {
    category_ids = category_ids || [this.category.category_id];
    this.isLoading = true;
    const result = await this.request.delete('categories', { category_id: category_ids });
    this.category = {};
    this.isLoading = false;
    this.postHandleResult(result);
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

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };

  @action
  createOrModify(ev) {
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
    this[method](params);
  }

  // fixme
  @action
  showCreateCategory = () => {
    this.category = {};
    this.name = '';
    this.description = '';
    this.setAction('create_cate');
    this.showModal();
  };

  @action
  showModifyCategory = category => {
    this.category = category;
    this.setAction('modify_cate');
    this.showModal();
  };

  @action
  showDeleteCategory = category => {
    this.category = category;
    this.setAction('delete_cate');
    this.showModal();
  };

  @action
  reset() {
    this.category = {};
    this.isLoading = false;
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
