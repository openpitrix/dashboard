import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Card } from 'components/Layout';
import { Icon } from 'components/Base';
import DetailTabs from 'components/DetailTabs';
import styles from './index.scss';

const tags = [
  { name: '认证信息', value: 'certificate' },
  { name: '合约', value: 'contract', isDisabled: true }
];
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore,
  user: rootStore.user
}))
@observer
export default class CertificateInfo extends Component {
  render() {
    const { user, vendorStore, t } = this.props;
    const { isISV } = user;
    const { vendorDetail } = vendorStore;

    if (isISV && !vendorDetail.company_name) {
      return (
        <Fragment>
          <DetailTabs tabs={tags} />
          <Card className={styles.blankInfo}>
            <Icon name="paper" size={48} type="dark" />
            <p className={styles.word}>{t('还未提交过认证信息')}</p>
          </Card>
        </Fragment>
      );
    }

    return (
      <Fragment>
        {isISV && <DetailTabs tabs={tags} />}
        <Card className={styles.certificateInfo}>
          {!isISV && <div className={styles.title}>{t('认证信息')}</div>}
          <div className={styles.info}>
            <dl>
              <dt>{t('公司名称')}</dt>
              <dd>{vendorDetail.company_name}</dd>
            </dl>
            <dl>
              <dt>{t('公司官网')}</dt>
              <dd>{vendorDetail.company_website}</dd>
            </dl>
            <dl>
              <dt>{t('业务简介')}</dt>
              <dd>
                <pre>{vendorDetail.company_profile}</pre>
              </dd>
            </dl>
            <dl>
              <dt>{t('姓名')}</dt>
              <dd>{vendorDetail.authorizer_name}</dd>
            </dl>
            <dl>
              <dt>{t('办公邮箱')}</dt>
              <dd>{vendorDetail.authorizer_email}</dd>
            </dl>
            <dl>
              <dt>{t('手机号')}</dt>
              <dd>{vendorDetail.authorizer_phone}</dd>
            </dl>
            <dl>
              <dt>{t('开户银行')}</dt>
              <dd>{vendorDetail.bank_name}</dd>
            </dl>
            <dl>
              <dt>{t('开户名')}</dt>
              <dd>{vendorDetail.bank_account_name}</dd>
            </dl>
            <dl>
              <dt>{t('账号')}</dt>
              <dd>{vendorDetail.bank_account_number}</dd>
            </dl>
          </div>
        </Card>
      </Fragment>
    );
  }
}
