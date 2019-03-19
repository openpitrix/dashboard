import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import { Card } from 'components/Layout';
import { Icon } from 'components/Base';
import DetailTabs from 'components/DetailTabs';
import styles from './index.scss';

const tags = [
  { name: 'Auth Information', value: 'certificate' },
  { name: 'Contract', value: 'contract', disabled: true }
];
@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore,
  user: rootStore.user
}))
@observer
export default class CertificateInfo extends Component {
  render() {
    const {
      user, vendorStore, i18n, t
    } = this.props;
    const { isISV } = user;
    const { vendorDetail } = vendorStore;
    const language = i18n.language || 'zh';

    if (isISV && !vendorDetail.company_name) {
      return (
        <Fragment>
          <DetailTabs tabs={tags} />
          <Card className={styles.blankInfo}>
            <Icon name="paper" size={48} type="dark" />
            <p className={styles.word}>
              {t('Auth information has not yet been submitted')}
            </p>
          </Card>
        </Fragment>
      );
    }

    return (
      <Fragment>
        {isISV && <DetailTabs tabs={tags} isCardTab />}
        <div
          className={classnames(styles.certificateInfo, {
            [styles.enInfo]: language === 'en'
          })}
        >
          {!isISV && (
            <div className={styles.title}>{t('Auth Information')}</div>
          )}
          <div className={styles.info}>
            <dl>
              <dt>{t('Company name')}</dt>
              <dd>{vendorDetail.company_name}</dd>
            </dl>
            <dl>
              <dt>{t('Company website')}</dt>
              <dd>{vendorDetail.company_website}</dd>
            </dl>
            <dl>
              <dt>{t('Business introduction')}</dt>
              <dd>
                <pre>{vendorDetail.company_profile}</pre>
              </dd>
            </dl>
            <dl>
              <dt>{t('name_provider')}</dt>
              <dd>{vendorDetail.authorizer_name}</dd>
            </dl>
            <dl>
              <dt>{t('Office mailbox')}</dt>
              <dd>{vendorDetail.authorizer_email}</dd>
            </dl>
            <dl>
              <dt>{t('Mobile number')}</dt>
              <dd>{vendorDetail.authorizer_phone}</dd>
            </dl>
            <dl>
              <dt>{t('Opening bank')}</dt>
              <dd>{vendorDetail.bank_name}</dd>
            </dl>
            <dl>
              <dt>{t('Account name')}</dt>
              <dd>{vendorDetail.bank_account_name}</dd>
            </dl>
            <dl>
              <dt>{t('Account number')}</dt>
              <dd>{vendorDetail.bank_account_number}</dd>
            </dl>
          </div>
        </div>
      </Fragment>
    );
  }
}
