import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { filter, get, orderBy } from 'lodash';
import classnames from 'classnames';

import { Icon, Button, Table, Popover, Select, Modal, Image } from 'components/Base';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import TimeShow from 'components/TimeShow';
import { getSessInfo, getObjName } from 'utils';

import styles from './index.scss';

@translate()
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
  static async onEnter({ appStore, categoryStore, repoStore, sessInfo }) {
    const role = getSessInfo('role', sessInfo);
    await appStore.fetchAll();
    if (role === 'adimin') {
      await appStore.appStatistics();
    }
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      limit: 99
    });
    await categoryStore.fetchAll();
  }

  constructor(props) {
    super(props);
    const { appStore, repoStore, sessInfo } = this.props;
    appStore.loadPageInit();
    repoStore.loadPageInit();
    this.role = getSessInfo('role', sessInfo);
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
        title={t('Modify App Category')}
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
    const { t } = this.props;
    const { showDeleteApp, showModifyAppCate } = this.props.appStore;
    let itemMenu = null,
      deployEntry = null;

    if (item.status !== 'deleted') {
      deployEntry = <Link to={`/store/${item.app_id}/deploy`}>{t('Deploy App')}</Link>;
      if (this.role === 'developer') {
        itemMenu = (
          <Fragment>
            <span onClick={showDeleteApp.bind(null, item.app_id)}>{t('Delete App')}</span>
          </Fragment>
        );
      }
      if (this.role === 'admin') {
        itemMenu = (
          <Fragment>
            <span onClick={showDeleteApp.bind(null, item.app_id)}>{t('Delete App')}</span>
            <span onClick={showModifyAppCate.bind(null, item.app_id, item.category_set)}>
              {t('Modify category')}
            </span>
          </Fragment>
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
        <Toolbar>
          <Button type="delete" onClick={() => showDeleteApp(appIds)} className="btn-handle">
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    const type = hasViewType ? viewType : '';

    return (
      <Toolbar
        placeholder={t('Search App')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={{ name: t('Create'), linkTo: `/dashboard/app/create` }}
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
    const { appStore, repoStore, t } = this.props;
    const {
      apps,
      summaryInfo,
      totalCount,
      isLoading,
      currentPage,
      changePagination,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus,
      viewType
    } = appStore;

    const { repos } = repoStore;

    let columns = [
      {
        title: t('App Name'),
        key: 'name',
        width: '175px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon || 'appcenter'}
            linkUrl={`/dashboard/app/${item.app_id}`}
          />
        )
      },
      {
        title: t('Latest Version'),
        key: 'latest_version',
        width: '120px',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('Categories'),
        key: 'category',
        width: '120px',
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
        key: 'developer',
        width: '80px',
        render: item => item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '92px',
        sorter: this.role === 'admin',
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

    if (this.role === 'developer') {
      columns = columns.filter(item => item.key !== 'developer');
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
          { name: t('Active'), value: 'active' },
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

    return (
      <Layout>
        {this.role === 'adimin' && (
          <Row>
            <Statistics {...summaryInfo} objs={repos.slice()} />
          </Row>
        )}

        <Row>
          <Grid>
            <Section size={12}>
              {this.role === 'developer' && this.renderToolbar(true)}

              {viewType === 'card' ? (
                this.renderCardApps()
              ) : (
                <Card>
                  {this.role === 'adimin' && this.renderToolbar()}

                  <Table
                    columns={columns}
                    dataSource={apps.toJSON()}
                    rowSelection={rowSelection}
                    isLoading={isLoading}
                    filterList={filterList}
                    pagination={pagination}
                    className={styles.appTable}
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
