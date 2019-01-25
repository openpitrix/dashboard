// uncategorized apps store, separate from app store
import { observable, action } from 'mobx';
import _ from 'lodash';

import { useTableActions } from 'mixins';
import Store from '../Store';

@useTableActions
class UncategoriedStore extends Store {
  idKey = 'category_id';

  defaultStatus = ['active'];

  @observable isLoading = false;

  @observable apps = [];

  @observable categoryId = '';

  @action
  fetchAll = async params => {
    params = this.normalizeParams(params);
    this.isLoading = true;
    if (this.categoryId) {
      params.category_id = this.categoryId;
    }
    if (this.searchWord) {
      params.search_word = this.searchWord;
    }

    const res = await this.request.get('apps', params);
    this.apps = _.get(res, 'app_set', []);
    this.totalCount = _.get(res, 'total_count', 0);

    this.isLoading = false;
  };

  reset = () => {
    this.categoryId = '';
    this.apps = [];
    this.resetTableParams();
  };
}

export default UncategoriedStore;
