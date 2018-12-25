import { observable, action } from 'mobx';

import _ from 'lodash';
import { t } from 'i18next';
import Store from '../Store';

export default class ProviderCreateStore extends Store {
  @observable checkedProtocol = false;

  @observable activeStep = 1;

  steps = 1;

  btnText = 'Submit';

  @action
  changeProtocol = () => {
    this.checkedProtocol = !this.checkedProtocol;
  };

  @action
  nextStep = async () => {
    this.activeStep++;
  };
}
