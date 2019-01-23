import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';

import { Icon, Button } from 'components/Base';
import Toolbar from 'components/Toolbar';
import EnhanceTable from 'components/EnhanceTable';
import columns from './columns';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user,
  envStore: rootStore.testingEnvStore,
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore
}))
@observer
export default class RuntimeInstances extends React.Component {
  static propTypes = {
    runtime: PropTypes.shape({
      name: PropTypes.string,
      runtime_id: PropTypes.string
    })
  };

  async componentDidMount() {
    const { clusterStore, runtime, user } = this.props;
    const { runtime_id } = runtime;

    clusterStore.runtimeId = runtime_id;

    await clusterStore.fetchAll({
      attachApps: true,
      runtime_id: runtime.runtime_id,
      owner: user.user_id
    });
  }

  componentWillUnmount() {
    this.props.clusterStore.reset();
  }

  goBack = () => {
    this.props.envStore.changeRuntimeToShowInstances();
  };

  handleClickToolbar = () => {
    // todo
  };

  renderToolbar() {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      clusterIds
    } = this.props.clusterStore;

    if (clusterIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button type="default" onClick={this.handleClickToolbar}>
            <Icon name="start" size={20} type="dark" />
            {t('Start')}
          </Button>
          <Button type="default" onClick={this.handleClickToolbar}>
            <Icon name="stop" size={20} type="dark" />
            {t('Stop')}
          </Button>
          <Button type="delete" onClick={this.handleClickToolbar}>
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search Clusters')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        noRefreshBtn
      />
    );
  }

  renderTable() {
    const {
      clusterStore, appStore, user, t
    } = this.props;
    const { clusters } = clusterStore;
    const { apps } = appStore;

    return (
      <EnhanceTable
        tableType="Clusters"
        columns={columns(t, apps, user.isDev)}
        data={clusters}
        store={clusterStore}
        isLoading={clusterStore.isLoading}
        replaceFilterConditions={[
          { name: 'Pending', value: 'pending' },
          { name: 'Active', value: 'active' },
          { name: 'Stopped', value: 'stopped' },
          { name: 'Suspended', value: 'suspended' },
          { name: 'Deleted', value: 'deleted' },
          { name: 'Ceased', value: 'ceased' }
        ]}
      />
    );
  }

  render() {
    const { runtime, t } = this.props;

    return (
      <div>
        <div className={styles.toolbar} onClick={this.goBack}>
          <Icon name="back" size={24} type="dark" />
          <span className={styles.backTxt}>{t('Back')}</span>
        </div>
        <div className={styles.title}>
          <span className={styles.tip}>{t('Selected runtime')}: </span>
          <span className={styles.txt}>{runtime.name}</span>
        </div>

        <div>
          {this.renderToolbar()}
          {this.renderTable()}
        </div>
      </div>
    );
  }
}
