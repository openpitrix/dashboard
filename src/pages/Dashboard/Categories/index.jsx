import React, { Fragment, Component } from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import {
  Input, Icon, Modal, Button, Select
} from 'components/Base';
import Layout, { Dialog, Grid, Section } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import AppsTable from 'components/AppsTable';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  @computed
  get allAppsOfCurrentCate() {
    return this.props.appStore.allAppsOfCurrentCate;
  }

  async componentDidMount() {
    const { categoryStore } = this.props;
    const { changeCategory } = categoryStore;

    await categoryStore.fetchAll({ noLimit: true });

    await categoryStore.updateAppCategoryCounts();

    changeCategory(_.first(categoryStore.categories));
  }

  componentWillUnmount() {
    const { categoryStore, appStore } = this.props;
    categoryStore.reset();
    appStore.reset();
  }

  // renderHandleMenu = category => {
  //   const { categoryStore, t } = this.props;
  //   const { showDeleteCategory, showModifyCategory } = categoryStore;
  //
  //   return (
  //     <div className="operate-menu">
  //       <Link to={`/dashboard/category/${category.category_id}`}>
  //         {t('View detail')}
  //       </Link>
  //       <span onClick={showModifyCategory.bind(categoryStore, category)}>
  //         {t('Modify Category')}
  //       </span>
  //       <span onClick={showDeleteCategory.bind(categoryStore, category)}>
  //         {t('Delete')}
  //       </span>
  //     </div>
  //   );
  // };

  showOperation = async type => {
    const { categoryStore, appStore } = this.props;
    const { showModal } = categoryStore;
    showModal(type);
    if (type === 'delete') {
      // fetch all apps for current category
      await appStore.fetchAll({
        noLimit: true,
        keepAllForCate: true,
        noLoading: true
      });
    }
  };

  renderModals() {
    const { categoryStore, appStore, t } = this.props;
    const {
      categories,
      category,
      selectedCategory,
      modalType,
      isModalOpen,
      hideModal,
      handleOperation,
      filterApps
    } = categoryStore;

    if (!isModalOpen) {
      return null;
    }

    const { allApps, appIds } = appStore;
    const appNames = _.map(
      appIds,
      id => (_.find(allApps, { app_id: id }) || {}).name || ''
    );

    if (modalType === 'edit') {
      let modalTitle = t('Create Category');
      if (category && category.category_id) {
        modalTitle = t('Modify Category');
      }

      return (
        <Dialog
          title={modalTitle}
          visible={isModalOpen}
          onSubmit={handleOperation}
          onCancel={hideModal}
        >
          <p>edit category</p>
        </Dialog>
      );
    }

    if (modalType === 'delete') {
      const cateAppsNames = filterApps(
        selectedCategory.category_id,
        this.allAppsOfCurrentCate
      ).map(app => app.name);

      return (
        <Dialog
          title={t('Delete Category')}
          visible={isModalOpen}
          onSubmit={handleOperation}
          onCancel={hideModal}
          btnType="delete"
        >
          {t('TIPS_DELETE_CATE', {
            cateName: t(selectedCategory.name),
            appNames: cateAppsNames.join(', '),
            appCount: cateAppsNames.length
          })}
        </Dialog>
      );
    }

    if (modalType === 'customize') {
      return (
        <Dialog
          title={t('创建新分类')}
          visible={isModalOpen}
          onSubmit={handleOperation}
          onCancel={hideModal}
        />
      );
    }

    if (modalType === 'adjust-cate') {
      const { categoryToAdjust, changeCategoryToAdjust } = categoryStore;

      return (
        <Dialog
          title={t('调整应用分类')}
          visible={isModalOpen}
          onSubmit={handleOperation}
          onCancel={hideModal}
          okText={t('Submit')}
        >
          <p>
            {t('TIPS_ADJUST_APP_CATE', {
              appNames: appNames.join(', '),
              appCount: appNames.length
            })}
          </p>
          <Select
            value={categoryToAdjust || selectedCategory.category_id}
            onChange={changeCategoryToAdjust}
            className={styles.selectCateToAdjust}
          >
            {_.map(categories, ({ category_id, name }) => (
              <Select.Option value={category_id} key={category_id}>
                {t(name)}
              </Select.Option>
            ))}
          </Select>
        </Dialog>
      );
    }

    if (modalType === 'add-app') {
      return (
        <Dialog
          title={t('添加应用到 [分类]')}
          visible={isModalOpen}
          onSubmit={handleOperation}
          onCancel={hideModal}
        >
          {t('Delete Category desc')}
        </Dialog>
      );
    }
  }

  renderMenu() {
    const { categoryStore, t } = this.props;
    const {
      categories,
      selectedCategory,
      changeCategory,
      filterApps
    } = categoryStore;

    const normalizeCates = categories.filter(
      cate => cate.category_id !== 'ctg-uncategorized'
    );
    const uncategorized = _.find(categories, {
      category_id: 'ctg-uncategorized'
    });
    if (uncategorized) {
      normalizeCates.push(uncategorized);
    }

    return (
      <ul className={styles.cates}>
        {_.map(normalizeCates, ({ name, category_id }) => (
          <li
            key={category_id}
            className={classnames(styles.item, {
              [styles.active]: selectedCategory.category_id === category_id
            })}
            onClick={() => changeCategory({ name, category_id })}
          >
            <Icon name={name} type="dark" />
            <span className={styles.name}>{t(name)}</span>
            <span className={styles.count}>
              {filterApps(category_id).length}
            </span>
          </li>
        ))}
        <li
          className={styles.btnAdd}
          onClick={() => this.showOperation('customize')}
        >
          <Icon name="add" type="dark" />
          {t('Customize')}
        </li>
      </ul>
    );
  }

  renderToolbar() {
    const { appStore, t } = this.props;
    const {
      searchWord, onSearch, onClearSearch, onRefresh, appIds
    } = appStore;

    if (appIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button
            onClick={() => this.showOperation('adjust-cate')}
            className="btn-handle"
          >
            {t('Adjust category')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search Categories')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={{
          name: t('Create'),
          onClick: () => this.showOperation('add-app')
        }}
      />
    );
  }

  renderContent() {
    const { appStore, categoryStore } = this.props;
    const { apps, isLoading } = appStore;
    const { selectedCategory } = categoryStore;
    const displayCols = [
      'name',
      'delivery_type',
      'cnt_deploy',
      'maintainers',
      'status_time'
    ];

    if (!selectedCategory) {
      return null;
    }

    return (
      <Fragment>
        {this.renderToolbar()}
        <AppsTable
          store={appStore}
          data={apps}
          isLoading={isLoading}
          columnsFilter={cols => cols.filter(item => displayCols.includes(item.key))
          }
        />
      </Fragment>
    );
  }

  render() {
    const { categoryStore, t } = this.props;
    const { categories, isLoading, selectedCategory } = categoryStore;

    return (
      <Layout
        isLoading={isLoading}
        pageTitle="App category"
        className={styles.page}
      >
        <Grid>
          <Section size={3} className={styles.leftPanel}>
            <p className={styles.summary}>
              {t('All categories')}({categories.length})
            </p>
            {this.renderMenu()}
          </Section>
          <Section size={9} className={styles.rightPanel}>
            <div className={styles.topActions}>
              <span className={styles.choosen}>{t('Chosen category')}: </span>
              <span className={styles.name}>{t(selectedCategory.name)}</span>
              <div className={styles.actions}>
                <span onClick={() => this.showOperation('edit')}>
                  {t('Edit')}
                </span>
                <span onClick={() => this.showOperation('delete')}>
                  {t('Delete')}
                </span>
              </div>
            </div>
            {this.renderContent()}
            {this.renderModals()}
          </Section>
        </Grid>
      </Layout>
    );
  }
}
