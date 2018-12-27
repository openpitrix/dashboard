import { observable, action } from 'mobx';
import _, { get, assign } from 'lodash';

import { sleep } from 'utils';

import Store from '../Store';

const RESERVE = 'ctg-uncategorized';

export default class CategoryStore extends Store {
  @observable categories = [];

  @observable totalCount = 0;

  @observable category = {};

  @observable isLoading = false;

  @observable name = '';

  @observable description = '';

  @observable isModalOpen = false;

  @observable modalType = '';

  @observable isDeleteOpen = false;

  @observable isDetailPage = false;

  initLoadNumber = 6;

  @observable searchWord = '';

  @observable selectedCategory = {};

  @observable categoryToAdjust = '';

  get appStore() {
    return this.getStore('appStore');
  }

  @action
  updateAppCategoryCounts = async () => {
    // fixme: fetch all apps limit 200 will cause app count not accurate
    await this.appStore.fetchAll({
      noLimit: true,
      keepAll: true,
      category_id: this.categories.map(cate => cate.category_id)
    });
  };

  @action
  changeCategory = async category => {
    const { category_id } = category;
    if (category_id !== this.selectedCategory.category_id) {
      this.selectedCategory = category;
      this.categoryToAdjust = '';

      this.appStore.cancelSelected();
      this.appStore.categoryId = category_id;
      this.appStore.currentPage = 1;
      await this.appStore.fetchAll({
        category_id
      });
    }
  };

  @action
  changeCategoryToAdjust = id => {
    this.categoryToAdjust = id;
  };

  filterApps = (category_id, apps = []) => {
    if (_.isEmpty(apps)) {
      apps = this.appStore.allApps;
    }
    return _.filter(apps, app => _.find(app.category_set, { category_id, status: 'enabled' }));
  };

  @action
  handleOperation = async () => {
    const curCategory = this.selectedCategory.category_id;
    const applyModify = category_id => async app_id => {
      const params = {
        app_id,
        category_id
      };

      await this.appStore.modify(params);
      await sleep(50);
    };

    if (this.modalType === 'adjust-cate') {
      if (!this.categoryToAdjust || this.categoryToAdjust === curCategory) {
        return this.info('App category not change');
      }

      // batch modify app category
      const batch = this.appStore.appIds.map(
        applyModify(this.categoryToAdjust)
      );
      await Promise.all(batch);
      this.success('Adjust apps category successfully');
      this.hideModal();
      this.appStore.cancelSelected();
      await this.updateAppCategoryCounts();
      await this.appStore.fetchAll({ category_id: curCategory });
    }

    if (this.modalType === 'delete') {
      // delete category
      if (curCategory === RESERVE) {
        return this.info(`${RESERVE} can not be deleted`);
      }

      const res = await this.remove(curCategory);
      if (res) {
        // delete apps belong to cate
        const appIds = this.filterApps(
          curCategory,
          this.appStore.allAppsOfCurrentCate
        ).map(app => app.app_id);
        const batch = appIds.map(applyModify(RESERVE));
        await Promise.all(batch);
        this.success('Delete category successfully');
        this.hideModal();
        await this.fetchAll({ noLimit: true });
        await this.updateAppCategoryCounts();
        await this.changeCategory(_.first(this.categories));
      }
    }
  };

  @action
  fetchAll = async (params = {}) => {
    params = this.normalizeParams(params);

    if (this.searchWord) {
      params.search_word = this.searchWord;
    }

    this.isLoading = true;
    const result = await this.request.get('categories', params);
    this.categories = get(result, 'category_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  onSearch = async word => {
    this.searchWord = word;
    await this.fetchAll();
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.fetchAll();
  };

  @action
  fetch = async category_id => {
    this.isLoading = true;
    const result = await this.request.get(`categories`, { category_id });
    this.category = get(result, 'category_set[0]', {});
    this.isLoading = false;
  };

  // postHandleResult = async (result, type) => {
  //   if (get(result, 'category_id', '')) {
  //     const msg = `${type} category successfully.`;
  //     this.hideModal();
  //
  //     if (this.isDetailPage && type !== 'Delete') {
  //       await this.fetch(this.category.category_id);
  //     } else if (!this.isDetailPage) {
  //       await this.fetchAll({}, this.appStore);
  //     }
  //     this.success(ts(msg));
  //   } else {
  //     return result;
  //   }
  // };

  @action
  create = async params => {
    // this.isLoading = true;
    const result = await this.request.post('categories', params);
    // this.isLoading = false;
    // await this.postHandleResult(result, 'Create');
  };

  @action
  modify = async params => {
    // this.isLoading = true;
    const result = await this.request.patch('categories', params);
    // this.isLoading = false;
    // await this.postHandleResult(result, 'Modify');
  };

  @action
  remove = async (ids = []) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    this.isLoading = true;
    const res = await this.request.delete('categories', {
      category_id: ids
    });
    this.isLoading = false;
    return res && res.category_id;
    // await this.postHandleResult(result, 'Delete');
  };

  showModal = type => {
    this.isModalOpen = true;
    this.modalType = type;
  };

  @action
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

  // @action
  // createOrModify = ev => {
  //   const method = this.category.category_id ? 'modify' : 'create';
  //   const params = {
  //     name: this.name,
  //     description: this.description,
  //     locale: '{}'
  //     // locale: `{${this.locale}}` // todo: used for i18n, json format: {zh-cn: '', en: ''}
  //   };
  //   if (method === 'modify') {
  //     params.category_id = this.category.category_id;
  //   }
  //   if (!this.name) {
  //     this.info(ts('Please input category name!'));
  //   } else {
  //     this[method](params);
  //   }
  // };

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

    this.appStore.categoryId = '';
  }
}
