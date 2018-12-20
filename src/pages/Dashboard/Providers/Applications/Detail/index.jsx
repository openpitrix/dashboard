import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Button } from 'components/Base';
import Layout, { Dailog, Card } from 'components/Layout';
import Status from 'components/Status';
import CertificateInfo from '../../CertificateInfo';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore
}))
@observer
export default class Applications extends Component {
  // todo
  async componentDidMount() {}

  renderBaseInfo() {
    const { t } = this.props;

    return (
      <Card className={styles.baseInfo}>
        <div className={styles.number}>{t('申请编号')}：3920204948</div>
        <div className={styles.name}>杭州映云科技有限公司</div>
        <div className={styles.info}>
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
        <div className={styles.reason}>
          <label>{t('原因')}:&nbsp;</label>
          <pre>介绍内容与官网地址不一致</pre>
        </div>
      </Card>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <Layout pageTitle={t('入驻申请详情')} hasBack centerWidth={660}>
        {this.renderBaseInfo()}
        <CertificateInfo />
      </Layout>
    );
  }
}
