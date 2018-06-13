import { observable, action } from 'mobx';
import Store from '../Store';
import { get } from 'lodash';

export default class AppVersionStore extends Store {
  @observable versions = [];
  @observable version = {};
  @observable isLoading = false;
  @observable isModalOpen = false;

  @action
  async fetchAll(appId) {
    this.isLoading = true;
    const result = await this.request.get('app_versions', {
      app_id: appId,
      sort_key: 'create_time'
    });
    this.versions = get(result, 'app_version_set', []);
    this.isLoading = false;
  }

  @action
  async create(params) {
    this.isLoading = true;
    await this.request.post('app_versions', params);
    this.isLoading = false;
  }

  @action
  async remove(versionId) {
    this.isLoading = true;
    await this.request.delete('app_versions', { version_id: [versionId] });
    this.isLoading = false;
  }

  // todo
  @action
  showModal = () => {
    this.isModalOpen = true;
  };

  @action
  hideModal = () => {
    this.isModalOpen = false;
  };

  @action
  changeName = e => {
    this.version.name = e.target.value;
  };

  @action
  changePackageName = e => {
    this.version.package_name = e.target.value;
  };

  @action
  changeDescription = e => {
    this.version.description = e.target.value;
  };

  @action
  createVersionSubmit = async (appId, appStore) => {
    this.version.app_id = appId;
    await appStore.createVersion(toJS(this.version));
    this.isModalOpen = false;
  };

  @action
  deleteVersionShow = versionId => {
    this.versionId = versionId;
    this.showModal();
  };

  @action
  deleteVersionSubmit = async appStore => {
    await appStore.remove(this.versionId);
    this.showDeleteVersion = false;
  };
}
