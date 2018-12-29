import React, { Fragment, Component } from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import {
  Input, Icon, Button, Select
} from 'components/Base';
import Layout, { Dialog, Grid, Section } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import AppsTable from 'components/AppsTable';
import Loading from 'components/Loading';
import { getIconList } from 'utils/icons';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  uncateAppStore: rootStore.appUncategoriedStore
}))
@observer
export default class Categories extends Component {
  async componentDidMount() {
    const { categoryStore, appStore } = this.props;
    const { changeCategory } = categoryStore;

    appStore.defaultStatus = ['active'];
    await categoryStore.fetchAll({ noLimit: true });
    await categoryStore.updateAppCategoryCounts();

    changeCategory(_.first(categoryStore.categories));
  }

  componentWillUnmount() {
    const { categoryStore, appStore, uncateAppStore } = this.props;
    categoryStore.reset();
    appStore.reset();
    appStore.defaultStatus = [];
    uncateAppStore.reset();
  }

  showOperation = async type => {
    const { categoryStore, uncateAppStore } = this.props;
    const { showModal, selectedCategory, createdCate } = categoryStore;
    showModal(type);

    if (type === 'edit') {
      Object.assign(
        createdCate,
        _.pick({ ...selectedCategory }, ['name', 'description'])
      );
    }

    if (type === 'customize') {
      categoryStore.createdCate = { name: '', description: '' };
    }

    if (type === 'add-app') {
      const category_id = categoryStore.reserveCateKey;
      uncateAppStore.categoryId = category_id;
      uncateAppStore.resetTableParams();
      await uncateAppStore.fetchAll({
        category_id
      });
    }
  };

  renderModals() {
    const { categoryStore, appStore, t } = this.props;
    const {
      categories,
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

    const { apps, selectIds } = appStore;
    const appNames = _.map(
      selectIds,
      id => (_.find(apps, { app_id: id }) || {}).name || ''
    );

    if (['edit', 'customize'].includes(modalType)) {
      const isEdit = modalType === 'edit';
      const title = isEdit ? t('Modify category') : t('创建新分类');
      const okText = isEdit ? t('Submit') : t('Create');

      const {
        createdCate,
        changeCreatedCateName,
        changeCreatedCateDesc
      } = categoryStore;
      const { name, description } = createdCate;
      const icons = getIconList();

      return (
        <Dialog
          title={title}
          visible={isModalOpen}
          onSubmit={handleOperation}
          onCancel={hideModal}
          okText={okText}
          footerCls={styles.dialogFooter}
        >
          <div className={styles.fmCtrl}>
            <label htmlFor="name" className={styles.label}>
              {t('Name')}
            </label>
            <div>
              <Input
                className={styles.name}
                value={name}
                onChange={changeCreatedCateName}
              />
            </div>
          </div>
          <div className={styles.fmCtrl}>
            <label htmlFor="desc" className={styles.label}>
              {t('图标')}
            </label>
            <div className={styles.icons}>
              {icons.map((icon, idx) => (
                <Icon
                  className={classnames(styles.icon, {
                    [styles.active]: description === icon
                  })}
                  name={icon}
                  size={24}
                  type="dark"
                  key={idx}
                  onClick={() => changeCreatedCateDesc(icon)}
                />
              ))}
            </div>
          </div>
        </Dialog>
      );
    }

    if (modalType === 'delete') {
      const cateAppsNames = filterApps(selectedCategory.category_id).map(
        app => app.name
      );

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
      const { uncateAppStore } = this.props;

      return (
        <Dialog
          title={t('TIPS_ADD_APP_TO_CATE', { name: selectedCategory.name })}
          visible={isModalOpen}
          onSubmit={handleOperation}
          onCancel={hideModal}
        >
          <p className={styles.addAppTips}>{t('CHOOSE_FROM_UNCATEGORY')}</p>
          <AppsTable
            isLoading={uncateAppStore.isLoading}
            store={uncateAppStore}
            data={uncateAppStore.apps}
            columnsFilter={cols => cols.filter(item => ['name', 'intro'].includes(item.key))
            }
          />
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
      cateAppsCount
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
        {_.map(
          normalizeCates,
          ({
            name, description, category_id, icon = ''
          }) => (
            <li
              key={category_id}
              className={classnames(styles.item, {
                [styles.active]: selectedCategory.category_id === category_id
              })}
              onClick={() => changeCategory({ name, description, category_id })}
            >
              <Icon name={icon || description} type="dark" />
              <span className={styles.name}>{t(name)}</span>
              <span className={styles.count}>
                {cateAppsCount[category_id] || 0}
              </span>
            </li>
          )
        )}
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
    const { appStore, categoryStore, t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      selectIds
    } = appStore;
    const { isModalOpen } = categoryStore;

    if (selectIds.length && !isModalOpen) {
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
          name: t('Add'),
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
            <Loading isLoading={isLoading}>
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
            </Loading>
            {this.renderModals()}
          </Section>
        </Grid>
      </Layout>
    );
  }
}
