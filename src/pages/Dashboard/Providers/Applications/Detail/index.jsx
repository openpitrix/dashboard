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
  new: '未认证',
  submitted: '审核中',
  passed: '已认证',
  rejected: '已拒绝'
};
const statusTime = {
  submitted: '申请时间',
  passed: '通过时间',
  rejected: '拒绝时间'
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
        title={t('为什么拒绝此申请？')}
        isOpen={isMessageOpen}
        onCancel={hideModal}
        onSubmit={() => applyReject(providerId)}
      >
        <div className={styles.rejectMessage}>
          <textarea
            className={styles.reason}
            onChange={changeRejectMessage}
            maxLength={500}
            palaceholder={t('请写下拒绝原因')}
          />
          <p className={styles.note}>
            {t('以上原因将会以邮件的形式发送给申请者，请仔细填写。')}
          </p>
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
            <dt>{t('申请状态')}:&nbsp;</dt>
            <dd>
              <span className={classnames(styles[status])}>
                {t(statusMap[status] || status)}
              </span>
              {isSubmit && (
                <Link to="/dashboard/provider/submit">
                  {t(status === 'new' ? '立即提交' : '重新提交')}
                </Link>
              )}
            </dd>
          </dl>
          <dl>
            <dt>{t('保证金')}:&nbsp;</dt>
            <dd>
              未缴纳<Link to="#">{t('查看缴纳方式')}</Link>
            </dd>
          </dl>
          <dl>
            <dt>{t('创建时间')}:&nbsp;</dt>
            <dd>{formatTime(vendorDetail.status_time)}</dd>
          </dl>
        </div>
      );
    }

    return (
      <div className={styles.statusInfo}>
        <dl className={styles.status}>
          <dt>{t('申请状态')}:&nbsp;</dt>
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
            <dt>{t('审核人员')}:&nbsp;</dt>
            <dd>
              <label>{user.username}</label> {user.email}
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
    const numberTitle = isISV ? t('服务商编号') : t('申请编号');

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
            <label>{t('原因')}:&nbsp;</label>
            <pre>{vendorDetail.reject_message}</pre>
          </div>
        )}
      </Card>
    );
  }

  render() {
    const { user, t } = this.props;
    const { isISV } = user;
    const pagetTitle = isISV ? t('服务商详情') : t('入驻申请详情');

    return (
      <Layout
        pageTitle={pagetTitle}
        hasBack={!isISV}
        isCenterPage
        noSubMenu
        centerWidth={660}
      >
        {this.renderBaseInfo()}
        <CertificateInfo />

        {this.renderMessageDialog()}
      </Layout>
    );
  }
}
