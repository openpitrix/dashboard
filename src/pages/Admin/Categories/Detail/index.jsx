import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { getParseDate } from 'utils';

import { Icon, Button, Input, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import CategoryCard from 'components/DetailCard/CategoryCard';
import Layout, { BackBtn, Dialog } from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore
}))
@observer
export default class CategoryDetail extends Component {
  static async onEnter({ categoryStore, appStore }, { categoryId }) {
    await categoryStore.fetch(categoryId);
    await appStore.fetchAll({ category_id: categoryId });
  }

  onSearch = async name => {
    const { categoryStore, appStore } = this.props;
    await appStore.fetchAll({
      category_id: categoryStore.category.category_id,
      search_word: name
    });
  };

  onRefresh = async () => {
    const { categoryStore, appStore } = this.props;
    await appStore.fetchAll({ category_id: categoryStore.category.category_id });
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

  handleModifyCate = ev => {
    this.props.categoryStore.createOrModify();
  };

  renderCategoryModal = () => {
    const { categoryStore } = this.props;
    const {
      category,
      isModalOpen,
      hideModal,
      changeName
      // changeLocale,
    } = categoryStore;

    return (
      <Dialog
        title="Modify Category"
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
          />
        </div>
        {/*<div className={styles.inputItem}>*/}
        {/*<label className={styles.name}>locale</label>*/}
        {/*<Input*/}
        {/*className={styles.input}*/}
        {/*name="locale"*/}
        {/*required*/}
        {/*onChange={changeLocale}*/}
        {/*defaultValue={category.locale}*/}
        {/*/>*/}
        {/*</div>*/}
      </Dialog>
    );
  };

  render() {
    const { categoryStore, appStore } = this.props;
    const { category } = categoryStore;
    const apps = toJS(appStore.apps);

    const { notifyMsg, hideMsg } = this.props.categoryStore;

    const columns = [
      {
        title: 'App Name',
        key: 'name',
        render: app => <TdName name={app.name} description={app.description} image={app.icon} />
      },
      {
        title: 'Latest Version',
        key: 'latest_version'
      },
      {
        title: 'Status',
        key: 'status',
        render: app => <Status type={app.status} name={app.status} />
      },
      {
        title: 'Developer',
        key: 'owner'
      },
      {
        title: 'Visibility',
        key: 'visibility'
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
              <CategoryCard detail={category} appCount={appStore.totalCount} />
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
                  placeholder="Search & Filter"
                  onSearch={this.onSearch}
                />
                <Button className={styles.buttonRight} onClick={this.onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table columns={columns} dataSource={apps} />
            </div>
            {appStore.totalCount > 0 && (
              <Pagination onChange={this.changeApps} total={appStore.totalCount} />
            )}
          </div>
        </div>
        {this.renderCategoryModal()}
      </Layout>
    );
  }
}
