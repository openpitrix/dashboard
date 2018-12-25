import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import {
  Button, Input, Checkbox, Icon
} from 'components/Base';
import { Stepper } from 'components/Layout';
import CertificateInfo from '../CertificateInfo';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  providerStore: rootStore.providerStore,
  createStore: rootStore.providerCreateStore,
  user: rootStore.user
}))
@observer
export default class ApplicationCreate extends Component {
  // todo
  async componentDidMount() {}

  renderSuccessMessage() {
    const { createStore, t } = this.props;

    return (
      <div className={styles.successMessage}>
        <Icon className={styles.checkedIcon} name="checked-circle" size={48} />
        <div className={styles.textTip}>{t('提交成功')}</div>
        <div className={styles.textHeader}>
          {t('你的认证信息我们已经收到，会尽快完成审核。')}
        </div>
        <div className={styles.textTip}>{t('请留意审核结果通知。')}</div>
        <Link className={styles.successBtns} to="/">
          <Button type="primary">{t('查看应用商详情')}</Button>
        </Link>
        <div className={styles.certificateInfo}>
          <CertificateInfo />
        </div>
      </div>
    );
  }

  renderCreateFrom() {
    const { createStore, t } = this.props;
    const { checkedProtocol, changeProtocol } = createStore;

    return (
      <div className={styles.createFrom}>
        <dl>
          <dt>{t('基本信息')}</dt>
          <dd>{t('以下信息对于平台审核服务商资质非常重要，请准确填写')}:</dd>
        </dl>
        <dl>
          <dt>{t('公司名称')}</dt>
          <dd>
            <Input />
          </dd>
        </dl>
        <dl>
          <dt>{t('公司官网')}</dt>
          <dd>
            <Input />
          </dd>
        </dl>
        <dl className={styles.blockMargin}>
          <dt>{t('业务简介')}</dt>
          <dd>
            <textarea />
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
              <Input />
            </dd>
          </div>
          <div className={styles.column}>
            <dt>{t('办公邮箱')}</dt>
            <dd>
              <Input />
            </dd>
          </div>
        </dl>
        <dl className={styles.blockMargin}>
          <dt>{t('手机号')}</dt>
          <dd>
            <Input />
          </dd>
        </dl>
        <dl>
          <dt>{t('对公账户信息')}</dt>
          <dd>{t('平台会通过此账号与贵公司进行各种财务结算。')}</dd>
        </dl>
        <dl>
          <dt>{t('开户银行')}</dt>
          <dd>
            <Input />
            <p className={styles.note}>
              {t('对公账号开户银行，精确到银行分行、支行、储蓄所、专柜')}
            </p>
          </dd>
        </dl>
        <dl>
          <dt>{t('开户名')}</dt>
          <dd>
            <Input />
          </dd>
        </dl>
        <dl className={styles.blockMargin}>
          <dt>{t('账号')}</dt>
          <dd>
            <Input />
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
    const { createStore } = this.props;
    const { activeStep } = createStore;

    return (
      <Stepper name="CREATE_PROVIDER" stepOption={createStore}>
        {activeStep === 1 && this.renderCreateFrom()}
        {activeStep === 2 && this.renderSuccessMessage()}
      </Stepper>
    );
  }
}
