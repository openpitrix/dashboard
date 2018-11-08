import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { filter, get, orderBy, capitalize } from 'lodash';

import { Icon, Button, Table, Popover, Select, Modal, Image } from 'components/Base';
import Layout, { Dialog, Grid, Row, Section, Card, BreadCrumb } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import TimeShow from 'components/TimeShow';
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
    const { appStore, userStore, user, categoryStore, repoStore } = this.props;
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
      appStore.viewType = type;
    }
  };

  renderDeleteDialog = () => {
    const { appStore, t } = this.props;
    const { isDeleteOpen, remove, hideModal } = appStore;

    return (
      <Dialog title={t('Delete App')} visible={isDeleteOpen} onSubmit={remove} onCancel={hideModal}>
        {t('Delete App desc')}
      </Dialog>
    );
  };

  renderOpsModal = () => {
    const { appStore, categoryStore, t } = this.props;
    const { isModalOpen, hideModal, handleApp, changeAppCate, modifyCategoryById } = appStore;
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
    const { showDeleteApp, showModifyAppCate } = this.props.appStore;
    const { isAdmin } = user;
    let itemMenu = null,
      deployEntry = null;

    if (item.status !== 'deleted') {
      deployEntry = <Link to={`/store/${item.app_id}/deploy`}>{t('Deploy App')}</Link>;
      if (isAdmin) {
        itemMenu = (
          <span onClick={showModifyAppCate.bind(null, item.app_id, item.category_set)}>
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
          <Button type="delete" onClick={() => showDeleteApp(appIds)} className="btn-handle">
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    const type = hasViewType ? viewType : '';
    const withCreateBtn = hasViewType ? { name: t('Create'), linkTo: `/dashboard/app/create` } : {};

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
    const { apps } = this.props.appStore;

    return (
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
    );
  }

  render() {
    const { appStore, repoStore, userStore, user, t } = this.props;
    const { apps, summaryInfo, isLoading, onChangeStatus, selectStatus, viewType } = appStore;
    const { repos } = repoStore;
    const { users } = userStore;
    const { isNormal, isDev, isAdmin } = user;
    const urlFront = isAdmin ? '/store/' : '/dashboard/app/';

    let columns = [
      {
        title: t('App Name'),
        key: 'name',
        width: '165px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon || 'appcenter'}
            linkUrl={urlFront + item.app_id}
          />
        )
      },
      {
        title: t('Latest Version'),
        key: 'latest_version',
        width: '90px',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={mappingStatus(item.status)} />
      },
      {
        title: t('Categories'),
        key: 'category',
        width: '100px',
        render: item =>
          t(
            get(item, 'category_set', [])
              .filter(cate => cate.category_id && cate.status === 'enabled')
              .map(cate => cate.name)
              .join(', ')
          )
      },
      {
        title: t('Visibility'),
        key: 'visibility',
        width: '65px',
        render: item => t(getObjName(repos, 'repo_id', item.repo_id, 'visibility'))
      },
      {
        title: t('Repo'),
        key: 'repo_id',
        width: '125px',
        render: item => (
          <Link to={`/dashboard/repo/${item.repo_id}`}>
            <ProviderName
              className={styles.provider}
              name={getObjName(repos, 'repo_id', item.repo_id, 'name')}
              provider={getObjName(repos, 'repo_id', item.repo_id, 'providers[0]')}
            />
          </Link>
        )
      },
      {
        title: t('Developer'),
        key: 'owner',
        width: '80px',
        render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '102px',
        sorter: isAdmin,
        onChangeSort: this.onChangeSort,
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        render: item => (
          <div className={styles.actions}>
            <Popover content={this.renderHandleMenu(item)} className="actions">
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    if (!isAdmin) {
      columns = columns.filter(item => item.key !== 'owner');
    }

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: appStore.selectedRowKeys,
      onChange: appStore.onChangeSelect
    };

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Draft'), value: 'draft' },
          { name: t(mappingStatus('Active')), value: 'active' },
          { name: t(mappingStatus('Suspended')), value: 'suspended' },
          { name: t('Deleted'), value: 'deleted' }
        ],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: appStore.changePagination,
      total: appStore.totalCount,
      current: appStore.currentPage,
      noCancel: false
    };

    const linkPath = isAdmin ? 'Store>All Apps' : 'My Apps>All';

    return (
      <Layout>
        <BreadCrumb linkPath={linkPath} />

        {isAdmin && (
          <Row>
            <Statistics {...summaryInfo} objs={repos.slice()} />
          </Row>
        )}

        <Row>
          <Grid>
            <Section size={12}>
              {isDev && this.renderToolbar(true)}

              {viewType === 'card' ? (
                this.renderCardApps()
              ) : (
                <Card>
                  {isAdmin && this.renderToolbar()}

                  <Table
                    columns={columns}
                    dataSource={apps.slice(0, 10)}
                    rowSelection={rowSelection}
                    filterList={filterList}
                    pagination={pagination}
                    isLoading={isLoading}
                  />
                </Card>
              )}

              {this.renderOpsModal()}
              {this.renderDeleteDialog()}
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}
