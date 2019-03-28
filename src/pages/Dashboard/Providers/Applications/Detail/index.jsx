import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';

import { Button } from 'components/Base';
import Layout, { Card, Dialog } from 'components/Layout';
import Status from 'components/Status';
import TdUser from 'components/TdUser';
import { formatTime } from 'utils';
import routes, { toRoute } from 'routes';
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

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Applications extends Component {
  async componentDidMount() {
    const {
      vendorStore, userStore, user, match
    } = this.props;
    const { applyId } = match.params;
    const userId = applyId || user.user_id;
    await vendorStore.fetch(userId);

    const { vendorDetail } = vendorStore;
    await userStore.fetchAll({ user_id: vendorDetail.approver });
  }

  renderMessageDialog = () => {
    const { vendorStore, match, t } = this.props;
    const { applyId } = match.params;
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
        onSubmit={() => applyReject(applyId)}
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
      vendorStore, userStore, user, match, t
    } = this.props;
    const { applyId } = match.params;
    const { isISV } = user;
    const { vendorDetail, applyPass, applyRejectShow } = vendorStore;
    const { status } = vendorDetail;
    const isSubmit = ['new', 'rejected'].includes(status) || !status;

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
                <Link to={toRoute(routes.portal._isv.providerApply)}>
                  {t(
                    status === 'rejected' ? 'Re-submit' : 'Submit immediately'
                  )}
                </Link>
              )}
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
            <Button type="primary" onClick={() => applyPass(applyId)}>
              {t('Pass')}
            </Button>
          </dl>
        ) : (
          <dl>
            <dt>{t('Auditor')}:&nbsp;</dt>
            <dd>
              <TdUser users={userStore.users} userId={vendorDetail.approver} />
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

        <Card>
          <CertificateInfo />
        </Card>

        {this.renderMessageDialog()}
      </Layout>
    );
  }
}
