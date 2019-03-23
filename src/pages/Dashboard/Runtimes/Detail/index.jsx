import React from 'react';
import { withTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';

import { Icon } from 'components/Base';
import Tabs from 'components/DetailTabs';
import { runtimeTabs } from 'config/runtimes';
import Card from '../Card';
import InstanceList from '../InstanceList';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  user: rootStore.user,
  envStore: rootStore.testingEnvStore,
  runtimeStore: rootStore.runtimeStore,
  runtimeClusterStore: rootStore.runtimeClusterStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore
}))
@observer
export default class RuntimeInstances extends React.Component {
  fetchInstances = () => {
    const { runtimeClusterStore, user } = this.props;
    runtimeClusterStore.fetchAll({
      owner: user.user_id
    });
  };

  goBack = () => {
    this.props.envStore.changeRuntimeToShowInstances();
  };

  handleChangeTab = value => {
    this.props.runtimeStore.changeClusterTab(value);
    this.fetchInstances();
  };

  render() {
    const { runtime, t } = this.props;

    return (
      <div>
        <div className={styles.toolbar} onClick={this.goBack}>
          <Icon name="previous" size={24} type="dark" />
          <span className={styles.backTxt}>{t('Back')}</span>
        </div>

        <Card {...runtime} />

        <Tabs
          className={styles.tabs}
          tabs={runtimeTabs}
          changeTab={this.handleChangeTab}
        />
        <InstanceList
          {...this.props}
          store={this.props.runtimeClusterStore}
          fetchAll={this.fetchInstances}
        />
      </div>
    );
  }
}
