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

  @observable name = '';
  @observable packageName = '';
  @observable description = '';

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
  changeName = event => {
    this.name = event.target.value;
  };
  @action
  changePackage = event => {
    this.packageName = event.target.value;
  };
  @action
  changeDescription = event => {
    this.description = event.target.value;
  };

  @action
  async handleCreateVersion(appId) {
    if (!this.name) {
      this.showMsg('Please input Name!');
    } else if (!this.packageName) {
      this.showMsg('Please input Package Name!');
    } else {
      const data = {
        app_id: appId,
        name: this.name,
        package_name: this.packageName,
        description: this.description
      };
      const result = await this.create(data);
      this.postHandleApi(result, async () => {
        this.showMsg('Create App Version successful!', 'success');
        this.hideModal();
        await this.fetchAll({ app_id: appId });
      });
    }
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
