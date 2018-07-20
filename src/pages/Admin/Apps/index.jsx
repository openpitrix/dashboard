import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { filter, get } from 'lodash';

import { Icon, Button, Table, Pagination, Popover, Select, Modal } from 'components/Base';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import { getSessInfo, getObjName } from 'utils';
import TimeShow from 'components/TimeShow';

import styles from './index.scss';

@inject(({ rootStore, sessInfo, sock }) => ({
  rootStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  repoStore: rootStore.repoStore,
  sessInfo,
  sock
}))
@observer
export default class Apps extends Component {
  static async onEnter({ appStore, categoryStore, repoStore }) {
    appStore.loadPageInit();
    await appStore.fetchAll();
    await appStore.appStatistics();
    await repoStore.fetchAll({ status: ['active', 'deleted'] });
    await categoryStore.fetchAll();
  }

  constructor(props) {
    super(props);
    this.role = getSessInfo('role', this.props.sessInfo);

    if (!props.sock._events['ops-resource']) {
      props.sock.on('ops-resource', this.listenToJob);
    }
  }

  listenToJob = payload => {
    const { rootStore } = this.props;

    if (['job'].includes(get(payload, 'resource.rtype'))) {
      rootStore.sockMessage = JSON.stringify(payload);
    }
  };

  renderDeleteModal = () => {
    const { isDeleteOpen, remove, hideModal } = this.props.appStore;

    return (
      <Dialog title="Delete App" visible={isDeleteOpen} onSubmit={remove} onCancel={hideModal}>
        Are you sure delete this App?
      </Dialog>
    );
  };

  renderOpsModal = () => {
    const { appStore, categoryStore } = this.props;
    const { isModalOpen, hideModal, handleApp, changeAppCate, modifyCategoryById } = appStore;
    const categories = categoryStore.categories.toJSON();

    return (
      <Modal
        title="Modify App Category"
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={modifyCategoryById}
      >
        <div className="formContent">
          <div className="inputItem selectItem">
            <label>Category</label>
            <Select value={handleApp.selectedCategory} onChange={changeAppCate}>
              {categories.map(({ category_id, name }) => (
                <Select.Option key={category_id} value={category_id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    );
  };

  renderHandleMenu = item => {
    const { showDeleteApp, showModifyAppCate } = this.props.appStore;
    let itemMenu = null;
    let deployEntry = <Link to={`/dashboard/app/${item.app_id}/deploy`}>Deploy app</Link>;

    if (item.status !== 'deleted') {
      if (this.role === 'developer') {
        itemMenu = (
          <Fragment>
            <span onClick={showDeleteApp.bind(null, item.app_id)}>Delete app</span>
          </Fragment>
        );
      }
      if (this.role === 'admin') {
        itemMenu = (
          <Fragment>
            <span onClick={showDeleteApp.bind(null, item.app_id)}>Delete app</span>
            <span onClick={showModifyAppCate.bind(null, item.app_id)}>Modify category</span>
          </Fragment>
        );
      }
    }

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/app/${item.app_id}`}>View detail</Link>
        {deployEntry}
        {itemMenu}
      </div>
    );
  };

  renderToolbar() {
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      showDeleteApp,
      appIds
    } = this.props.appStore;

    if (appIds.length) {
      return (
        <Toolbar>
          <Button type="delete" onClick={() => showDeleteApp(appIds)}>
            Delete
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder="Search App Name"
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      />
    );
  }

  render() {
    const {
      apps,
      summaryInfo,
      totalCount,
      notifyMsg,
      hideMsg,
      isLoading,
      currentPage,
      changePagination,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus
    } = this.props.appStore;

    const { repos } = this.props.repoStore;

    const columns = [
      {
        title: 'App Name',
        key: 'name',
        width: '205px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon || 'appcenter'}
            linkUrl={`/dashboard/app/${item.app_id}`}
          />
        )
      },
      {
        title: 'Latest Version',
        key: 'latest_version',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: 'Status',
        key: 'status',
        width: '120px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: 'Categories',
        key: 'category',
        render: item =>
          get(item, 'category_set', [])
            .filter(cate => cate.category_id)
            .map(cate => cate.name)
            .join(', ')
      },
      {
        title: 'Visibility',
        key: 'visibility',
        render: item => getObjName(repos, 'repo_id', item.repo_id, 'visibility')
      },
      {
        title: 'Repo',
        key: 'repo_id',
        render: item => (
          <Link to={`/dashboard/repo/${item.repo_id}`}>
            <ProviderName
              name={getObjName(repos, 'repo_id', item.repo_id, 'name')}
              provider={getObjName(repos, 'repo_id', item.repo_id, 'providers[0]')}
            />
          </Link>
        )
      },
      {
        title: 'Developer',
        key: 'owner',
        render: item => item.owner
      },
      {
        title: 'Updated At',
        key: 'status_time',
        width: '100px',
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: 'Actions',
        key: 'actions',
        render: item => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: selectedRowKeys,
      onChange: onChangeSelect
    };

    const filterList = [
      {
        key: 'status',
        conditions: [{ name: 'Active', value: 'active' }, { name: 'Deleted', value: 'deleted' }],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: changePagination,
      total: totalCount,
      current: currentPage
    };

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <Row>
          <Statistics {...summaryInfo} objs={repos.slice()} />
        </Row>

        <Row>
          <Grid>
            <Section size={12}>
              <Card>
                {this.renderToolbar()}
                <Table
                  columns={columns}
                  dataSource={apps.toJSON()}
                  rowSelection={rowSelection}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {this.renderOpsModal()}
              {this.renderDeleteModal()}
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}
