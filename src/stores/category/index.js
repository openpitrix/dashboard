import { observable, action } from 'mobx';
import _, { get, assign } from 'lodash';

import { sleep, makeArray } from 'utils';

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

  // cate_id=> app count
  @observable cateAppsCount = {};

  @observable
  createdCate = {
    name: '',
    description: '' // can use as icon
  };

  get appStore() {
    return this.getStore('appStore');
  }

  @action
  updateAppCategoryCounts = async (filter_ids = []) => {
    const cateIds = !_.isEmpty(filter_ids)
      ? makeArray(filter_ids)
      : _.map(this.categories, 'category_id');
    const batch = cateIds.map(async category_id => {
      const res = await this.appStore.fetchAll({
        category_id,
        noLimit: true,
        noMutate: true,
        display_columns: ['']
      });

      if (res && 'totalCount' in res) {
        Object.assign(this.cateAppsCount, {
          [category_id]: res.totalCount
        });
      }
      await sleep(50);
    });
    await Promise.all(batch);
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

  @action
  changeCreatedCateName = name => {
    this.createdCate.name = this.getValueFromEvent(name);
  };

  changeCreatedCateDesc = desc => {
    this.createdCate.description = this.getValueFromEvent(desc);
  };

  filterApps = (category_id, apps = []) => {
    if (_.isEmpty(apps)) {
      apps = this.appStore.apps;
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
      await sleep(100);
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
      await this.updateAppCategoryCounts([this.categoryToAdjust, curCategory]);
      await this.appStore.fetchAll({ category_id: curCategory });
    }

    if (this.modalType === 'delete') {
      // delete category
      if (curCategory === RESERVE) {
        return this.info(`${RESERVE} can not be deleted`);
      }

      // first delete apps belong to cate, then delete cate
      const appIds = this.filterApps(curCategory).map(app => app.app_id);
      if (appIds.length) {
        return this.warn(
          'This category contains apps, please move those apps to another category'
        );
      }

      // const batch = appIds.map(applyModify(RESERVE));
      // await Promise.all(batch);

      const res = await this.remove(curCategory);
      if (res) {
        this.success('Delete category successfully');
        this.hideModal();
        await this.fetchAll({ noLimit: true });
        // await this.updateAppCategoryCounts();
        await this.changeCategory(_.first(this.categories));
      }
    }

    if (['customize', 'edit'].includes(this.modalType)) {
      if (!this.createdCate.name) {
        return this.warn('Category name is empty');
      }

      const isEdit = this.modalType === 'edit';
      const method = isEdit ? 'modify' : 'create';
      const params = {
        locale: '{}',
        ...this.createdCate
      };

      if (isEdit) {
        params.category_id = this.selectedCategory.category_id;
      }

      const res = await this[method](params);

      if (res) {
        this.success(`${isEdit ? 'Modify' : 'Create'} category successfully`);
        this.hideModal();
        if (isEdit) {
          Object.assign(
            this.selectedCategory,
            _.pick(this.createdCate, ['name', 'description'])
          );
        }
        this.createdCate = { name: '', description: '' };
        await this.fetchAll({ noLimit: true });
      }
    }

    if (this.modalType === 'add-app') {
      // todo
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

  @action
  create = async params => {
    this.isLoading = true;
    const res = await this.request.post('categories', params);
    this.isLoading = false;
    return res && res.category_id;
  };

  @action
  modify = async params => {
    this.isLoading = true;
    const res = await this.request.patch('categories', params);
    this.isLoading = false;
    return res && res.category_id;
  };

  @action
  remove = async (ids = []) => {
    ids = makeArray(ids);
    this.isLoading = true;
    const res = await this.request.delete('categories', {
      category_id: ids
    });
    this.isLoading = false;
    return res && res.category_id;
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
    this.createdCate = { name: '', description: '' };
  }
}
