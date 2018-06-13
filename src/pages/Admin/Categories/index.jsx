import React, { Component, Fragment } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Rectangle from 'components/Rectangle';
import Modal from 'components/Base/Modal';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';
import Popover from 'components/Base/Popover';
import Icon from 'components/Base/Icon';
import Layout, { Dialog } from 'pages/Layout/Admin';
import { getParseDate } from 'utils';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categoryStore }) {
    await categoryStore.fetchAll();
  }

  renderHandleMenu = category => {
    const { categoryStore } = this.props;
    const { showDeleteCategory, showModifyCategory } = categoryStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/category/${category.category_id}`}>View Category detail</Link>
        <span onClick={showModifyCategory.bind(categoryStore, category)}>Modify Category</span>
        <span onClick={showDeleteCategory.bind(categoryStore, category.category_id)}>
          Delete Category
        </span>
      </div>
    );
  };

  renderOpsModal = () => {
    const { categoryStore } = this.props;
    const { isModalOpen, hideModal, handleCate } = categoryStore;
    let modalTitle = '',
      modalBody = null,
      onSubmit = () => {};

    if (handleCate.action === 'delete_cate') {
      modalTitle = 'Delete Category';
      onSubmit = categoryStore.remove.bind(categoryStore);
      modalBody = <div className={styles.noteWord}>Are you sure delete this Category?</div>;
    }

    if (handleCate.action === 'modify_cate' || handleCate.action === 'create_cate') {
      const { categoryDetail, changeName, changeLocale } = categoryStore;
      modalTitle = categoryDetail.category_id ? 'Modify Category' : 'Create Category';
      // onSubmit=appStore.modifyCategoryById.bind(appStore);

      modalBody = (
        <Fragment>
          <div className={styles.inputItem}>
            <label className={styles.name}>Name</label>
            <Input
              className={styles.input}
              name="name"
              required
              onChange={changeName}
              defaultValue={categoryDetail.name}
            />
          </div>
          <div className={styles.inputItem}>
            <label className={styles.name}>locale</label>
            <Input
              className={styles.input}
              name="locale"
              required
              onChange={changeLocale}
              defaultValue={categoryDetail.locale}
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

  render() {
    const { categoryStore } = this.props;
    const categories = toJS(categoryStore.categories);
    const { showCreateCategory } = categoryStore;

    return (
      <Layout>
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
          {categories.map(data => (
            <div key={data.category_id} className={styles.categoryContent}>
              <Rectangle
                id={data.category_id}
                title={data.name}
                idNo={data.idNo}
                description={data.description}
                images={data.images}
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
