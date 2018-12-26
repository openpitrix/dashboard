import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Layout, { Grid, Section, Card } from 'components/Layout';
import { Button, Icon, Image } from 'components/Base';
import DetailTabs from 'components/DetailTabs';
import AppStatistics from 'components/AppStatistics';
import { formatTime, getPastTime } from 'utils';
import CertificateInfo from '../CertificateInfo';

import styles from './index.scss';

const tags = [
  { name: 'App', value: 'app' },
  { name: '认证信息', value: 'certificationInfo' },
  { name: '合约', value: 'contract', isDisabled: true },
  { name: '保证金', value: 'margin', isDisabled: true }
];
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  vendorStore: rootStore.vendorStore,
  appStore: rootStore.appStore
}))
@observer
export default class ProviderDetail extends Component {
  async componentDidMount() {
    const { vendorStore, appStore, match } = this.props;
    const { providerId } = match.params;

    await vendorStore.fetch(providerId);

    await appStore.fetchAll({
      owner: providerId,
      status: 'active',
      noLimit: true
    });
  }

  changeTab = tab => {
    const { vendorStore } = this.props;

    if (vendorStore.detailTab !== tab) {
      vendorStore.detailTab = tab;
    }
  };

  renderMargin() {
    const { t } = this.props;

    return (
      <Card className={styles.margin}>
        <div className={styles.title}>
          {t('当前状态')}：未缴纳
          <Button type="default">
            <Icon name="add" size={20} type="dark" className={styles.icon} />
            {t('添加记录')}
          </Button>
        </div>
        <div>
          <dl>
            <dt>{t('操作')}</dt>
            <dd>平台退回</dd>
          </dl>
          <dl>
            <dt>{t('金额')}</dt>
            <dd>2000.00</dd>
          </dl>
          <dl>
            <dt>{t('凭证编号')}</dt>
            <dd>2093842934503495238405234692345</dd>
          </dl>
          <dl>
            <dt>{t('操作时间')}</dt>
            <dd>2018年10月29日 19:21:32</dd>
          </dl>
          <dl>
            <dt>{t('操作人员')}</dt>
            <dd>Zhenzhen zhenzhen@yunify.com</dd>
          </dl>
        </div>
      </Card>
    );
  }

  renderApps() {
    const { appStore, t } = this.props;
    const { apps, totalCount } = appStore;

    return (
      <Card className={styles.appsInfo}>
        <div className={styles.total}>{t(`已上架 ${totalCount} 款应用`)}</div>

        <ul>
          {apps.map(item => (
            <li key={item.app_id}>
              <div className={styles.appName}>
                <span className={styles.image}>
                  <Image src={item.icon} iconLetter={item.name} iconSize={36} />
                </span>
                <span className={styles.info}>
                  <Link
                    to={`/dashboard/app/${item.app_id}`}
                    className={styles.name}
                  >
                    {item.name}
                  </Link>
                  <div className={styles.description}>{item.description}</div>
                </span>
              </div>
              <div>
                {t('交付方式')}:&nbsp;
                <label className={styles.types}>{item.app_version_types}</label>
                <br />
                {t('总部署次数')}:&nbsp;
                <label className={styles.deployNumber}>
                  {item.deploy_total || 0}
                </label>
              </div>
              <div>
                <label className={styles.time}>
                  {t('上架时间')}:&nbsp; {getPastTime(item.status_time)}
                </label>
                <Link
                  to={`/dashboard/app/${item.app_id}`}
                  className={styles.link}
                >
                  {t('查看详情')} →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    );
  }

  renderProviderInfo() {
    const { vendorStore, t } = this.props;
    const { vendorDetail } = vendorStore;

    return (
      <Card className={styles.providerInfo}>
        <div className={styles.title}>
          <div className={styles.number}>
            {t('服务商编号')}:&nbsp; {vendorDetail.user_id}
          </div>
          <div className={styles.name}>{vendorDetail.company_name}</div>
        </div>
        <div className={styles.info}>
          <dl>
            <dt>{t('业务介绍')}</dt>
            <dd>{vendorDetail.company_profile}</dd>
          </dl>
          <dl>
            <dt>{t('公司官网')}</dt>
            <dd>{vendorDetail.company_website}</dd>
          </dl>
          <dl>
            <dt>{t('联系人信息')}</dt>
            <dd>
              {vendorDetail.authorizer_name}
              <br />
              {vendorDetail.authorizer_email}
              <br />
              {vendorDetail.authorizer_phone}
            </dd>
          </dl>
          <dl>
            <dt>{t('入驻时间')}</dt>
            <dd>{formatTime(vendorDetail.submit_time)}</dd>
          </dl>
        </div>
      </Card>
    );
  }

  render() {
    const { t, vendorStore, appStore } = this.props;
    const { detailTab } = vendorStore;

    return (
      <Layout pageTitle={t('应用服务商详情')} hasBack>
        <Grid>
          <Section size={4}>{this.renderProviderInfo()}</Section>
          <Section size={8}>
            <AppStatistics appTotal={appStore.totalCount} />
            <DetailTabs tabs={tags} changeTab={this.changeTab} />
            {detailTab === 'app' && this.renderApps()}
            {detailTab === 'certificationInfo' && <CertificateInfo />}
            {detailTab === 'margin' && this.renderMargin()}
          </Section>
        </Grid>
      </Layout>
    );
  }
}
