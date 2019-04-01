import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import Layout from 'components/Layout';
import NoteLink from 'components/NoteLink';
import routes, { toRoute } from 'routes';
import Info from '../Info';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore
}))
@observer
export default class AppInfo extends Component {
  async componentDidMount() {
    const {
      appStore, appVersionStore, categoryStore, match
    } = this.props;
    const { appId } = match.params;

    // query this version relatived app info
    await appVersionStore.fetchAll({ app_id: appId });

    // query categories data for category select
    await categoryStore.fetchAll();

    // judge you can edit app info
    const { versions } = appVersionStore;
    const { appDetail } = appStore;
    appStore.isEdit = !_.find(versions, { status: 'in-review' })
      && appDetail.status !== 'deleted';
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  render() {
    const { appStore, match, t } = this.props;
    const { isEdit } = appStore;
    const { appId } = match.params;

    return (
      <Layout className={styles.appInfo} pageTitle={t('App Info')} isCenterPage>
        {isEdit ? (
          <div className={styles.note}>
            <label>{t('Note')}</label>
            {t('MODIFY_VERSION_TIPS')}
          </div>
        ) : (
          <NoteLink
            className={styles.auditNote}
            noteWord="UNDER_REVIEW_TIPS"
            linkWord="View version record"
            link={toRoute(routes.portal._dev.versions, { appId })}
          />
        )}
        <Info />
      </Layout>
    );
  }
}
