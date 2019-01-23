import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import {
  Button, Input, Checkbox, Icon, Notification
} from 'components/Base';
import { Stepper } from 'components/Layout';
import routes, { toRoute } from 'routes';
import CertificateInfo from '../CertificateInfo';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore,
  user: rootStore.user
}))
@observer
export default class ApplicationCreate extends Component {
  async componentDidMount() {
    const { vendorStore, user } = this.props;
    vendorStore.userId = user.user_id;

    if (user.isISV) {
      await vendorStore.fetch(user.user_id);
    }
  }

  componentWillUnmount() {
    const { vendorStore } = this.props;
    vendorStore.reset();
  }

  renderSuccessMessage() {
    const { user, t } = this.props;

    return (
      <div className={styles.successMessage}>
        <Icon className={styles.checkedIcon} name="checked-circle" size={48} />
        <div className={styles.textTip}>{t('Submit successful')}</div>
        <div className={styles.textHeader}>{t('SUBMIT_SUCCESS_HEADER')}</div>
        <div className={styles.textTip}>{t('SUBMIT_SUCCESS_TIP')}</div>
        {user.isNormal ? (
          <Link className={styles.successBtns} to="/">
            <Button type="primary">{t('Back to App Store')}</Button>
          </Link>
        ) : (
          <Link
            className={styles.successBtns}
            to={toRoute(routes.portal._isv.provider)}
          >
            <Button type="primary">
              {t('View app service provider detail')}
            </Button>
          </Link>
        )}
        <div className={styles.certificateInfo}>
          <CertificateInfo />
        </div>
      </div>
    );
  }

  renderCreateFrom() {
    const { vendorStore, t } = this.props;
    const {
      vendorDetail,
      changeVendor,
      changeProtocol,
      checkedProtocol
    } = vendorStore;

    return (
      <div className={styles.createFrom}>
        <dl>
          <dt>{t('Base Info')}</dt>
          <dd>{t('SUBMIT_WRITE_TIP')}:</dd>
        </dl>
        <dl>
          <dt>{t('Company name')}</dt>
          <dd>
            <Input
              name="company_name"
              value={vendorDetail.company_name}
              onChange={e => changeVendor(e, 'company_name')}
              maxLength={100}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('Company website')}</dt>
          <dd>
            <Input
              name="company_website"
              value={vendorDetail.company_website}
              onChange={e => changeVendor(e, 'company_website')}
              maxLength={100}
            />
          </dd>
        </dl>
        <dl className={styles.blockMargin}>
          <dt>{t('Business introduction')}</dt>
          <dd>
            <textarea
              name="company_profile"
              onChange={e => changeVendor(e, 'company_profile')}
              maxLength={5000}
              value={vendorDetail.company_profile}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('Contact information')}</dt>
          <dd>{t('CONTACT_INFORMATION_NOTE')}</dd>
        </dl>
        <dl>
          <div className={styles.column}>
            <dt>{t('name_provider')}</dt>
            <dd>
              <Input
                name="authorizer_name"
                value={vendorDetail.authorizer_name}
                onChange={e => changeVendor(e, 'authorizer_name')}
                maxLength={50}
              />
            </dd>
          </div>
          <div className={styles.column}>
            <dt>{t('Office mailbox')}</dt>
            <dd>
              <Input
                name="authorizer_email"
                value={vendorDetail.authorizer_email}
                onChange={e => changeVendor(e, 'authorizer_email')}
                maxLength={50}
              />
            </dd>
          </div>
        </dl>
        <dl className={styles.blockMargin}>
          <dt>{t('Mobile number')}</dt>
          <dd>
            <Input
              name="authorizer_phone"
              value={vendorDetail.authorizer_phone}
              onChange={e => changeVendor(e, 'authorizer_phone')}
              maxLength={13}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('Public account information')}</dt>
          <dd>{t('PUBLIC_ACCOUNT_NOTE')}</dd>
        </dl>
        <dl>
          <dt>{t('Opening bank')}</dt>
          <dd>
            <Input
              name="bank_name"
              value={vendorDetail.bank_name}
              onChange={e => changeVendor(e, 'bank_name')}
              maxLength={50}
            />
            <p className={styles.note}>{t('OPENING_BANK_NOTE')}</p>
          </dd>
        </dl>
        <dl>
          <dt>{t('Account name')}</dt>
          <dd>
            <Input
              name="bank_account_name"
              value={vendorDetail.bank_account_name}
              onChange={e => changeVendor(e, 'bank_account_name')}
              maxLength={100}
            />
          </dd>
        </dl>
        <dl className={styles.blockMargin}>
          <dt>{t('Account number')}</dt>
          <dd>
            <Input
              name="bank_account_number"
              value={vendorDetail.bank_account_number}
              onChange={e => changeVendor(e, 'bank_account_number')}
              maxLength={100}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('Relevant Agreement')}</dt>
          <dd>{t('RELEVANT_AGREEMENT_NOTE')}</dd>
        </dl>
        <div className={styles.protocol}>
          <Checkbox checked={checkedProtocol} onChange={changeProtocol} />
          《{t('SERVICE_ACCOMMODATION')}》《{t('SERVICE_MANAGEMENT')}》《{t(
            'SERVICE_PLATFORM'
          )}》
        </div>
      </div>
    );
  }

  render() {
    const { vendorStore } = this.props;
    const { activeStep, disableNextStep } = vendorStore;

    return (
      <Stepper
        name="CREATE_PROVIDER"
        stepOption={vendorStore}
        disableNextStep={disableNextStep}
      >
        {activeStep === 1 && this.renderCreateFrom()}
        {activeStep === 2 && this.renderSuccessMessage()}
        <Notification />
      </Stepper>
    );
  }
}
