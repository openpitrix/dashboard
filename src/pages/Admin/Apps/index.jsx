import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { filter, get } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover, Modal, Select } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';
import { getSessInfo, imgPlaceholder, getParseDate, getParseTime, getObjName } from 'utils';

import styles from './index.scss';
import classNames from 'classnames';

@inject(({ rootStore, sessInfo }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  repoStore: rootStore.repoStore,
  sessInfo
}))
@observer
export default class Apps extends Component {
  static async onEnter({ appStore, categoryStore }) {
    appStore.currentPage = 1;
    appStore.searchWord = '';
    await appStore.fetchAll();
    await categoryStore.fetchAll();
  }

  constructor(props) {
    super(props);
    this.role = getSessInfo('role', this.props.sessInfo);
  }

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
      appRepos,
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
      cancelSelected
    } = this.props.appStore;
    const imgPhd = imgPlaceholder();

    const columns = [
      {
        title: 'App Name',
        key: 'name',
        width: '205px',
        render: obj => (
          <TdName
            name={obj.name}
            description={obj.app_id}
            image={obj.icon || imgPhd}
            linkUrl={`/dashboard/app/${obj.app_id}`}
          />
        )
      },
      {
        title: 'Latest Version',
        key: 'latest_version',
        render: obj => get(obj, 'latest_app_version.name', '')
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '120px',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Categories',
        key: 'category',
        render: obj =>
          get(obj, 'category_set', [])
            .filter(cate => cate.category_id)
            .map(cate => cate.name)
            .join(', ')
      },
      {
        title: 'Visibility',
        key: 'visibility',
        render: app => getObjName(appRepos, 'repo_id', app.repo_id, 'visibility')
      },
      {
        title: 'Repo',
        key: 'repo_id',
        render: app => (
          <Link to={`/dashboard/repo/${app.repo_id}`}>
            {getObjName(appRepos, 'repo_id', app.repo_id, 'name')}
          </Link>
        )
      },
      {
        title: 'Developer',
        key: 'owner',
        render: obj => obj.owner
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: app => (
          <Fragment>
            <div>{getParseDate(app.status_time)}</div>
            <div>{getParseTime(app.status_time)}</div>
          </Fragment>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, item) => (
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

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg} isLoading={isLoading}>
        <Statistics {...summaryInfo} />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {appIds.length > 0 && (
              <div className={styles.toolbar}>
                <Button
                  type="primary"
                  className={styles.operation}
                  onClick={() => showDeleteApp(appIds)}
                >
                  <Icon name="check" />Delete
                </Button>
                <Button
                  className={classNames(styles.operation, styles.buttonRight)}
                  onClick={cancelSelected}
                >
                  <Icon name="refresh" /> Cancel Selected
                </Button>
              </div>
            )}
            {appIds.length === 0 && (
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search App Name or Keywords"
                  value={searchWord}
                  onSearch={onSearch}
                  onClear={onClearSearch}
                />
                <Button className={styles.buttonRight} onClick={onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
            )}

            <Table
              className={styles.tableOuter}
              columns={columns}
              dataSource={apps.toJSON()}
              rowSelection={rowSelection}
            />
          </div>
          <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        </div>
        {this.renderOpsModal()}
      </Layout>
    );
  }
}
