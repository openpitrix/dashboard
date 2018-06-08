import { observable, action } from 'mobx';
import Store from './Store';

export default class RuntimeHandleStore extends Store {
  @observable runtimeId = '';
  @observable showDeleteRuntime = false;

  @action
  deleteRuntimeOpen = runtimeId => {
    this.runtimeId = runtimeId;
    this.showDeleteRuntime = true;
  };

  @action
  deleteRuntimeClose = () => {
    this.showDeleteRuntime = false;
  };

  @action
  deleteRuntime = async runtimeStore => {
    await runtimeStore.deleteRuntime([this.runtimeId]);
    this.showDeleteRuntime = false;
    await runtimeStore.fetchRuntimes();
  };
}
