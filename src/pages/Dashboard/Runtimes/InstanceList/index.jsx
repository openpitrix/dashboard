import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { Icon, Button } from 'components/Base';
import Toolbar from 'components/Toolbar';
import EnhanceTable from 'components/EnhanceTable';
import { CLUSTER_TYPE } from 'config/runtimes';
import instanceCols, { frontgateCols } from './columns';

@withTranslation()
@inject(({ rootStore }) => ({
  user: rootStore.user,
  envStore: rootStore.testingEnvStore,
  appStore: rootStore.appStore,
  rootStore
}))
@observer
export default class RuntimeInstances extends React.Component {
  static propTypes = {
    fetchAll: PropTypes.func,
    getColumns: PropTypes.any,
    runtime: PropTypes.shape({
      name: PropTypes.string,
      runtime_id: PropTypes.string
    }),
    store: PropTypes.object // injected cluster store
  };

  static defaultProps = {
    getColumns: null,
    store: {},
    fetchAll: () => {}
  };

  componentDidMount() {
    this.props.rootStore.sock.listenToJob(this.handleJobs);
  }

  componentWillUnmount() {
    this.props.rootStore.sock.unlisten(this.handleJobs);
  }

  get columns() {
    const {
      appStore, store, user, getColumns, t
    } = this.props;
    const { apps } = appStore;

    if (_.isFunction(getColumns)) {
      return getColumns;
    }

    return store.clusterTab === CLUSTER_TYPE.instance
      ? instanceCols(t, apps, user.isDev)
      : frontgateCols(t);
  }

  get isAgent() {
    return this.props.store.clusterTab === CLUSTER_TYPE.agent;
  }

  handleJobs = async ({ type = '', resource = {} }) => {
    const { rtype = '', rid = '', values = {} } = resource;
    const op = `${type}:${rtype}`;
    const { store, fetchAll } = this.props;
    const status = _.pick(values, ['status', 'transition_status']);
    const clusterIds = store.clusters.map(cl => cl.cluster_id);
    const nodeIds = store.clusters.map(cl => {
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
      store.clusters = store.clusters.map(cl => {
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
    } = this.props.store;

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
    const { store } = this.props;

    return (
      <EnhanceTable
        tableType="Clusters"
        columns={this.columns}
        data={store.clusters}
        store={store}
        isLoading={store.isLoading}
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
