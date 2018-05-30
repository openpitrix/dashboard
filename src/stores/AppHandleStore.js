import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';

export default class AppHandleStore extends Store {
  @observable appId = '';
  @observable categoryId = '';
  @observable categories = [];
  @observable selectValue = '';
  @observable showDeleteModal = false;
  @observable showCategoryModal = false;

  @action
  deleteAppShow = appId => {
    this.appId = appId;
    this.showDeleteModal = true;
  };

  @action
  deleteAppClose = () => {
    this.showDeleteModal = false;
  };

  @action
  deleteApp = async appStore => {
    await appStore.fetchDeleteApp([this.appId]);
    this.showDeleteModal = false;
    await appStore.fetchQueryApps();
  };

  @action
  categoryModalShow = async (appId, category) => {
    const result = await this.request.get('categories');
    this.categories = get(result, 'category_set', []);
    console.log(result, 'this.categories', this.categories);
    this.appId = appId;
    this.categoryId = category && category.category_id;
    this.showCategoryModal = true;
  };

  @action
  categoryModalClose = () => {
    this.showCategoryModal = false;
  };

  @action
  modifyCategory = async appStore => {
    const data = {
      app_id: this.appId,
      category_id: this.categoryId
    };
    await appStore.fetchModifyApp(data);
  };

  @action
  changeCategory = value => {
    this.selectValue = value;
  };

  @action
  async onRefresh(appStore) {
    await appStore.fetchQueryApps();
  }
}
