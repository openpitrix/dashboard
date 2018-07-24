import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';

import Layout, { Grid, Section, BackBtn, Panel } from 'components/Layout';
import Button from 'components/Base/Button';
import Meta from './Meta';
import Information from './Information';
import { QingCloud, Helm } from './Body';
import { formatTime } from 'utils';

import styles from './index.scss';

const VersionItem = ({ title = '', value = '' }) => (
  <div className={styles.versionItem}>
    <div className={styles.title}>{title}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

VersionItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.node
};

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, appVersionStore }, { appId }) {
    appStore.currentPic = 1;
    await appStore.fetch(appId);
    await appVersionStore.fetchAll({ app_id: appId });
  }

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

  renderBody() {
    const { appStore } = this.props;
    const pictures = [
      '/assets/pictrues/pic2.png',
      '/assets/pictrues/pic3.png',
      '/assets/pictrues/pic4.png',
      '/assets/pictrues/pic5.png',
      '/assets/pictrues/pic6.jpeg',
      '/assets/pictrues/pic1.jpeg'
    ];

    // mock
    return (
      <QingCloud
        app={appStore.appDetail}
        currentPic={appStore.currentPic}
        changePicture={this.changePicture}
        pictures={pictures}
      />
    );
  }

  render() {
    const { appStore } = this.props;
    const { isLoading } = appStore;
    const appDetail = appStore.appDetail;

    return (
      <Layout
        noTabs
        noNotification
        isloading={isLoading}
        backBtn={<BackBtn label="catalog" link="/" />}
      >
        <Grid>
          <Section size={8}>
            <Panel className={styles.introCard}>
              <Meta app={appDetail} />
              {Math.random() > 0.5 ? this.renderBody() : <Helm />}
              <Information app={appDetail} />
            </Panel>
          </Section>
          {this.renderVersions()}
        </Grid>
      </Layout>
    );
  }

  renderVersions() {
    const { appStore, appVersionStore, t } = this.props;
    const appDetail = appStore.appDetail;
    const appVersions = appVersionStore.versions.toJSON();

    return (
      <Section>
        <Panel className={styles.detailCard}>
          <Link to={`/dashboard/app/${appDetail.app_id}/deploy`}>
            <Button
              className={styles.deployBtn}
              type="primary"
              disabled={appDetail.status === 'deleted'}
            >
              {t('Deploy')}
            </Button>
          </Link>
          <div className={styles.versions}>
            <p>{t('Chart Versions')}</p>
            <ul>
              {appVersions.map(version => (
                <li key={version.version_id}>
                  {version.name}
                  <span className={styles.time}>
                    {formatTime(version.create_time, 'MMM D, YYYY')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel className={styles.detailCard}>
          <VersionItem
            title={t('Application Version')}
            value={get(appDetail, 'latest_app_version.name')}
          />
          <VersionItem title={t('Home')} value={appDetail.home} />
          <VersionItem title={t('Source repository')} value={appDetail.sources} />
          <VersionItem title={t('Maintainers')} value={appDetail.maintainers} />
          <VersionItem title={t('Related')} />
        </Panel>
      </Section>
    );
  }
}
