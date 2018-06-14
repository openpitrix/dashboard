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
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categoryStore }) {
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
      const { category, changeName, changeLocale } = categoryStore;
      let { name, locale } = categoryStore;
      modalTitle = 'Create Category';

      if (category && category.category_id) {
        modalTitle = 'Modify Category';
        name = category.name;
        // locale=category.locale;
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
              onChange={changeName}
              defaultValue={name}
            />
          </div>
          {/*<div className={styles.inputItem}>*/}
          {/*<label className={styles.name}>locale</label>*/}
          {/*<Input*/}
          {/*className={styles.input}*/}
          {/*name="locale"*/}
          {/*required*/}
          {/*onChange={changeLocale}*/}
          {/*defaultValue={locale}*/}
          {/*/>*/}
          {/*</div>*/}
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
    const { categoryStore } = this.props;
    const { notifyMsg, hideMsg, showCreateCategory } = categoryStore;
    const categories = toJS(categoryStore.categories);

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
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
