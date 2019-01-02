import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import _, { get, orderBy } from 'lodash';

import {
  Button, Select, Modal, Image
} from 'components/Base';
import Layout, { Dialog } from 'components/Layout';
import AppsTable from 'components/AppsTable';
import Toolbar from 'components/Toolbar';
import Loading from 'components/Loading';
import { sleep } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  repoStore: rootStore.repoStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Apps extends Component {
  async componentDidMount() {
    const {
      appStore, userStore, user, categoryStore, repoStore
    } = this.props;
    const { isAdmin } = user;

    // preset default status
    appStore.defaultStatus = ['active'];
    await appStore.fetchAll();

    if (isAdmin) {
      await userStore.fetchAll({ noLimit: true });
    }
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
    await categoryStore.fetchAll();
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.reset();
    appStore.defaultStatus = '';
  }

  onChangeSort = (params = {}) => {
    const { appStore } = this.props;
    const order = params.reverse ? 'asc' : 'desc';
    appStore.apps = orderBy(appStore.apps, params.sort_key, order);
  };

  changeView = async type => {
    const { appStore } = this.props;

    if (appStore.viewType !== type) {
      appStore.isLoading = true;
      appStore.viewType = type;
      await sleep(300);
      appStore.isLoading = false;
    }
  };

  renderDeleteDialog = () => {
    const { appStore, t } = this.props;
    const { isDeleteOpen, remove, hideModal } = appStore;

    return (
      <Dialog
        title={t('Delete App')}
        visible={isDeleteOpen}
        onSubmit={remove}
        onCancel={hideModal}
      >
        {t('Delete App desc')}
      </Dialog>
    );
  };

  renderOpsModal = () => {
    const { appStore, categoryStore, t } = this.props;
    const {
      isModalOpen,
      hideModal,
      handleApp,
      changeAppCate,
      modifyCategoryById
    } = appStore;
    const categories = categoryStore.categories.toJSON();
    const { selectedCategory } = handleApp;

    return (
      <Modal
        title={t('Choose App Category')}
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={modifyCategoryById}
      >
        <div className="formContent">
          <div className="inputItem selectItem">
            <label>{t('Category')}</label>
            <Select value={selectedCategory} onChange={changeAppCate}>
              {categories.map(({ category_id, name }) => (
                <Select.Option
                  key={category_id}
                  value={category_id}
                  isSelected={category_id === selectedCategory}
                >
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
    const { user, t } = this.props;
    const { showModifyAppCate } = this.props.appStore;
    const { isAdmin } = user;
    let itemMenu = null,
      deployEntry = null;

    if (item.status !== 'deleted') {
      deployEntry = (
        <Link to={`/store/${item.app_id}/deploy`}>{t('Deploy App')}</Link>
      );
      if (isAdmin) {
        itemMenu = (
          <span
            onClick={showModifyAppCate.bind(
              null,
              item.app_id,
              item.category_set
            )}
          >
            {t('Choose category')}
          </span>
        );
      }
    }

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/app/${item.app_id}`}>{t('View detail')}</Link>
        {deployEntry}
        {itemMenu}
      </div>
    );
  };

  renderToolbar(hasViewType) {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      showDeleteApp,
      selectIds,
      viewType
    } = this.props.appStore;

    if (selectIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button
            type="delete"
            onClick={() => showDeleteApp(selectIds)}
            className="btn-handle"
          >
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    const type = hasViewType ? viewType : '';
    const withCreateBtn = hasViewType
      ? { name: t('Create'), linkTo: `/dashboard/app/create` }
      : {};

    return (
      <Toolbar
        placeholder={t('Search App')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={withCreateBtn}
        viewType={type}
        changeView={this.changeView}
      />
    );
  }

  renderCardApps() {
    const { apps, isLoading } = this.props.appStore;

    return (
      <Loading isLoading={isLoading}>
        <div className={styles.appCardContent}>
          {apps.map(app => (
            <Link key={app.app_id} to={`/dashboard/app/${app.app_id}`}>
              <div className={styles.appCard}>
                <span className={styles.icon}>
                  <Image src={app.icon} iconSize={48} />
                </span>
                <p className={styles.name}>{app.name}</p>
                <p className={styles.description} title={app.description}>
                  {app.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Loading>
    );
  }

  render() {
    const {
      appStore, userStore, user, t
    } = this.props;
    const {
      apps,
      isLoading,
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh
    } = appStore;
    const { users } = userStore;
    const { isAdmin } = user;
    const urlPrefix = '/dashboard/app/';
    const columnsFilter = columns => {
      const excludeKeys = isAdmin ? 'owner' : 'maintainers';
      return columns.filter(item => item.key !== excludeKeys);
    };

    return (
      <Layout pageTitle={t('All Apps')}>
        <Toolbar
          placeholder={t('Search App Name or ID')}
          searchWord={searchWord}
          onSearch={onSearch}
          onClear={onClearSearch}
          onRefresh={onRefresh}
        />

        <AppsTable
          isLoading={isLoading}
          store={appStore}
          data={apps}
          columnsFilter={columnsFilter}
          inject={{
            users,
            isAdmin,
            urlPrefix,
            onChangeSort: this.onChangeSort
          }}
        />

        {this.renderOpsModal()}
        {this.renderDeleteDialog()}
      </Layout>
    );
  }
}
