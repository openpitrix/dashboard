import { observable, action } from 'mobx';
import Store from './Store';

export default class RepoHandleStore extends Store {
  @observable repoId = '';
  @observable showDeleteRepo = false;
  tags = [{ id: 1, name: 'Apps' }, { id: 2, name: 'Runtimes' }, { id: 3, name: 'Events' }];
  @observable curTagName = 'Apps';

  @action
  deleteRepoOpen = repoId => {
    this.repoId = repoId;
    this.showDeleteRepo = true;
  };

  @action
  deleteRepoClose = () => {
    this.showDeleteRepo = false;
  };

  @action
  deleteRepo = async repoStore => {
    await repoStore.deleteRepo([this.repoId]);
    this.showDeleteRepo = false;
    await repoStore.fetchRepos();
  };

  @action
  selectCurTag = tagName => {
    this.curTagName = tagName;
  };
}
