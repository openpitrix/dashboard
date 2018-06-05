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

  renderHandleMenu = id => {
    const { deleteCategoryShow } = this.props.categoryHandleStore;

    return (
      <div id={id} className="operate-menu">
        <Link to={`/manage/categories/${id}`}>View Category detail</Link>
        <span
          onClick={() => {
            deleteCategoryShow(id);
          }}
        >
          Delete Category
        </span>
      </div>
    );
  };

  renderCategoryModal = () => {
    const {
      showCategoryModal,
      createCategoryClose,
      changeName,
      changeLocale,
      categorySubmit
    } = this.props.categoryHandleStore;

    return (
      <Modal
        width={500}
        title="Create Category"
        visible={showCategoryModal}
        hideFooter
        onCancel={createCategoryClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.inputItem}>
            <label className={styles.name}>Name</label>
            <Input className={styles.input} name="name" required onChange={changeName} />
          </div>
          <div className={styles.inputItem}>
            <label className={styles.name}>locale</label>
            <Input className={styles.input} name="locale" required onChange={changeLocale} />
          </div>
          <div className={styles.operation}>
            <Button type="default" onClick={createCategoryClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                categorySubmit(this.props.categoryStore);
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
                <Popover content={this.renderHandleMenu(data.category_id)}>
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
