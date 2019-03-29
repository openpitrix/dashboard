import { action } from 'mobx';
import _ from 'lodash';

import { useTableActions } from 'mixins';
import { formCheck, fieldCheck } from 'config/form-check';

import Store from '../Store';

const defaultStatus = ['submitted', 'passed', 'rejected'];

@useTableActions
export default class VendorStore extends Store {
  steps = 1;

  btnText = 'Submit';

  constructor(...args) {
    super(...args);

    this.defineObservables(function () {
      this.checkedProtocol = false;

      this.activeStep = 1;

      this.disableNextStep = true;

      this.isLoading = false;

      this.vendors = [];

      this.statistics = [];

      this.userId = '';

      this.activeType = 'unreviewed';

      this.isMessageOpen = false;

      this.rejectMessage = '';

      this.detailTab = '';

      this.vendorDetail = {
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

      this.checkResult = {};
    });
  }

  get userStore() {
    return this.getStore('user');
  }

  @action
  fetchAll = async (params = {}) => {
    const defaultParams = {
      status: defaultStatus,
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
        // user_id: _.uniq(userIds),
        status: ['passed']
      });
    }

    const approvers = this.vendors.map(item => item.approver);
    if (approvers.length > 0 && this.activeType === 'reviewed') {
      await this.userStore.fetchAll({
        user_id: _.uniq(approvers)
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
    if (data.status === 'submitted') {
      return this.info(
        'The application is under review and cannot be submitted repeatedly.'
      );
    }
    if (data.status === 'passed') {
      return this.info(
        'The application is pass review and cannot be submitted repeatedly.'
      );
    }

    this.checkResult = _.assign({}, formCheck('vendor', data));

    if (_.isEmpty(this.checkResult)) {
      const result = await this.create(this.userId, _.assign({}, data));

      if (_.get(result, 'user_id')) {
        this.activeStep++;
      }
    }
  };

  @action
  changeApplyPagination = async page => {
    this.currentPage = page;
    const status = this.activeType === 'unreviewed' ? ['submitted'] : ['rejected', 'passed'];
    await this.fetchAll({ status });
  };
}
