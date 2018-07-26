import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign } from 'lodash';
import { getFormData } from 'utils';
import { Base64 } from 'js-base64';

export default class AppVersionStore extends Store {
  @observable versions = [];
  @observable version = {};
  @observable isLoading = false;
  @observable isModalOpen = false;
  @observable isDialogOpen = false;
  @observable dialogType = ''; // delete, show_all
  @observable readme = '';
  @observable totalCount = 0;
  @observable currentPage = 1;

  @action
  async fetchAll(params = {}) {
    let pageOffset = params.page || 1;
    let defaultParams = {
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize,
      sort_key: 'create_time',
      reverse: true
    };
    if (params.page) {
      delete params.page;
    }

    this.isLoading = true;
    const result = await this.request.get('app_versions', assign(defaultParams, params));

    this.versions = get(result, 'app_version_set', []);
    this.totalCount = get(result, 'total_count', 0);
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
  showDialog = () => {
    this.isDialogOpen = true;
  };

  @action
  hideModal = () => {
    this.isModalOpen = false;
    this.isDialogOpen = false;
  };

  setDialogType(type) {
    this.dialogType = type;
  }

  @action
  showCreateVersion = () => {
    this.showModal();
  };

  @action
  showAllVersions = () => {
    this.setDialogType('show_all');
    this.showDialog();
  };

  @action
  showDeleteVersion = () => {
    this.setDialogType('delete');
    this.showDialog();
  };

  @action
  showDeleteApp = () => {
    this.setDialogType('deleteApp');
    this.showDialog();
  };

  @action
  async handleCreateVersion(e, params) {
    const data = getFormData(e.target);
    const result = await this.create(assign(data, params));
    this.postHandleApi(result, async () => {
      this.hideModal();
      await this.fetchAll({ app_id: params.app_id });
    });
  }

  @action
  async fetchPackageFiles(versionId) {
    const result = await this.request.get(`app_version/package/files`, {
      version_id: versionId,
      files: ['README.md']
    });
    const files = get(result, 'files', {});
    if (files['README.md']) {
      this.readme = Base64.decode(files['README.md']);
    } else {
      this.readme = '';
    }
  }
}
