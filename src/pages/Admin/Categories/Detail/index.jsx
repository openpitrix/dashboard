import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Input, Table, Pagination, Popover, Modal } from 'components/Base';
import Layout, { BackBtn, Dialog, Grid, Section, Panel, Card, NavLink } from 'components/Layout';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName, { ProviderName } from 'components/TdName';
import Toolbar from 'components/Toolbar';
import TimeShow from 'components/TimeShow';
import CategoryCard from 'components/DetailCard/CategoryCard';
import { getObjName, changeStatus } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore,
  repoStore: rootStore.repoStore
}))
@observer
export default class CategoryDetail extends Component {
  static async onEnter({ categoryStore, appStore, repoStore }, { categoryId }) {
    await categoryStore.fetch(categoryId);
    await appStore.fetchAll({ category_id: categoryId });
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
  }

  constructor(props) {
    super(props);
    const { categoryStore, appStore, match } = this.props;
    categoryStore.isDetailPage = true;
    appStore.loadPageInit();
    appStore.categoryId = match.params.categoryId;
  }

  componentDidUpdate() {
    const { category } = this.props.categoryStore;
    if (!category.category_id) {
      setTimeout(() => {
        location.href = '/dashboard/categories';
      }, 2000);
    }
  }

  renderHandleMenu = category => {
    const { t } = this.props;
    const { showModifyCategory, showDeleteCategory } = this.props.categoryStore;
    return (
      <div className="operate-menu">
        <span onClick={() => showModifyCategory(category)}>{t('Modify Category')}</span>
        <span onClick={() => showDeleteCategory(category)}>{t('Delete Category')}</span>
      </div>
    );
  };

  renderCategoryModal = () => {
    const { categoryStore, t } = this.props;
    const { isModalOpen, hideModal, createOrModify, category } = categoryStore;

    return (
      <Modal
        title={t('Modify Category')}
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={createOrModify}
      >
        <div className="formContent">
          <div className="inputItem">
            <label>{t('Name')}</label>
            <Input
              name="name"
              autoFocus
              onChange={categoryStore.changeName}
              defaultValue={category.name}
              maxLength="50"
            />
          </div>
          <div className="inputItem textareaItem">
            <label>{t('Description')}</label>
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
    const { t } = this.props;
    const { isDeleteOpen, hideModal, remove } = this.props.categoryStore;

    return (
      <Dialog
        title={t('Delete Category')}
        visible={isDeleteOpen}
        onSubmit={remove}
        onCancel={hideModal}
      >
        {t('Delete Category desc')}
      </Dialog>
    );
  };

  render() {
    const { categoryStore, appStore, repoStore, t } = this.props;
    const { category } = categoryStore;
    const apps = appStore.apps.toJSON();
    const repos = repoStore.repos.toJSON();
    const { isLoading, appCount, totalCount, selectStatus } = appStore;

    const columns = [
      {
        title: t('App Name'),
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
        title: t('Latest Version'),
        key: 'latest_version',
        width: '80px',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={item.status} />
      },
      /* {
        title: t('Visibility'),
        key: 'visibility',
        render: item => t(getObjName(repos, 'repo_id', item.repo_id, 'visibility'))
      },*/
      {
        title: t('Repo'),
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
      /* {
        title: t('Developer'),
        key: 'owner',
        render: item => item.owner
      },*/
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Draft'), value: 'draft' },
          { name: t(changeStatus('Active')), value: 'active' },
          { name: t(changeStatus('Suspended')), value: 'suspended' },
          { name: t('Deleted'), value: 'deleted' }
        ],
        onChangeFilter: appStore.changePagination,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: appStore.changePagination,
      total: totalCount,
      current: appStore.currentPage
    };

    return (
      <Layout className={styles.categoryDetail}>
        <NavLink>
          {t('Store')} / <Link to="/dashboard/categories">{t('Categories')}</Link> / {category.name}
        </NavLink>
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
              <Card hasTable>
                <Toolbar
                  placeholder={t('Search App')}
                  searchWord={appStore.searchWord}
                  onSearch={appStore.onSearch}
                  onClear={appStore.onClearSearch}
                  onRefresh={appStore.onRefresh}
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
