import React, { Fragment, Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import {
  Input, Icon, Modal, Button
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
  async componentDidMount() {
    const { categoryStore, appStore } = this.props;
    const { changeCategory } = categoryStore;

    await categoryStore.fetchAll({ noLimit: true });
    await appStore.fetchAll({
      noLimit: true,
      keepAll: true,
      category_id: _.map(categoryStore.categories, cate => cate.category_id)
    });

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

  showOperation = type => {
    const { showModal } = this.props.categoryStore;
    showModal(type);
  };

  renderModals() {
    const { categoryStore, t } = this.props;
    const {
      category,
      modalType,
      isModalOpen,
      hideModal,
      createOrModify,
      remove
    } = categoryStore;

    if (!isModalOpen) {
      return null;
    }

    if (modalType === 'edit') {
      let modalTitle = t('Create Category');
      if (category && category.category_id) {
        modalTitle = t('Modify Category');
      }

      return (
        <Modal
          title={modalTitle}
          visible={isModalOpen}
          onCancel={hideModal}
          onOk={createOrModify}
        >
          <div className="formContent">
            <div>
              <label>{t('Name')}</label>
              <Input
                name="name"
                autoFocus
                defaultValue={category.name}
                onChange={categoryStore.changeName}
                maxLength="50"
              />
            </div>
            <div className="textareaItem">
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
    }

    if (modalType === 'delete') {
      return (
        <Dialog
          title={t('Delete Category')}
          visible={isModalOpen}
          onSubmit={remove}
          onCancel={hideModal}
        >
          {t('Delete Category desc')}
        </Dialog>
      );
    }

    if (modalType === 'customize') {
      return (
        <Dialog
          title={t('创建新分类')}
          visible={isModalOpen}
          onSubmit={remove}
          onCancel={hideModal}
        />
      );
    }

    if (modalType === 'adjust-cate') {
      return (
        <Dialog
          title={t('调整应用分类')}
          visible={isModalOpen}
          onSubmit={remove}
          onCancel={hideModal}
        />
      );
    }

    if (modalType === 'add-app') {
      return (
        <Dialog
          title={t('添加应用到 [分类]')}
          visible={isModalOpen}
          onSubmit={remove}
          onCancel={hideModal}
        >
          {t('Delete Category desc')}
        </Dialog>
      );
    }
  }

  filterApps = category_id => {
    const { allApps } = this.props.appStore;
    return _.filter(allApps, app => _.find(app.category_set, { category_id, status: 'enabled' })).length;
  };

  renderMenu() {
    const { categoryStore, t } = this.props;
    const { categories, selectedCategory, changeCategory } = categoryStore;

    this.normalizeCates = categories.filter(
      cate => cate.category_id !== 'ctg-uncategorized'
    );
    const uncategorized = _.find(categories, {
      category_id: 'ctg-uncategorized'
    });
    if (uncategorized) {
      this.normalizeCates.push(uncategorized);
    }

    return (
      <ul className={styles.cates}>
        {_.map(this.normalizeCates, ({ name, category_id }) => (
          <li
            key={category_id}
            className={classnames(styles.item, {
              [styles.active]: selectedCategory.category_id === category_id
            })}
            onClick={() => changeCategory({ name, category_id })}
          >
            <Icon name={name} type="dark" />
            <span className={styles.name}>{t(name)}</span>
            <span className={styles.count}>{this.filterApps(category_id)}</span>
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
