import { observable, action } from 'mobx';
import _ from 'lodash';

import { formCheck, fieldCheck } from 'config/form-check';

import Store from '../Store';

export default class VendorStore extends Store {
  @observable checkedProtocol = false;

  @observable activeStep = 1;

  @observable disableNextStep = true;

  @observable isLoading = false;

  @observable totalCount = 0;

  @observable currentPage = 1;

  @observable searchWord = '';

  @observable vendors = [];

  @observable statistics = [];

  @observable userId = '';

  @observable activeType = 'unreviewed';

  @observable isMessageOpen = false;

  @observable rejectMessage = '';

  @observable detailTab = '';

  @observable
  vendorDetail = {
    company_name: '',
    company_website: '',
    company_profile: '',
    authorizer_name: '',
    authorizer_email: '',
    authorizer_phone: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: ''
  };

  @observable checkResult = {};

  steps = 1;

  btnText = 'Submit';

  @action
  fetchAll = async (params = {}) => {
    const defaultParams = {
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize
    };

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }

    this.isLoading = true;

    const result = await this.request.get(
      'app_vendors',
      _.assign(defaultParams, params)
    );

    this.vendors = _.get(result, 'vendor_verify_info_set', []);

    const userIds = this.vendors.map(item => item.user_id);
    if (this.attchStatictics && userIds.length > 0) {
      await this.fetchStatistics({
        user_id: _.uniq(userIds)
      });
    }

    this.totalCount = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetch = async (userId = '') => {
    this.isLoading = true;
    const result = await this.request.get('app_vendors', {
      user_id: userId
    });
    this.vendorDetail = _.get(result, 'vendor_verify_info_set[0]', {});
    this.isLoading = false;
  };

  @action
  fetchStatistics = async (params = {}) => {
    this.isLoading = true;
    const result = await this.request.get(
      'app_vendors/app_vendor_statistics',
      params
    );

    this.statistics = _.get(result, 'vendor_verify_statistics_set', []);
    this.isLoading = false;
  };

  @action
  create = async (userId, params = {}) => {
    this.isLoading = true;
    const result = await this.request.post(
      'app_vendors',
      _.assign(params, { user_id: userId })
    );
    this.isLoading = false;
    return result;
  };

  @action
  applyPass = async userId => {
    this.isLoading = true;
    const result = await this.request.post('app_vendors/pass', {
      user_id: userId
    });
    this.isLoading = false;

    if (_.get(result, 'user_id')) {
      await this.fetch(userId);
    }
  };

  @action
  applyReject = async userId => {
    if (!this.rejectMessage) {
      return this.error('Please input the reason for reject');
    }

    this.isLoading = true;
    const result = await this.request.post('app_vendors/reject', {
      user_id: userId,
      reject_message: this.rejectMessage
    });
    this.isLoading = false;

    if (_.get(result, 'user_id')) {
      this.isMessageOpen = false;
      await this.fetch(userId);
    }
  };

  @action
  applyRejectShow = () => {
    this.isMessageOpen = true;
  };

  @action
  hideModal = () => {
    this.isMessageOpen = false;
  };

  @action
  changeRejectMessage = event => {
    this.rejectMessage = event.target.value;
  };

  @action
  changeVendor = async (event, type) => {
    this.vendorDetail[type] = event.target.value;
  };

  @action
  checkVendor = async (event, field, isFocus) => {
    if (isFocus) {
      this.checkResult = _.assign(this.checkResult, { [field]: '' });
    } else {
      this.checkResult = _.assign(
        this.checkResult,
        fieldCheck('vendor', field, event.target.value)
      );
    }
  };

  @action
  changeProtocol = () => {
    this.checkedProtocol = !this.checkedProtocol;

    if (this.checkedProtocol) {
      this.disableNextStep = this.vendorDetail.status === 'passed';
    }
  };

  @action
  nextStep = async () => {
    const data = this.vendorDetail;
    this.checkResult = _.assign({}, formCheck('vendor', data));

    if (_.isEmpty(this.checkResult)) {
      const result = await this.create(this.userId, _.assign({}, data));

      if (_.get(result, 'user_id')) {
        this.activeStep++;
      }
    }
  };

  @action
  onSearch = async word => {
    this.searchWord = word;
    this.currentPage = 1;
    await this.fetchAll();
  };

  @action
  onClear = async () => {
    await this.onSearch('');
  };

  @action
  changePagination = async page => {
    this.currentPage = page;
    await this.fetchAll();
  };

  @action
  changeApplyPagination = async page => {
    this.currentPage = page;
    const status = this.activeType === 'unreviewed' ? ['submitted'] : ['rejected', 'passed'];
    await this.fetchAll({ status });
  };

  reset = () => {
    this.currentPage = 1;
    this.searchWord = '';
    this.userId = '';
    this.activeType = 'unreviewed';
    this.checkedProtocol = true;

    this.vendors = [];
  };
}
