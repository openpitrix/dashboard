import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import CategoryCard from 'components/DetailCard/CategoryCard';
import Layout, { BackBtn, Dialog } from 'components/Layout/Admin';
import { LayoutLeft, LayoutRight } from 'components/Layout';
import TimeShow from 'components/TimeShow';
import { imgPlaceholder, getObjName } from 'utils';
import styles from './index.scss';
import Modal from '../../../../components/Base/Modal';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore,
  repoStore: rootStore.repoStore
}))
@observer
export default class CategoryDetail extends Component {
  static async onEnter({ categoryStore, appStore, repoStore }, { categoryId }) {
    categoryStore.isDetailPage = true;
    appStore.currentPage = 1;
    appStore.searchWord = '';
    await categoryStore.fetch(categoryId);
    await appStore.fetchAll({ category_id: categoryId, status: ['active', 'deleted'] });
    await repoStore.fetchAll({ status: ['active', 'deleted'] });
  }

  componentDidUpdate() {
    const { category } = this.props.categoryStore;
    if (!category.category_id) {
      setTimeout(() => {
        location.href = '/dashboard/categories';
      }, 2000);
    }
  }

  onSearch = async name => {
    const { categoryStore, appStore } = this.props;
    const { fetchAll, changeSearchWord } = appStore;
    changeSearchWord(name);
    await fetchAll({
      category_id: categoryStore.category.category_id
    });
  };

  onClearSearch = async () => {
    await this.onSearch('');
  };

  onRefresh = async () => {
    const { categoryStore, appStore } = this.props;
    const { fetchAll, searchWord } = appStore;
    await fetchAll({
      category_id: categoryStore.category.category_id,
      search_word: searchWord
    });
  };

  changeApps = async current => {
    const { categoryStore, appStore } = this.props;
    await appStore.fetchAll({
      category_id: categoryStore.category.category_id,
      offset: (current - 1) * appStore.pageSize
    });
  };

  onChangeStatus = async status => {
    const { categoryStore, appStore } = this.props;
    appStore.selectStatus = appStore.selectStatus === status ? '' : status;
    await appStore.fetchAll({
      category_id: categoryStore.category.category_id,
      status: appStore.selectStatus
    });
  };

  renderHandleMenu = category => {
    const { showModifyCategory, showDeleteCategory } = this.props.categoryStore;
    return (
      <div className="operate-menu">
        <span onClick={() => showModifyCategory(category)}>Modify Category</span>
        <span onClick={() => showDeleteCategory(category)}>Delete Category</span>
      </div>
    );
  };

  handleModifyCate = () => {
    this.props.categoryStore.createOrModify();
  };

  renderCategoryModal = () => {
    const { categoryStore } = this.props;
    const { isModalOpen, hideModal, createOrModify, category } = categoryStore;

    return (
      <Modal
        title="Modify Category"
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={createOrModify}
      >
        <div className="formContent">
          <div className="inputItem">
            <label>Name</label>
            <Input
              name="name"
              autoFocus
              onChange={categoryStore.changeName}
              defaultValue={category.name}
              maxLength="50"
            />
          </div>
          <div className="inputItem textareaItem">
            <label>Description</label>
            <textarea
              name="description"
              defaultValue={category.description}
              onChange={categoryStore.changeDescription}
              maxLength="500"
            />
          </div>
        </div>
      </Modal>
    );
  };

  renderDeleteModal = () => {
    const { isDeleteOpen, hideModal, remove } = this.props.categoryStore;

    return (
      <Dialog title="Delete Category" visible={isDeleteOpen} onSubmit={remove} onCancel={hideModal}>
        Are you sure delete this category?
      </Dialog>
    );
  };

  render() {
    const { categoryStore, appStore, repoStore } = this.props;
    const { category, notifyMsg, notifyType, hideMsg } = categoryStore;
    const apps = appStore.apps.toJSON();
    const repos = repoStore.repos.toJSON();
    const { isLoading, appCount, totalCount, selectStatus } = appStore;
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
        width: '120px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];

    const filterList = [
      {
        key: 'status',
        conditions: [{ name: 'Active', value: 'active' }, { name: 'Deleted', value: 'deleted' }],
        onChangeFilter: this.onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const tags = [{ id: 1, name: 'Apps', link: '#' }];
    const curTag = 'Apps';

    return (
      <Layout msg={notifyMsg} msgType={notifyType} hideMsg={hideMsg}>
        <BackBtn label="categories" link="/dashboard/categories" />

        <LayoutLeft className="detail-outer">
          <CategoryCard detail={category} appCount={appCount} />
          <Popover className="operation" content={this.renderHandleMenu(category)}>
            <Icon name="more" />
          </Popover>
        </LayoutLeft>

        <LayoutRight className="table-outer">
          <TagNav tags={tags} curTag={curTag} />
          <div className="toolbar">
            <Input.Search
              className={styles.search}
              placeholder="Search App Name"
              value={appStore.searchWord}
              onSearch={this.onSearch}
              onClear={this.onClearSearch}
              maxLength="50"
            />
            <Button className="f-right" onClick={this.onRefresh}>
              <Icon name="refresh" size="mini" />
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={apps}
            className="detailTab"
            isLoading={isLoading}
            filterList={filterList}
          />
          <Pagination onChange={this.changeApps} total={totalCount} />
        </LayoutRight>

        {this.renderCategoryModal()}
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
