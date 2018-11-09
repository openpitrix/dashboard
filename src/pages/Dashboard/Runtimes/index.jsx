import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import { orderBy } from 'lodash';

import { Icon, Button, Popover, Table } from 'components/Base';
import Layout, { Dialog, Grid, Row, Section, Card, BreadCrumb } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import TimeShow from 'components/TimeShow';
import { formatTime, getObjName } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  userStore: rootStore.userStore
}))
@observer
export default class Runtimes extends Component {
  async componentDidMount() {
    const { runtimeStore, clusterStore, userStore } = this.props;

    await runtimeStore.fetchAll();
    await runtimeStore.fetchStatistics();
    await clusterStore.fetchAll({
      noLimit: true
    });
    await userStore.fetchAll({ noLimit: true });
  }

  componentWillUnmount() {
    const { runtimeStore } = this.props;
    runtimeStore.reset();
  }

  onChangeSort = (params = {}) => {
    const { runtimeStore } = this.props;
    const order = params.reverse ? 'asc' : 'desc';
    runtimeStore.runtimes = orderBy(runtimeStore.runtimes, params.sort_key, order);
  };

  renderHandleMenu = detail => {
    const { runtimeStore, t } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/runtime/${detail.runtime_id}`}>{t('View detail')}</Link>
        {detail.status !== 'deleted' && (
          <Fragment>
            <Link to={`/dashboard/runtime/edit/${detail.runtime_id}`}>{t('Modify Runtime')}</Link>
            <span onClick={() => showDeleteRuntime(detail.runtime_id)}>{t('Delete')}</span>
          </Fragment>
        )}
      </div>
    );
  };

  renderDeleteModal = () => {
    const { runtimeStore, t } = this.props;
    const { isModalOpen, hideModal, remove } = runtimeStore;

    return (
      <Dialog
        title={t('Delete Runtime')}
        isOpen={isModalOpen}
        onSubmit={remove}
        onCancel={hideModal}
      >
        {t('Delete Runtime desc')}
      </Dialog>
    );
  };

  renderToolbar() {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      showDeleteRuntime,
      runtimeIds
    } = this.props.runtimeStore;

    if (runtimeIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button
            type="delete"
            onClick={() => showDeleteRuntime(runtimeIds)}
            className="btn-handle"
          >
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search Runtimes')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={{ name: t('Create'), linkTo: `/dashboard/runtime/create` }}
      />
    );
  }

  render() {
    const { runtimeStore, clusterStore, userStore, t } = this.props;
    const data = runtimeStore.runtimes.toJSON();
    const clusters = clusterStore.clusters.toJSON();
    const { users } = userStore;

    const {
      summaryInfo,
      isLoading,
      currentPage,
      totalCount,
      changePagination,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus
    } = runtimeStore;

    const columns = [
      {
        title: t('Runtime Name'),
        dataIndex: 'name',
        key: 'name',
        width: '155px',
        render: (name, obj) => (
          <TdName
            name={name}
            description={obj.runtime_id}
            linkUrl={`/dashboard/runtime/${obj.runtime_id}`}
            noIcon
          />
        )
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={(text + '').toLowerCase()} name={text} />
      },
      {
        title: t('Provider'),
        key: 'provider',
        render: item => <ProviderName name={item.provider} provider={item.provider} />
      },
      {
        title: t('Zone/Namespace'),
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: t('Cluster Count'),
        key: 'node_count',
        width: '100px',
        render: runtime =>
          clusters.filter(cluster => runtime.runtime_id === cluster.runtime_id).length
      },
      {
        title: t('User'),
        key: 'owner',
        width: '100px',
        render: runtime => getObjName(users, 'user_id', runtime.owner, 'username') || runtime.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '102px',
        sorter: true,
        onChangeSort: this.onChangeSort,
        render: runtime => <TimeShow time={runtime.status_time} />
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        className: 'actions',
        render: runtime => (
          <Popover content={this.renderHandleMenu(runtime)} className="actions">
            <Icon name="more" />
          </Popover>
        )
      }
    ];

    const rowSelection = {
      type: 'checkbox',
      selectType: 'onSelect',
      selectedRowKeys: selectedRowKeys,
      onChange: onChangeSelect
    };

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Active'), value: 'active' },
          { name: t('Deleted'), value: 'deleted' }
        ],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Runtimes',
      onChange: changePagination,
      total: totalCount,
      current: currentPage,
      noCancel: false
    };

    return (
      <Layout>
        <BreadCrumb linkPath="Platform>Runtimes" />

        <Row>
          <Statistics {...summaryInfo} />
        </Row>

        <Row>
          <Grid>
            <Section size={12}>
              <Card>
                {this.renderToolbar()}
                <Table
                  columns={columns}
                  dataSource={data}
                  rowSelection={rowSelection}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {this.renderDeleteModal()}
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}
