import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Button } from 'components/Base';
import Layout, { Card } from 'components/Layout';
import Status from 'components/Status';
import CertificateInfo from '../../CertificateInfo';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  providerStore: rootStore.providerStore,
  user: rootStore.user
}))
@observer
export default class Applications extends Component {
  // todo
  async componentDidMount() {}

  renderStatusInfo() {
    const { user, t } = this.props;
    const { isISV } = user;

    if (isISV) {
      return (
        <div className={styles.statusInfo}>
          <dl className={styles.status}>
            <dt>{t('申请状态')}:&nbsp;</dt>
            <dd>
              <Status type={'draft'} name={'未认证'} />
              <Link to="/dashboard/provider/create">{t('立即提交')}</Link>
            </dd>
          </dl>
          <dl>
            <dt>{t('保证金')}:&nbsp;</dt>
            <dd>
              未缴纳<Link to="#">{t('查看缴纳方式')}</Link>
            </dd>
          </dl>
          <dl>
            <dt>{t('创建时间：')}:&nbsp;</dt>
            <dd>2018年10月29日</dd>
          </dl>
        </div>
      );
    }

    return (
      <div className={styles.statusInfo}>
        <dl className={styles.status}>
          <dt>{t('申请状态')}:&nbsp;</dt>
          <dd>
            <Status type={'rejected'} name={'rejected'} />
          </dd>
        </dl>
        <dl>
          <dt>{t('拒绝时间')}:&nbsp;</dt>
          <dd>2018年10月29日</dd>
        </dl>
        {/* <dl>
            <dt>{t('审核人员')}:&nbsp;</dt>
            <dd><label>Grace</label> grace@yunify.com</dd>
          </dl> */}
        <dl>
          <Button type="delete">{t('Reject')} </Button>
          <Button type="primary">{t('Pass')} </Button>
        </dl>
      </div>
    );
  }

  renderBaseInfo() {
    const { user, t } = this.props;
    const { isISV } = user;
    const numberTitle = isISV ? t('服务商编号') : t('申请编号');

    return (
      <Card className={styles.baseInfo}>
        <div className={styles.number}>{numberTitle}：3920204948</div>
        <div className={styles.name}>杭州映云科技有限公司</div>
        {this.renderStatusInfo()}
        <div className={styles.reason}>
          <label>{t('原因')}:&nbsp;</label>
          <pre>介绍内容与官网地址不一致</pre>
        </div>
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
      </Layout>
    );
  }
}
