import React, { Component } from 'react';
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
import TimeShow from 'components/TimeShow';
import { imgPlaceholder, getObjName } from 'utils';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore,
  repoStore: rootStore.repoStore
}))
@observer
export default class CategoryDetail extends Component {
  static async onEnter({ categoryStore, appStore, repoStore }, { categoryId }) {
    appStore.currentPage = 1;
    appStore.searchWord = '';
    await categoryStore.fetch(categoryId);
    await appStore.fetchAll({ category_id: categoryId, status: ['active', 'deleted'] });
    await repoStore.fetchAll({ status: ['active', 'deleted'] });
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

  changePagination = page => {
    const { appStore } = this.props;
    appStore.setCurrentPage(page);
    appStore.fetchAll({ page });
  };

  changeApps = async current => {
    const { categoryStore, appStore } = this.props;
    await appStore.fetchAll({
      category_id: categoryStore.category.category_id,
      offset: (current - 1) * appStore.pageSize
    });
  };

  renderHandleMenu = category => {
    const { showModifyCategory } = this.props.categoryStore;
    return (
      <div className="operate-menu">
        <span onClick={showModifyCategory.bind(this, category)}>Modify Category</span>
      </div>
    );
  };

  handleModifyCate = () => {
    this.props.categoryStore.createOrModify();
  };

  renderCategoryModal = () => {
    const { categoryStore } = this.props;
    const { category, isModalOpen, hideModal, changeName, changeDescription } = categoryStore;

    return (
      <Dialog
        title="Modify Category"
        width={600}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleModifyCate}
      >
        <div className={styles.inputItem}>
          <label className={styles.name}>Name</label>
          <Input
            className={styles.input}
            name="name"
            required
            autoFocus
            onChange={changeName}
            defaultValue={category.name}
            maxlength="50"
          />
        </div>
        <div className={styles.inputItem}>
          <label className={classNames(styles.name, styles.textareaName)}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            defaultValue={category.description}
            onChange={changeDescription}
            maxlength="500"
          />
        </div>
      </Dialog>
    );
  };

  render() {
    const { categoryStore, appStore, repoStore } = this.props;
    const { category, notifyMsg, hideMsg } = categoryStore;
    const apps = appStore.apps.toJSON();
    const repos = repoStore.repos.toJSON();
    const { isLoading, appCount, totalCount } = appStore;
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

    const tags = [{ id: 1, name: 'Apps', link: '#' }];
    const curTag = 'Apps';

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <BackBtn label="categories" link="/dashboard/categories" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <CategoryCard detail={category} appCount={appCount} />
              <Popover className={styles.operation} content={this.renderHandleMenu(category)}>
                <Icon name="more" />
              </Popover>
            </div>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search App Name"
                  value={appStore.searchWord}
                  onSearch={this.onSearch}
                  onClear={this.onClearSearch}
                  maxlength="50"
                />
                <Button className={styles.buttonRight} onClick={this.onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={apps}
                className="detailTab"
                isLoading={isLoading}
              />
            </div>
            <Pagination onChange={this.changeApps} total={totalCount} />
          </div>
        </div>
        {this.renderCategoryModal()}
      </Layout>
    );
  }
}
