import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import { Grid, Section, Card } from 'components/Layout';
import { Button, Image } from 'components/Base';
import Banner from 'components/Banner';
import Loading from 'components/Loading';
import DetailTabs from 'components/DetailTabs';
import Stars from 'components/Stars';
import TypeVersions from 'components/TypeVersions';
import { formatTime } from 'utils';
import routes, { toRoute } from 'routes';
import Screenshots from './Screenshots';
import Versions from './Versions';

import styles from './index.scss';

const tabs = [
  { name: 'App Detail', value: 'appDetail' },
  { name: 'Instructions', value: 'instructions' },
  { name: 'User Evaluation', value: 'evaluation', disabled: true }
];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  vendorStore: rootStore.vendorStore,
  user: rootStore.user
}))
@observer
export default class AppDetail extends Component {
  static propTypes = {
    isCreate: PropTypes.bool
  };

  static defaultProps = {
    isCreate: false
  };

  state = {
    isLoading: !this.props.isCreate,
    activeType: '',
    activeVersion: ''
  };

  async componentDidMount() {
    const {
      rootStore,
      appStore,
      appVersionStore,
      match,
      isCreate
    } = this.props;
    appStore.currentPic = 1;

    if (!isCreate) {
      const { appId } = match.params;

      rootStore.setNavFix(true);
      await appStore.fetch(appId);
      await appVersionStore.fetchTypeVersions(appId);

      // todo
      // await vendorStore.fetch(appDetail.vendor_id);

      await appStore.fetchActiveApps({ status: 'active' });

      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    const { appStore, appVersionStore, isCreate } = this.props;

    if (!isCreate) {
      appStore.reset();
      appVersionStore.reset();
    }
  }

  changeType = (value, type) => {
    if (value !== this.state[type]) {
      this.setState({ [type]: value });
    }
  };

  changeTab = async tab => {
    const { appStore } = this.props;

    if (tab !== appStore.detailTab) {
      appStore.detailTab = tab;
    }
  };

  renderProviderInfo() {
    const { vendorStore, t } = this.props;
    const { vendorDetail } = vendorStore;

    return (
      <Card className={styles.providerInfo}>
        <div className={styles.title}>{t('App service provider')}</div>
        <div className={styles.number}>
          {t('Provider No')}: &nbsp; {vendorDetail.user_id || t('None')}
        </div>
        <div className={styles.company}>
          {vendorDetail.company_name || t('unknown')}
        </div>

        <dl>
          <dt>{t('Evaluation stars')}</dt>
          <dd>
            <label className={styles.stars}>5.0</label>
            <Stars />
          </dd>
        </dl>
        <dl>
          <dt>{t('Business introduction')}</dt>
          <dd>{vendorDetail.company_profile || t('None')}</dd>
        </dl>
        <dl>
          <dt>{t('Company website')}</dt>
          <dd>{vendorDetail.company_website || t('None')}</dd>
        </dl>
        <dl>
          <dt>{t('Time of entry')}</dt>
          <dd>{formatTime(vendorDetail.submit_time)}</dd>
        </dl>
      </Card>
    );
  }

  renderInstructions() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    return (
      <div className={classnames('markdown', styles.instructions)}>
        <ReactMarkdown source={appDetail.readme || t('None')} />
      </div>
    );
  }

  renderAppDetail() {
    const { appStore, appVersionStore, t } = this.props;
    const { appDetail, currentPic, changePicture } = appStore;
    const { typeVersions } = appVersionStore;

    const { screenshots } = appDetail;
    let pictrues = [];
    try {
      pictrues = JSON.parse(screenshots) || [];
    } catch (err) {
      pictrues = screenshots ? screenshots.split(',') : [];
    }

    return (
      <div className={styles.appDetail}>
        <div className={styles.title}>{t('Introduction')}</div>
        <pre className={styles.description}>
          {appDetail.description || t('none')}
        </pre>
        <div className={styles.title}>{t('Screenshot')}</div>
        <Screenshots
          app={appDetail}
          currentPic={currentPic}
          changePicture={changePicture}
          pictures={pictrues}
        />
        <div className={styles.title}>{t('Versions')}</div>
        <Versions typeVersions={typeVersions} />
      </div>
    );
  }

  renderTypeVersions() {
    const {
      appStore, appVersionStore, user, t
    } = this.props;
    const { typeVersions } = appVersionStore;
    const { appDetail } = appStore;
    const { activeType, activeVersion } = this.state;

    const types = typeVersions.map(item => item.type);
    const selectItem = _.find(typeVersions, { type: activeType || types[0] }) || {};
    const versions = selectItem.versions || [];
    const selectVersion = activeVersion || _.get(versions, '[0].version_id');

    const deployUrl = toRoute(routes.portal.deploy, {
      appId: appDetail.app_id,
      versionId: selectVersion
    });

    return (
      <div className={styles.typeVersions}>
        <TypeVersions
          types={types}
          versions={versions}
          activeType={activeType || types[0]}
          activeVersion={selectVersion}
          changeType={this.changeType}
        />
        <dl>
          <dt />
          <dd>
            {user.user_id ? (
              <Link to={deployUrl}>
                <Button type="primary">{t('Deploy now')}</Button>
              </Link>
            ) : (
              <Link to={`/login?redirect_url=${deployUrl}`}>
                <Button type="primary">{t('Deploy after login')}</Button>
              </Link>
            )}
          </dd>
        </dl>
      </div>
    );
  }

  renderAppBase() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    return (
      <div className={styles.appBase}>
        <span className={styles.icon}>
          <Image
            src={appDetail.icon}
            iconSize={48}
            iconLetter={appDetail.name}
          />
        </span>
        <div className={styles.title}>{appDetail.name}</div>
        <div className={styles.abstraction}>
          <div className={styles.word}>
            {appDetail.abstraction || t('None')}
          </div>
          <div className={styles.category}>
            {t('Category')}:&nbsp;
            <label>
              {_.get(appDetail, 'category_set', [])
                .filter(cate => cate.category_id && cate.status === 'enabled')
                .map(cate => cate.name)
                .join(', ')}
            </label>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { appStore, isCreate, t } = this.props;
    const { detailTab, totalCount } = appStore;
    const { isLoading } = this.state;

    return (
      <Layout
        hideFooter={isCreate}
        className={classnames({ [styles.createOuter]: isCreate })}
        banner={
          <Banner
            hasSearch
            shrink
            title={t('App Store')}
            description={t('APP_TOTAL_DESCRIPTION', { total: totalCount })}
          />
        }
      >
        <Grid>
          <Section size={8}>
            <Loading isLoading={isLoading}>
              <Card>
                {this.renderAppBase()}
                {this.renderTypeVersions()}
                <DetailTabs
                  className={styles.detailTabs}
                  tabs={tabs}
                  changeTab={this.changeTab}
                />
                {detailTab === 'appDetail' && this.renderAppDetail()}
                {detailTab === 'instructions' && this.renderInstructions()}
              </Card>
            </Loading>
          </Section>

          <Section size={4}>{this.renderProviderInfo()}</Section>
        </Grid>
      </Layout>
    );
  }
}
