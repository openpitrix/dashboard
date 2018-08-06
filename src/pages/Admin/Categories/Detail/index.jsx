import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Icon, Input, Table, Pagination, Popover, Modal } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName, { ProviderName } from 'components/TdName';
import Toolbar from 'components/Toolbar';
import CategoryCard from 'components/DetailCard/CategoryCard';
import Layout, { BackBtn, Dialog, Grid, Section, Panel, Card } from 'components/Layout';
import TimeShow from 'components/TimeShow';
import { getObjName } from 'utils';

import styles from './index.scss';

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
    await appStore.fetchAll({ category_id: categoryId });
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      limit: 99
    });
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
    const { category } = categoryStore;
    const apps = appStore.apps.toJSON();
    const repos = repoStore.repos.toJSON();
    const { isLoading, appCount, totalCount, selectStatus } = appStore;

    const columns = [
      {
        title: 'App Name',
        key: 'name',
        width: '150px',
        render: item => (
          <TdName
            className="smallId"
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
        width: '90px',
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
        width: '95px',
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

    const pagination = {
      tableType: 'Apps',
      onChange: this.changeApps,
      total: totalCount,
      current: appStore.currentPage
    };

    return (
      <Layout backBtn={<BackBtn label="categories" link="/dashboard/categories" />}>
        <Grid>
          <Section>
            <Card>
              <CategoryCard detail={category} appCount={appCount} />
              <Popover className="operation" content={this.renderHandleMenu(category)}>
                <Icon name="more" />
              </Popover>
            </Card>
          </Section>
          <Section size={8}>
            <Panel>
              <TagNav tags={['Apps']} />
              <Card>
                <Toolbar
                  placeholder="Search App Name"
                  searchWord={appStore.searchWord}
                  onSearch={this.onSearch}
                  onClear={this.onClearSearch}
                  onRefresh={this.onRefresh}
                />

                <Table
                  columns={columns}
                  dataSource={apps}
                  className="detailTab"
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {this.renderCategoryModal()}
              {this.renderDeleteModal()}
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
