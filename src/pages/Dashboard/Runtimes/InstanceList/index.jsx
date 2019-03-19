import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { Icon, Button } from 'components/Base';
import Toolbar from 'components/Toolbar';
import EnhanceTable from 'components/EnhanceTable';
import instanceCols, { frontgateCols } from './columns';

const InstanceCluster = 0;
const AgentCluster = 1;

@withTranslation()
@inject(({ rootStore }) => ({
  user: rootStore.user,
  envStore: rootStore.testingEnvStore,
  runtimeClusterStore: rootStore.runtimeClusterStore,
  appStore: rootStore.appStore,
  rootStore
}))
@observer
export default class RuntimeInstances extends React.Component {
  static propTypes = {
    fetchAll: PropTypes.func,
    runtime: PropTypes.shape({
      name: PropTypes.string,
      runtime_id: PropTypes.string
    })
  };

  componentDidMount() {
    this.props.rootStore.sock.listenToJob(this.handleJobs);
  }

  componentWillUnmount() {
    this.props.rootStore.sock.unlisten(this.handleJobs);
  }

  get columns() {
    const {
      appStore, runtimeStore, user, t
    } = this.props;
    const { apps } = appStore;

    return runtimeStore.runtimeTab === InstanceCluster
      ? instanceCols(t, apps, user.isDev)
      : frontgateCols(t);
  }

  get isAgent() {
    return this.props.runtimeStore.runtimeTab === AgentCluster;
  }

  handleJobs = async ({ type = '', resource = {} }) => {
    const { rtype = '', rid = '', values = {} } = resource;
    const op = `${type}:${rtype}`;
    const { runtimeClusterStore, fetchAll } = this.props;
    const status = _.pick(values, ['status', 'transition_status']);
    const clusterIds = runtimeClusterStore.clusters.map(cl => cl.cluster_id);
    const nodeIds = runtimeClusterStore.clusters.map(cl => {
      const all_nodes = (cl.cluster_node_set || []).map(
        ({ node_id }) => node_id
      );
      return _.uniq(_.flatten(all_nodes));
    });

    // job updated
    if (op === 'update:job') {
      if (['successful', 'failed'].includes(status.status)) {
        await fetchAll();
      }
    }

    if (rtype === 'cluster' && clusterIds.includes(rid)) {
      runtimeClusterStore.clusters = runtimeClusterStore.clusters.map(cl => {
        if (cl.cluster_id === rid) {
          Object.assign(cl, status);
        }
        return cl;
      });
    }

    if (op === 'update:cluster_node' && nodeIds.includes(rid)) {
      await fetchAll();
    }
  };

  handleClickToolbar = () => {
    // todo
  };

  renderToolbar() {
    if (this.isAgent) {
      return null;
    }

    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      clusterIds
    } = this.props.runtimeClusterStore;

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
    const { runtimeClusterStore } = this.props;

    return (
      <EnhanceTable
        tableType="Clusters"
        columns={this.columns}
        data={runtimeClusterStore.clusters}
        store={runtimeClusterStore}
        isLoading={runtimeClusterStore.isLoading}
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
    return (
      <div>
        {this.renderToolbar()}
        {this.renderTable()}
      </div>
    );
  }
}
