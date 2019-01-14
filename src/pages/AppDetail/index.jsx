import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import Layout, {
  Grid, Section, Card, TitleBanner
} from 'components/Layout';
import { Button, Image } from 'components/Base';
import Loading from 'components/Loading';
import DetailTabs from 'components/DetailTabs';
import Stars from 'components/Stars';
import { formatTime } from 'utils';
import { getVersionTypesName } from 'config/version-types';
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
      vendorStore,
      match,
      isCreate
    } = this.props;
    const { appDetail } = appStore;

    appStore.currentPic = 1;

    if (!isCreate) {
      const { appId } = match.params;

      rootStore.setNavFix(true);
      await appStore.fetch(appId);
      await appVersionStore.fetchTypeVersions(appId);

      // todo
      // await vendorStore.fetch(appDetail.vendor_id);

      await appStore.fetchActiveApps();

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

  changePicture = (type, number, pictures) => {
    const { appStore } = this.props;
    let { currentPic } = appStore;
    if (type === 'dot') {
      currentPic = number;
    }
    if (type === 'pre' && currentPic > 2) {
      currentPic -= 2;
    }
    if (type === 'next' && currentPic + 2 < pictures.length) {
      currentPic += 2;
    }
    appStore.currentPic = currentPic;
    return currentPic;
  };

  renderProviderInfo() {
    const { vendorStore, t } = this.props;
    const { vendorDetail } = vendorStore;

    return (
      <Card className={styles.providerInfo}>
        <div className={styles.title}>{t('应用服务商')}</div>
        <div className={styles.number}>
          {t('服务商编号')}: &nbsp; {vendorDetail.user_id || t('None')}
        </div>
        <div className={styles.company}>{vendorDetail.company_name}</div>

        <dl>
          <dt>{t('综合评价')}</dt>
          <dd>
            <label className={styles.stars}>5.0</label>
            <Stars />
          </dd>
        </dl>
        <dl>
          <dt>{t('业务简介')}</dt>
          <dd>{vendorDetail.company_profile || t('None')}</dd>
        </dl>
        <dl>
          <dt>{t('公司网站')}</dt>
          <dd>{vendorDetail.company_website || t('None')}</dd>
        </dl>
        <dl>
          <dt>{t('入驻时间')}</dt>
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
    const { appDetail, currentPic } = appStore;
    const { typeVersions } = appVersionStore;

    let screenshots = [];
    if (appDetail.screenshots) {
      try {
        screenshots = JSON.parse(appDetail.screenshots) || [];
      } catch (err) {
        screenshots = [];
      }
    }

    return (
      <div className={styles.appDetail}>
        <div className={styles.title}>{t('Introduction')}</div>
        <pre className={styles.description}>
          {appDetail.description || t('none')}
        </pre>
        <div className={styles.title}>{t('截图')}</div>
        <Screenshots
          app={appDetail}
          currentPic={currentPic}
          changePicture={this.changePicture}
          pictures={screenshots}
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

    const url = `/dashboard/apps/${appDetail.app_id}/deploy/${selectVersion}`;

    return (
      <div className={styles.typeVersions}>
        <dl>
          <dt>{t('Delivery type')}:</dt>
          <dd className={styles.types}>
            {types.map(type => (
              <label
                key={type}
                onClick={() => this.changeType(type, 'activeType')}
                className={classnames({
                  [styles.active]: (activeType || types[0]) === type
                })}
              >
                {getVersionTypesName(type) || t('None')}
              </label>
            ))}
          </dd>
        </dl>
        <dl>
          <dt>{t('版本号')}:</dt>
          <dd className={styles.types}>
            {versions.map(item => (
              <label
                key={item.version_id}
                onClick={() => this.changeType(item.version_id, 'activeVersion')
                }
                className={classnames({
                  [styles.active]: selectVersion === item.version_id
                })}
              >
                {item.name}
              </label>
            ))}
          </dd>
        </dl>
        <dl>
          <dt />
          <dd>
            {user.user_id ? (
              <Link to={url}>
                <Button type="primary">{t('立即部署')}</Button>
              </Link>
            ) : (
              <Link to={`/login?redirect_url=${url}`}>
                <Button type="primary">{t('登录后部署')}</Button>
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
      <Layout className={classnames({ [styles.createOuter]: isCreate })} isHome>
        {!isCreate && (
          <TitleBanner
            hasSearch
            title={t('App Store')}
            description={t('APP_TOTAL_DESCRIPTION', { total: totalCount })}
          />
        )}
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
