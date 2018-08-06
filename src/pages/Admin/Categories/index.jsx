import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { throttle } from 'lodash';

import { Input, Button, Popover, Icon, Modal } from 'components/Base';
import Rectangle from 'components/Rectangle';
import AppImages from 'components/Rectangle/AppImages';
import Layout, { Dialog } from 'components/Layout';
import { getScrollTop } from 'utils';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categoryStore, appStore }) {
    categoryStore.appStore = appStore;
    categoryStore.isDetailPage = false;
    await categoryStore.fetchAll(categoryStore.appStore);
    //wait appStore.fetchApps();
  }

  constructor(props) {
    super(props);
    this.props.categoryStore.reset();
  }

  componentDidMount() {
    window.scroll({ top: 0, behavior: 'auto' });
    window.onscroll = throttle(this.handleScroll, 200);
  }

  handleScroll = async () => {
    const { categoryStore, appStore } = this.props;
    const { categories, initLoadNumber } = categoryStore;
    const len = categories.length;
    const loadDataHeight = 240 + 24;

    if (len <= initLoadNumber || categories[len - 1].apps) {
      return;
    } else {
      let scrollTop = getScrollTop();
      let loadNumber = parseInt(scrollTop / loadDataHeight);
      for (let i = initLoadNumber; i < len && i < initLoadNumber + loadNumber * 3; i++) {
        if (!categories[i].appFlag) {
          categoryStore.categories[i].appFlag = true;
          await appStore.fetchAll({ category_id: categories[i].category_id });
          let temp = categoryStore.categories[i];
          categoryStore.categories[i] = {
            total: appStore.totalCount,
            apps: appStore.apps,
            ...temp
          };
        }
      }
    }
  };

  renderHandleMenu = category => {
    const { categoryStore } = this.props;
    const { showDeleteCategory, showModifyCategory } = categoryStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/category/${category.category_id}`}>View Category detail</Link>
        <span onClick={showModifyCategory.bind(categoryStore, category)}>Modify Category</span>
        <span onClick={showDeleteCategory.bind(categoryStore, category)}>Delete Category</span>
      </div>
    );
  };

  renderOpsModal = () => {
    const { categoryStore } = this.props;
    const { isModalOpen, hideModal, category, createOrModify } = categoryStore;
    let modalTitle = 'Create Category';
    if (category && category.category_id) {
      modalTitle = 'Modify Category';
    }
    return (
      <Modal title={modalTitle} visible={isModalOpen} onCancel={hideModal} onOk={createOrModify}>
        <div className="formContent">
          <div>
            <label>Name</label>
            <Input
              name="name"
              autoFocus
              defaultValue={category.name}
              onChange={categoryStore.changeName}
              maxLength="50"
            />
          </div>
          <div className="textareaItem">
            <label>Description</label>
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
    const { isDeleteOpen, hideModal, remove } = this.props.categoryStore;

    return (
      <Dialog title="Delete Category" visible={isDeleteOpen} onSubmit={remove} onCancel={hideModal}>
        Are you sure delete this category?
      </Dialog>
    );
  };

  render() {
    const { categoryStore } = this.props;
    const { isLoading, showCreateCategory, getCategoryApps } = categoryStore;

    const categories = categoryStore.categories;
    const defaultCategories = categories.filter(cate => cate.category_id !== 'ctg-uncategorized');
    const uncategorized = categories.find(cate => cate.category_id === 'ctg-uncategorized') || {};

    return (
      <Layout isLoading={isLoading}>
        <div className={styles.container}>
          <div className={styles.pageTitle}>
            Categories
            <Button className="pull-right" type="primary" onClick={showCreateCategory}>
              Create
            </Button>
          </div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Default ({defaultCategories.length})</div>
            </div>
          </div>

          {defaultCategories.map(data => (
            <div key={data.category_id} className={styles.categoryContent}>
              <Rectangle
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

          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Uncategories</div>
            </div>
          </div>
          <div className={styles.categoryContent}>
            <div className={styles.rectangle}>
              <div className={styles.title} title={uncategorized.name}>
                <Link to={`/dashboard/category/${uncategorized.category_id}`}>
                  {uncategorized.name}
                </Link>
              </div>
              <AppImages apps={uncategorized.apps} total={uncategorized.total} />
            </div>
          </div>
        </div>
        {this.renderOpsModal()}
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
