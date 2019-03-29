import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import { Grid, Section, Card } from 'components/Layout';
import Banner from 'components/Banner';
import TdName from 'components/TdName';
import VersionType from 'components/VersionType';
import Stars from 'components/Stars';
import { Clusters } from 'pages/Dashboard';
import { formatTime } from 'utils';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export default class PurchasedDetail extends Component {
  async componentDidMount() {
    const { appStore, match } = this.props;
    const { appId } = match.params;

    await appStore.fetch(appId);
  }

  componentWillUnmount() {
    const { appStore, clusterStore } = this.props;
    appStore.reset();
    clusterStore.reset();
  }

  renderAppBase() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    return (
      <Card className={styles.appBase}>
        <TdName
          className={styles.title}
          name={appDetail.name}
          description={
            appDetail.abstraction || appDetail.description || t('None')
          }
          image={appDetail.icon}
          noCopy
        />
        <div className={styles.info}>
          <dl>
            <dt>{t('App No')}</dt>
            <dd>{appDetail.app_id}</dd>
          </dl>
          <dl>
            <dt>{t('Categories')}</dt>
            <dd>
              {_.get(appDetail, 'category_set', [])
                .filter(cate => cate.category_id && cate.status === 'enabled')
                .map(cate => t(cate.name))
                .join(', ')}
            </dd>
          </dl>
          <dl>
            <dt>{t('Delivery type')}</dt>
            <dd>
              <VersionType types={appDetail.app_version_types} />
            </dd>
          </dl>
          <dl>
            <dt>{t('App service provider')}</dt>
            <dd>{appDetail.company_name}</dd>
          </dl>
          <dl>
            <dt>{t('Publish time')}</dt>
            <dd>{formatTime(appDetail.status_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
          </dl>
          <dl>
            <dt>{t('My Evaluation')}</dt>
            <dd>
              <Stars starTotal={5} />
            </dd>
          </dl>
        </div>
        <Link
          to={toRoute(routes.appDetail, { appId: appDetail.app_id })}
          className={styles.link}
        >
          {t('View in Store')} →
        </Link>
      </Card>
    );
  }

  render() {
    const { match, t } = this.props;
    const { appId } = match.params;

    return (
      <Layout
        banner={
          <Banner
            title={t('Purchased')}
            description={t('DEPLOYED_APP_DESCRIPTION')}
          />
        }
      >
        <Grid>
          <Section size={3}>{this.renderAppBase()}</Section>
          <Section size={9}>
            <Card>
              <Clusters appId={appId} />
            </Card>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
