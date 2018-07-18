import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { filter, get } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover, Modal, Select } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';
import { getSessInfo, imgPlaceholder, getObjName } from 'utils';
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

  renderOpsModal = () => {
    const { appStore, categoryStore } = this.props;
    const { isModalOpen, hideModal, handleApp, changeAppCate } = appStore;
    let modalTitle = '',
      modalBody = null,
      onSubmit;

    if (handleApp.action === 'delete_app') {
      modalTitle = 'Delete App';
      onSubmit = appStore.remove.bind(appStore);
      modalBody = <div className={styles.noteWord}>Are you sure delete this App?</div>;
    }

    if (handleApp.action === 'modify_cate') {
      modalTitle = 'Modify App Category';
      const categories = categoryStore.categories.toJSON();
      onSubmit = appStore.modifyCategoryById.bind(appStore);

      modalBody = (
        <div className={styles.selectItem}>
          <label className={styles.name}>Category</label>
          <Select
            className={styles.select}
            value={handleApp.selectedCategory}
            onChange={changeAppCate}
          >
            {categories.map(({ category_id, name }) => (
              <Select.Option key={category_id} value={category_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>
      );
    }

    return (
      <Dialog title={modalTitle} isOpen={isModalOpen} onCancel={hideModal} onSubmit={onSubmit}>
        {modalBody}
      </Dialog>
    );
  };

  renderHandleMenu = item => {
    const { showDeleteApp, showModifyAppCate } = this.props.appStore;
    let itemMenu = null;
    let deployEntry = <Link to={`/dashboard/app/${item.app_id}/deploy`}>Deploy app</Link>;

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

    return (
      <div id={item.app_id} className="operate-menu">
        <Link to={`/dashboard/app/${item.app_id}`}>View detail</Link>
        {deployEntry}
        {itemMenu}
      </div>
    );
  };

  render() {
    const {
      apps,
      summaryInfo,
      totalCount,
      notifyMsg,
      hideMsg,
      isLoading,
      searchWord,
      currentPage,
      onSearch,
      onClearSearch,
      onRefresh,
      changePagination,
      showDeleteApp,
      appIds,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus
    } = this.props.appStore;
    const { repos } = this.props.repoStore;
    const imgPhd = imgPlaceholder();

    const columns = [
      {
        title: 'App Name',
        key: 'name',
        width: '205px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon || imgPhd}
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
            {getObjName(repos, 'repo_id', item.repo_id, 'name')}
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

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <Statistics {...summaryInfo} objs={repos.slice()} />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {appIds.length > 0 && (
              <div className={styles.toolbar}>
                <Button
                  type="primary"
                  className={styles.delete}
                  onClick={() => showDeleteApp(appIds)}
                >
                  Delete
                </Button>
              </div>
            )}
            {appIds.length === 0 && (
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search App Name"
                  value={searchWord}
                  onSearch={onSearch}
                  onClear={onClearSearch}
                  maxLength="50"
                  max
                />
                <Button className={'refresh-btn'} onClick={onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
            )}

            <Table
              className={styles.tableOuter}
              columns={columns}
              dataSource={apps.toJSON()}
              rowSelection={rowSelection}
              isLoading={isLoading}
              filterList={filterList}
            />
          </div>
          <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        </div>
        {this.renderOpsModal()}
      </Layout>
    );
  }
}
