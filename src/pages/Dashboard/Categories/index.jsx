import React, { Fragment, Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import {
  Input, Popover, Icon, Modal, Button
} from 'components/Base';
import Layout, { Dialog, Grid, Section } from 'components/Layout';
import AppImages from 'components/AppImages';
import Toolbar from 'components/Toolbar';
import { getScrollTop } from 'utils';
import AppsTable from 'components/AppsTable';
import CategoryCard from './CategoryCard';

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
    await categoryStore.fetchAll({ noLimit: true });
    await appStore.fetchAll({
      noLimit: true,
      category_id: _.map(categoryStore.categories, cate => cate.category_id)
    });
  }

  componentWillUnmount() {
    const { categoryStore, appStore } = this.props;

    window.onscroll = null;
    categoryStore.reset();
    appStore.reset();
  }

  handleScroll = async () => {
    const { categoryStore, appStore } = this.props;
    const { categories, initLoadNumber } = categoryStore;
    const len = categories.length;
    const loadDataHeight = 240 + 24;

    if (len <= initLoadNumber || categories[len - 1].apps) {
      return;
    }

    const scrollTop = getScrollTop();
    const loadNumber = parseInt(scrollTop / loadDataHeight) + 1;
    for (
      let i = initLoadNumber;
      i < len && i < initLoadNumber + loadNumber * 3;
      i++
    ) {
      if (!categories[i].appFlag) {
        categoryStore.categories[i].appFlag = true;
        await appStore.fetchAll({
          status: 'active',
          category_id: categories[i].category_id
        });
        const temp = categoryStore.categories[i];
        categoryStore.categories[i] = {
          total: appStore.totalCount,
          apps: appStore.apps,
          ...temp
        };
      }
    }
  };

  renderHandleMenu = category => {
    const { categoryStore, t } = this.props;
    const { showDeleteCategory, showModifyCategory } = categoryStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/category/${category.category_id}`}>
          {t('View detail')}
        </Link>
        <span onClick={showModifyCategory.bind(categoryStore, category)}>
          {t('Modify Category')}
        </span>
        <span onClick={showDeleteCategory.bind(categoryStore, category)}>
          {t('Delete')}
        </span>
      </div>
    );
  };

  renderOpsModal = () => {
    const { categoryStore, t } = this.props;
    const {
      isModalOpen, hideModal, category, createOrModify
    } = categoryStore;
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

  filterApps = category_id => {
    const { apps } = this.props.appStore;
    return _.filter(apps, app => _.find(app.category_set, { category_id, status: 'enabled' })).length;
  };

  renderMenu() {
    const { categoryStore, t } = this.props;
    const { categories, selectedCategory, setCategory } = categoryStore;

    const defaultCategories = categories.filter(
      cate => cate.category_id !== 'ctg-uncategorized'
    );
    const uncategorized = categories.filter(
      cate => cate.category_id === 'ctg-uncategorized'
    );

    return (
      <ul className={styles.cates}>
        {_.map(
          defaultCategories.concat(uncategorized),
          ({ name, category_id }) => (
            <li
              key={category_id}
              className={classnames(styles.item, {
                [styles.active]: selectedCategory === category_id
              })}
              onClick={() => setCategory(category_id)}
            >
              <Icon name={name} type="dark" />
              <span className={styles.proName}>{name}</span>
              <span className={styles.proCount}>
                {this.filterApps(category_id)}
              </span>
            </li>
          )
        )}
        <p>
          <span className={styles.btnAdd}>
            <Icon name="add" type="dark" />
            {t('自定义')}
          </span>
        </p>
      </ul>
    );
  }

  // renderContent(){
  //   return (
  //     <Toolbar
  //       placeholder={t('Search Categories')}
  //       searchWord={searchWord}
  //       onSearch={categoryStore.onSearch}
  //       onClear={categoryStore.onClearSearch}
  //       onRefresh={categoryStore.onRefresh}
  //       withCreateBtn={{ name: t('Create'), onClick: showCreateCategory }}
  //     />
  //   )
  // }

  render() {
    const { categoryStore, appStore, t } = this.props;
    const {
      categories,
      isLoading,
      searchWord,
      showCreateCategory
    } = categoryStore;

    const { apps } = appStore;
    const displayCols = [
      'name',
      'delivery_type',
      'cnt_deploy',
      'maintainers',
      'status_time'
    ];

    return (
      <Layout
        isLoading={isLoading}
        pageTitle="App category"
        className={styles.page}
      >
        <Grid>
          <Section size={3} className={styles.leftPanel}>
            <p className={styles.summary}>
              {t('全部分类')}({categories.length})
            </p>
            {this.renderMenu()}
          </Section>
          <Section size={9} className={styles.rightPanel}>
            <AppsTable
              store={appStore}
              data={apps}
              isLoading={appStore.isLoading}
              columnsFilter={cols => cols.filter(item => displayCols.includes(item.key))
              }
            />
          </Section>
        </Grid>
      </Layout>
    );
  }
}
