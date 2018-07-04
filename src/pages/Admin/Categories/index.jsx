import React, { Component, Fragment } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { Input, Button, Popover, Icon } from 'components/Base';
import Rectangle from 'components/Rectangle';
import Layout, { Dialog } from 'components/Layout/Admin';
// import { getParseDate } from 'utils';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categoryStore, appStore }) {
    await appStore.fetchApps();
    await categoryStore.fetchAll();
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

  handleDeleteCate = e => {
    this.props.categoryStore.remove();
  };

  renderOpsModal = () => {
    const { categoryStore } = this.props;
    const { isModalOpen, hideModal, handleCate } = categoryStore;
    let modalTitle = '',
      modalBody = null,
      onSubmit = () => {};

    if (handleCate.action === 'delete_cate') {
      modalTitle = 'Delete Category';
      onSubmit = this.handleDeleteCate.bind(this);
      modalBody = <div className={styles.noteWord}>Are you sure delete this Category?</div>;
    }

    if (handleCate.action === 'modify_cate' || handleCate.action === 'create_cate') {
      const { category, changeName, changeDescription } = categoryStore;
      modalTitle = 'Create Category';

      if (category && category.category_id) {
        modalTitle = 'Modify Category';
      }
      onSubmit = categoryStore.createOrModify.bind(categoryStore, 'from_index');

      modalBody = (
        <Fragment>
          <div className={styles.inputItem}>
            <label className={styles.name}>Name</label>
            <Input
              className={styles.input}
              name="name"
              required
              autoFocus
              defaultValue={category.name}
              onChange={changeName}
            />
          </div>
          <div className={styles.inputItem}>
            <label className={classNames(styles.name, styles.textareaName)}>Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              defaultValue={category.description}
              onChange={changeDescription}
            />
          </div>
        </Fragment>
      );
    }

    return (
      <Dialog title={modalTitle} isOpen={isModalOpen} onCancel={hideModal} onSubmit={onSubmit}>
        {modalBody}
      </Dialog>
    );
  };

  // handleClickItem=(category_id, ev)=> {
  //   this.props.history.push(`/dashboard/category/${category_id}`);
  // }

  render() {
    const { appStore, categoryStore } = this.props;
    const { notifyMsg, hideMsg, showCreateCategory, isLoading, getCategoryApps } = categoryStore;
    const categories = toJS(categoryStore.categories);
    const apps = toJS(appStore.apps);
    const categoryApps = getCategoryApps(categories, apps);

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg} isLoading={isLoading}>
        <div className={styles.container}>
          <div className={styles.pageTitle}>
            Categories
            <Button
              className={classNames(styles.buttonRight)}
              type="primary"
              onClick={showCreateCategory}
            >
              Create
            </Button>
          </div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Default ({categories.length})</div>
            </div>
          </div>

          {categoryApps.map(data => (
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
        </div>
        {this.renderOpsModal()}
      </Layout>
    );
  }
}
