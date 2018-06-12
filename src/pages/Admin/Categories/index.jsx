import React, { Component } from 'react';
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
import Layout from 'pages/Layout/Admin';
import { getParseDate } from 'utils';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore,
  categoryHandleStore: rootStore.categoryHandleStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categoryStore }) {
    await categoryStore.fetchCategories();
  }

  renderHandleMenu = category => {
    const { deleteCategoryShow, modifyCategoryShow } = this.props.categoryHandleStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/categories/${category.category_id}`}>View Category detail</Link>
        <span
          onClick={() => {
            modifyCategoryShow(category);
          }}
        >
          Modify Category
        </span>
        <span
          onClick={() => {
            deleteCategoryShow(category.category_id);
          }}
        >
          Delete Category
        </span>
      </div>
    );
  };

  renderCategoryModal = () => {
    const {
      categoryDetail,
      showCategoryModal,
      createCategoryClose,
      changeName,
      changeLocale,
      categorySubmit
    } = this.props.categoryHandleStore;
    let title = 'Create Category';
    if (categoryDetail.category_id) title = 'Modify Category';

    return (
      <Modal
        width={500}
        title={title}
        visible={showCategoryModal}
        hideFooter
        onCancel={createCategoryClose}
      >
        <div className={styles.modalContent}>
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
          <div className={styles.operation}>
            <Button type="default" onClick={createCategoryClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                categorySubmit(this.props.categoryStore, categoryDetail.category_id);
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  renderDeleteModal = () => {
    const { showDeleteModal, deleteCategoryClose, deleteCategory } = this.props.categoryHandleStore;

    return (
      <Modal
        width={500}
        title="Delete Category"
        visible={showDeleteModal}
        hideFooter
        onCancel={deleteCategoryClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Category?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={deleteCategoryClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                deleteCategory(this.props.categoryStore);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    const { categoryStore } = this.props;
    const categories = toJS(categoryStore.categories);
    const { createCategoryShow } = this.props.categoryHandleStore;

    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.pageTitle}>
            Categories
            <Button
              className={classNames(styles.buttonRight)}
              type="primary"
              onClick={createCategoryShow}
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
        {this.renderCategoryModal()}
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
