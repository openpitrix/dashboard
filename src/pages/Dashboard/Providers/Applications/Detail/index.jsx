import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Button } from 'components/Base';
import Layout, { Card, Dialog } from 'components/Layout';
import Status from 'components/Status';
import { formatTime } from 'utils';
import CertificateInfo from '../../CertificateInfo';

import styles from './index.scss';

const statusMap = {
  new: 'Uncertified',
  submitted: 'In-review',
  passed: 'Certified',
  rejected: 'Rejected'
};
const statusTime = {
  submitted: 'Apply time',
  passed: 'Pass time',
  rejected: 'Reject time'
};

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore,
  user: rootStore.user
}))
@observer
export default class Applications extends Component {
  async componentDidMount() {
    const { vendorStore, user, match } = this.props;
    const { providerId } = match.params;
    const userId = providerId || user.user_id;
    await vendorStore.fetch(userId);
  }

  renderMessageDialog = () => {
    const { vendorStore, match, t } = this.props;
    const { providerId } = match.params;
    const {
      isMessageOpen,
      hideModal,
      changeRejectMessage,
      applyReject
    } = vendorStore;

    return (
      <Dialog
        title={t('Why refuse this application?')}
        isOpen={isMessageOpen}
        onCancel={hideModal}
        onSubmit={() => applyReject(providerId)}
      >
        <div className={styles.rejectMessage}>
          <textarea
            className={styles.reason}
            onChange={changeRejectMessage}
            maxLength={500}
            palaceholder={t('Please write down the reasons for rejection')}
          />
          <p className={styles.note}>{t('REJECT_REASON_NOTE')}</p>
        </div>
      </Dialog>
    );
  };

  renderStatusInfo() {
    const {
      vendorStore, user, match, t
    } = this.props;
    const { providerId } = match.params;
    const { isISV } = user;
    const { vendorDetail, applyPass, applyRejectShow } = vendorStore;
    const { status } = vendorDetail;
    const isSubmit = ['new', 'rejected'].includes(status);

    if (isISV) {
      return (
        <div className={styles.statusInfo}>
          <dl className={styles.status}>
            <dt>{t('Apply status')}:&nbsp;</dt>
            <dd>
              <span className={classnames(styles[status])}>
                {t(statusMap[status] || status)}
              </span>
              {isSubmit && (
                <Link to="/dashboard/provider/submit">
                  {t(status === 'new' ? 'Submit immediately' : 'Re-submit')}
                </Link>
              )}
            </dd>
          </dl>
          <dl>
            <dt>{t('Margin')}:&nbsp;</dt>
            <dd>
              {t('Not paid')}
              <Link to="#">{t('View payment method')}</Link>
            </dd>
          </dl>
          <dl>
            <dt>{t('Create Time')}:&nbsp;</dt>
            <dd>{formatTime(vendorDetail.status_time)}</dd>
          </dl>
        </div>
      );
    }

    return (
      <div className={styles.statusInfo}>
        <dl className={styles.status}>
          <dt>{t('Apply status')}:&nbsp;</dt>
          <dd>
            <Status type={status} name={status} />
          </dd>
        </dl>
        <dl>
          <dt>{t(statusTime[status])}:&nbsp;</dt>
          <dd>{formatTime(vendorDetail.submit_time)}</dd>
        </dl>
        {status === 'submitted' ? (
          <dl>
            <Button type="delete" onClick={applyRejectShow}>
              {t('Reject')}
            </Button>
            <Button type="primary" onClick={() => applyPass(providerId)}>
              {t('Pass')}
            </Button>
          </dl>
        ) : (
          <dl>
            <dt>{t('Auditor')}:&nbsp;</dt>
            <dd>
              <label>{user.username}</label>
              <span className={styles.email}>{user.email}</span>
            </dd>
          </dl>
        )}
      </div>
    );
  }

  renderBaseInfo() {
    const { user, vendorStore, t } = this.props;
    const { isISV } = user;
    const { vendorDetail } = vendorStore;
    const numberTitle = isISV ? t('Provider No') : t('Apply No');

    return (
      <Card className={styles.baseInfo}>
        <div className={styles.number}>
          {numberTitle}: {vendorDetail.user_id || user.user_id}
        </div>
        <div className={styles.name}>
          {vendorDetail.company_name || user.username}
        </div>
        {this.renderStatusInfo()}
        {vendorDetail.status === 'rejected' && (
          <div className={styles.reason}>
            <label>{t('Reason')}:&nbsp;</label>
            <pre>{vendorDetail.reject_message}</pre>
          </div>
        )}
      </Card>
    );
  }

  render() {
    const { user, t } = this.props;
    const { isISV } = user;
    const pagetTitle = isISV
      ? t('Service Provider Detail')
      : t('Details of app for residence');

    return (
      <Layout
        pageTitle={pagetTitle}
        hasBack={!isISV}
        isCenterPage
        noSubMenu
        centerWidth={760}
      >
        {this.renderBaseInfo()}
        <CertificateInfo />

        {this.renderMessageDialog()}
      </Layout>
    );
  }
}
