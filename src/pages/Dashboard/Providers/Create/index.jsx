import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Button, Input, Checkbox, Icon, Notification } from 'components/Base';
import { Stepper } from 'components/Layout';
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
    const { t } = this.props;

    return (
      <div className={styles.successMessage}>
        <Icon className={styles.checkedIcon} name="checked-circle" size={48} />
        <div className={styles.textTip}>{t('提交成功')}</div>
        <div className={styles.textHeader}>
          {t('你的认证信息我们已经收到，会尽快完成审核。')}
        </div>
        <div className={styles.textTip}>{t('请留意审核结果通知。')}</div>
        <Link className={styles.successBtns} to="/dashboard/provider-detail">
          <Button type="primary">{t('查看应用商详情')}</Button>
        </Link>
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
          <dt>{t('基本信息')}</dt>
          <dd>{t('以下信息对于平台审核服务商资质非常重要，请准确填写')}:</dd>
        </dl>
        <dl>
          <dt>{t('公司名称')}</dt>
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
          <dt>{t('公司官网')}</dt>
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
          <dt>{t('业务简介')}</dt>
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
          <dt>{t('联系人信息')}</dt>
          <dd>
            {t(
              '在审核过程中，以及入驻之后的重要事件都会第一时间与联系人沟通。'
            )}
          </dd>
        </dl>
        <dl>
          <div className={styles.column}>
            <dt>{t('姓名')}</dt>
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
            <dt>{t('办公邮箱')}</dt>
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
          <dt>{t('手机号')}</dt>
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
          <dt>{t('对公账户信息')}</dt>
          <dd>{t('平台会通过此账号与贵公司进行各种财务结算。')}</dd>
        </dl>
        <dl>
          <dt>{t('开户银行')}</dt>
          <dd>
            <Input
              name="bank_name"
              value={vendorDetail.bank_name}
              onChange={e => changeVendor(e, 'bank_name')}
              maxLength={50}
            />
            <p className={styles.note}>
              {t('对公账号开户银行，精确到银行分行、支行、储蓄所、专柜')}
            </p>
          </dd>
        </dl>
        <dl>
          <dt>{t('开户名')}</dt>
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
          <dt>{t('账号')}</dt>
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
          <dt>{t('相关协议')}</dt>
          <dd>{t('入驻之后请自觉遵守以下协议。')}</dd>
        </dl>
        <div className={styles.protocol}>
          <Checkbox checked={checkedProtocol} onChange={changeProtocol} />
          《{t('服务商入驻协议')}》《{t('服务商管理规范')}》《{t(
            '服务商平台协议'
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
