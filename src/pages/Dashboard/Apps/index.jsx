import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { get, orderBy } from 'lodash';

import {
  Icon,
  Button,
  Table,
  Popover,
  Select,
  Modal,
  Image
} from 'components/Base';
import Layout, { Dialog, Card } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import TitleSearch from 'components/TitleSearch';
import Loading from 'components/Loading';
import { getObjName, mappingStatus } from 'utils';

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

    await appStore.fetchAll();
    if (isAdmin) {
      await appStore.fetchStatistics();
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
  }

  onChangeSort = (params = {}) => {
    const { appStore } = this.props;
    const order = params.reverse ? 'asc' : 'desc';
    appStore.apps = orderBy(appStore.apps, params.sort_key, order);
  };

  changeView = type => {
    const { appStore } = this.props;

    if (appStore.viewType !== type) {
      appStore.isLoading = true;
      appStore.viewType = type;
      // mimic loading
      setTimeout(() => {
        appStore.isLoading = false;
      }, 200);
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
      appIds,
      viewType
    } = this.props.appStore;

    if (appIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button
            type="delete"
            onClick={() => showDeleteApp(appIds)}
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
      appStore, repoStore, userStore, t
    } = this.props;
    const { apps, isLoading } = appStore;
    const { repos } = repoStore;
    const { users } = userStore;

    const columns = [
      {
        title: t('App Name'),
        key: 'name',
        width: '150px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon}
            linkUrl={`/dashboard/app/${item.app_id}`}
          />
        )
      },
      {
        title: t('应用介绍'),
        key: 'latest_version',
        width: '160px',
        render: item => item.abstraction
      },
      {
        title: t('Categories'),
        key: 'category',
        width: '100px',
        render: item => t(
          get(item, 'category_set', [])
            .filter(cate => cate.category_id && cate.status === 'enabled')
            .map(cate => cate.name)
            .join(', ')
        )
      },
      {
        title: t('交付类型'),
        key: 'app_version_types',
        width: '80px',
        render: item => item.app_version_types
      },
      {
        title: t('部署总次数'),
        key: 'deploy_total',
        width: '60px',
        render: item => item.deploy_total || 0
      },
      {
        title: t('Developer'),
        key: 'owner',
        width: '60px',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('上架时间'),
        key: 'status_time',
        width: '102px',
        render: item => item.status_time
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: appStore.changePagination,
      total: appStore.totalCount,
      current: appStore.currentPage,
      noCancel: false
    };

    const { searchWord, onSearch, onClearSearch } = appStore;

    return (
      <Layout>
        <TitleSearch
          title={t('All Apps')}
          placeholder={t('Search App')}
          searchWord={searchWord}
          onSearch={onSearch}
          onClear={onClearSearch}
        />

        <Table
          columns={columns}
          dataSource={apps.slice(0, 10)}
          pagination={pagination}
          isLoading={isLoading}
        />

        {this.renderOpsModal()}
        {this.renderDeleteDialog()}
      </Layout>
    );
  }
}
