import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover, Modal, Select } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog } from 'components/Layout/Admin';
import { getSessInfo, imgPlaceholder, getParseDate } from 'utils';

import styles from './index.scss';

@inject(({ rootStore, sessInfo }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
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
      changePagination
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
        render: obj => get(obj, 'latest_app_version.version_id', '')
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
            .map(cate => cate.name)
            .join(', ')
      },
      {
        title: 'Visibility',
        key: 'visibility'
      },
      {
        title: 'Repo',
        key: 'repo_id',
        render: obj => obj.repo_id
      },
      {
        title: 'Developer',
        key: 'owner',
        render: obj => obj.owner
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: obj => getParseDate(obj.status_time)
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

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg} isLoading={isLoading}>
        <Statistics {...summaryInfo} />
        <div className={styles.container}>
          <div className={styles.wrapper}>
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

            <Table className={styles.tableOuter} columns={columns} dataSource={apps.toJSON()} />
          </div>
          <Pagination onChange={changePagination} total={totalCount} current={currentPage} />
        </div>
        {this.renderOpsModal()}
      </Layout>
    );
  }
}
