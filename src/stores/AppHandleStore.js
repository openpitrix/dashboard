import { observable, action } from 'mobx';
import Store from './Store';
import { get } from 'lodash';
import { toJS } from 'mobx';

export default class AppHandleStore extends Store {
  @observable appId = '';
  @observable categoryId = '';
  @observable versionId = '';
  @observable categories = [];
  @observable versionDetail = {};
  @observable selectedCategory = '';
  @observable showDeleteApp = false;
  @observable showCategoryModify = false;
  @observable showCreateVersion = false;
  @observable showDeleteVersion = false;
  @observable showAllVersion = false;

  @action
  deleteAppShow = appId => {
    this.appId = appId;
    this.showDeleteApp = true;
  };

  @action
  deleteAppClose = () => {
    this.showDeleteApp = false;
  };

  @action
  deleteApp = async appStore => {
    await appStore.deleteApp([this.appId]);
    this.showDeleteApp = false;
    await appStore.fetchAll({ page: 1 });
  };

  @action
  categoryModalShow = async (appId, category) => {
    const result = await this.request.get('categories');
    this.categories = get(result, 'category_set', []);
    this.appId = appId;
    this.categoryId = category && category.category_id;
    this.showCategoryModify = true;
  };

  @action
  categoryModalClose = () => {
    this.showCategoryModify = false;
  };

  @action
  modifyCategory = async appStore => {
    const data = {
      app_id: this.appId,
      category_id: this.categoryId
    };
    await appStore.modifyApp(data);
  };

  @action
  changeCategory = value => {
    this.selectedCategory = value;
  };

  @action
  async onRefresh(appStore) {
    await appStore.fetchQueryApps();
  }

  @action
  createVersionShow = () => {
    this.showCreateVersion = true;
  };

  @action
  createVersionClose = () => {
    this.showCreateVersion = false;
  };

  @action
  changeName = e => {
    this.versionDetail.name = e.target.value;
  };

  @action
  changePackageName = e => {
    this.versionDetail.package_name = e.target.value;
  };

  @action
  changeDescription = e => {
    this.versionDetail.description = e.target.value;
  };

  @action
  createVersionSubmit = async (appId, appStore) => {
    this.versionDetail.app_id = appId;
    await appStore.createVersion(toJS(this.versionDetail));
    this.showCreateVersion = false;
  };

  @action
  deleteVersionShow = versionId => {
    this.versionId = versionId;
    this.showDeleteVersion = true;
  };

  @action
  deleteVersionClose = () => {
    this.showDeleteVersion = false;
  };

  @action
  deleteVersionSubmit = async appStore => {
    await appStore.deleteVersion(this.versionId);
    this.showDeleteVersion = false;
  };

  @action
  allVersionShow = () => {
    this.showAllVersion = true;
  };

  @action
  allVersionClose = () => {
    this.showAllVersion = false;
  };
}
