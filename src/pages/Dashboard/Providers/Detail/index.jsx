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
  { name: 'Auth Information', value: 'certificationInfo' },
  { name: 'Contract', value: 'contract', disabled: true },
  { name: 'Margin', value: 'margin', disabled: true }
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
          {t('Current status')}：{t('Not paid')}
          <Button type="default">
            <Icon name="add" size={20} type="dark" className={styles.icon} />
            {t('Add record')}
          </Button>
        </div>
        <div>
          <dl>
            <dt>{t('Operation')}</dt>
            <dd>{t('Platform return')}</dd>
          </dl>
          <dl>
            <dt>{t('Amount')}</dt>
            <dd>2000.00</dd>
          </dl>
          <dl>
            <dt>{t('Document No')}</dt>
            <dd>2093842934503495238405234692345</dd>
          </dl>
          <dl>
            <dt>{t('Operation time')}</dt>
            <dd>2018年10月29日 19:21:32</dd>
          </dl>
          <dl>
            <dt>{t('Operator')}</dt>
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
        <div className={styles.total}>
          {t('SHELF_APP_TOTAL', { total: totalCount })}
        </div>

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
                {t('Delivery type')}:&nbsp;
                <label className={styles.types}>{item.app_version_types}</label>
                <br />
                {t('Total of deploy')}:&nbsp;
                <label className={styles.deployNumber}>
                  {item.deploy_total || 0}
                </label>
              </div>
              <div>
                <label className={styles.time}>
                  {t('Publish time')}:&nbsp; {getPastTime(item.status_time)}
                </label>
                <Link
                  to={`/dashboard/app/${item.app_id}`}
                  className={styles.link}
                >
                  {t('View detail')} →
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
            {t('Provider No')}:&nbsp; {vendorDetail.user_id}
          </div>
          <div className={styles.name}>{vendorDetail.company_name}</div>
        </div>
        <div className={styles.info}>
          <dl>
            <dt>{t('Business introduction')}</dt>
            <dd>{vendorDetail.company_profile}</dd>
          </dl>
          <dl>
            <dt>{t('Company website')}</dt>
            <dd>{vendorDetail.company_website}</dd>
          </dl>
          <dl>
            <dt>{t('Contact information')}</dt>
            <dd>
              {vendorDetail.authorizer_name}
              <br />
              {vendorDetail.authorizer_email}
              <br />
              {vendorDetail.authorizer_phone}
            </dd>
          </dl>
          <dl>
            <dt>{t('Time of entry')}</dt>
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
      <Layout pageTitle={t('App Service Provider Detail')} hasBack>
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
