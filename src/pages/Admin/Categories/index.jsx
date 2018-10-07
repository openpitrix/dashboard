import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { throttle } from 'lodash';
import { translate } from 'react-i18next';

import { Input, Button, Popover, Icon, Modal } from 'components/Base';
import Layout, { Dialog, Grid, Section, NavLink } from 'components/Layout';
import AppImages from 'components/AppImages';
import Toolbar from 'components/Toolbar';
import CategoryCard from './CategoryCard';
import { getScrollTop } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  constructor(props) {
    super(props);
    const { categoryStore, appStore } = this.props;
    categoryStore.appStore = appStore;
    categoryStore.isDetailPage = false;
    categoryStore.reset();
    appStore.loadPageInit();
  }

  async componentDidMount() {
    const { categoryStore, appStore } = this.props;

    window.scroll({ top: 0, behavior: 'auto' });
    window.onscroll = throttle(this.handleScroll, 200);

    categoryStore.appStore = appStore;
    await categoryStore.fetchAll({}, categoryStore.appStore);
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  handleScroll = async () => {
    const { categoryStore, appStore } = this.props;
    const { categories, initLoadNumber } = categoryStore;
    const len = categories.length;
    const loadDataHeight = 240 + 24;

    if (len <= initLoadNumber || categories[len - 1].apps) {
      return;
    }

    let scrollTop = getScrollTop();
    let loadNumber = parseInt(scrollTop / loadDataHeight);
    for (let i = initLoadNumber; i < len && i < initLoadNumber + loadNumber * 3; i++) {
      if (!categories[i].appFlag) {
        categoryStore.categories[i].appFlag = true;
        await appStore.fetchAll({
          status: 'active',
          category_id: categories[i].category_id
        });
        let temp = categoryStore.categories[i];
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
        <Link to={`/dashboard/category/${category.category_id}`}>{t('View detail')}</Link>
        <span onClick={showModifyCategory.bind(categoryStore, category)}>
          {t('Modify Category')}
        </span>
        <span onClick={showDeleteCategory.bind(categoryStore, category)}>{t('Delete')}</span>
      </div>
    );
  };

  renderOpsModal = () => {
    const { categoryStore, t } = this.props;
    const { isModalOpen, hideModal, category, createOrModify } = categoryStore;
    let modalTitle = t('Create Category');
    if (category && category.category_id) {
      modalTitle = t('Modify Category');
    }
    return (
      <Modal title={modalTitle} visible={isModalOpen} onCancel={hideModal} onOk={createOrModify}>
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

  render() {
    const { categoryStore, t } = this.props;
    const { isLoading, searchWord, showCreateCategory } = categoryStore;

    const categories = categoryStore.categories;
    const defaultCategories = categories.filter(cate => cate.category_id !== 'ctg-uncategorized');
    const uncategorized = categories.find(cate => cate.category_id === 'ctg-uncategorized') || {};

    return (
      <Layout isLoading={isLoading}>
        <NavLink>
          {t('Store')} / {t('Categories')}
        </NavLink>

        <Toolbar
          placeholder={t('Search Categories')}
          searchWord={searchWord}
          onSearch={categoryStore.onSearch}
          onClear={categoryStore.onClearSearch}
          onRefresh={categoryStore.onRefresh}
          withCreateBtn={{ name: t('Create'), onClick: showCreateCategory }}
        />

        <div className={styles.categories}>
          <div className={styles.line}>
            <div className={styles.word}>
              {t('Default')} ({defaultCategories.length})
            </div>
          </div>
        </div>

        <div>
          {defaultCategories.map((data, index) => (
            <div key={data.category_id} className={styles.categoryContent}>
              <CategoryCard
                id={data.category_id}
                title={data.name}
                idNo={data.idNo}
                description={data.description}
                apps={data.apps}
                total={data.total}
              />
              <div className={styles.handlePop}>
                <Popover content={this.renderHandleMenu(data)}>
                  <Icon name="more" />
                </Popover>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.categories}>
          <div className={styles.line}>
            <div className={styles.word}>{t('Uncategories')}</div>
          </div>
        </div>

        {uncategorized.category_id && (
          <div className={classnames(styles.categoryContent, styles.unCategorized)}>
            <div className={styles.rectangle}>
              <div className={styles.title} title={uncategorized.name}>
                <Link to={`/dashboard/category/${uncategorized.category_id}`}>
                  {t(uncategorized.name)}
                </Link>
              </div>
              <AppImages apps={uncategorized.apps} total={uncategorized.total} />
            </div>
          </div>
        )}
        {this.renderOpsModal()}
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
