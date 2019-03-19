import React from 'react';
import { withTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';

import { Icon } from 'components/Base';
import Tabs from 'components/DetailTabs';
import { runtimeTabs } from 'config/runtimes';
import Card from '../Card';
import InstallList from '../InstanceList';

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
  fetchInstance() {
    const { runtimeClusterStore, user } = this.props;
    runtimeClusterStore.fetchAll({
      owner: user.user_id
    });
  }

  goBack = () => {
    this.props.envStore.changeRuntimeToShowInstances();
  };

  handleChangeTab = value => {
    this.props.runtimeStore.changeRuntimeTab(value);
    this.fetchInstance();
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
        <InstallList {...this.props} />
      </div>
    );
  }
}
