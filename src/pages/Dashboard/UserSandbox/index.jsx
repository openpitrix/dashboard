import React from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Clusters } from 'pages/Dashboard';
import { setPage } from 'mixins';

@withTranslation()
@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  runtimeStore: rootStore.runtimeStore
}))
@setPage('clusterStore')
@observer
export default class UserSandbox extends React.Component {
  fetchData = async () => {
    const { clusterStore, runtimeStore, match } = this.props;
    const { appId } = match.params;

    Object.assign(clusterStore, {
      appId,
      attachVersions: true,
      attachUsers: true
    });

    await clusterStore.fetchAll();

    if (clusterStore.clusters.length) {
      await runtimeStore.fetchAll({
        status: ['active', 'deleted'],
        noLimit: true
      });
    }
  };

  render() {
    const { t } = this.props;

    return (
      <Clusters
        fetchData={this.fetchData}
        title={t('Sandbox-Instances')}
        {...this.props}
      />
    );
  }
}
