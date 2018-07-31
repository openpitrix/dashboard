import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { Input, Button, Popover, Icon, Modal } from 'components/Base';
import Rectangle from 'components/Rectangle';
import AppImages from 'components/Rectangle/AppImages';
import Layout, { Dialog } from 'components/Layout';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categoryStore, appStore }) {
    categoryStore.isDetailPage = false;
    await categoryStore.fetchAll();
    await appStore.fetchApps();
  }

  constructor(props) {
    super(props);
    this.props.categoryStore.reset();
  }

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
          <div className="inputItem">
            <label>Name</label>
            <Input
              name="name"
              autoFocus
              defaultValue={category.name}
              onChange={categoryStore.changeName}
              maxLength="50"
            />
          </div>
          <div className={styles.inputItem}>
            <label className={classnames(styles.name, styles.textareaName)}>Description</label>
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
    const { appStore, categoryStore } = this.props;
    const { isLoading, showCreateCategory, getCategoryApps } = categoryStore;

    const categories = categoryStore.categories.toJSON();
    const apps = appStore.apps.toJSON();
    const categoryApps = getCategoryApps(categories, apps);
    const defaultCategories = categoryApps.filter(cate => cate.category_id !== 'ctg-uncategorized');
    const uncategorized = categoryApps.find(cate => cate.category_id === 'ctg-uncategorized') || {};

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
              <div className={styles.word}>Default ({categories.length})</div>
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
              <AppImages apps={uncategorized.apps} />
            </div>
          </div>
        </div>
        {this.renderOpsModal()}
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
