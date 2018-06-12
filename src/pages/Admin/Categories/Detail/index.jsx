import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { getParseDate } from 'utils';

import CategoryCard from 'components/DetailCard/CategoryCard';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import Popover from 'components/Base/Popover';
import Modal from 'components/Base/Modal';
import TdName from 'components/TdName';
import Layout, { BackBtn } from 'pages/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore,
  categoryHandleStore: rootStore.categoryHandleStore,
  appStore: rootStore.appStore
}))
@observer
export default class CategoryDetail extends Component {
  static async onEnter({ categoryStore, appStore }, { categoryId }) {
    await categoryStore.fetchCategoryDetail(categoryId);
    await appStore.fetchQueryApps({ category_id: categoryId });
  }

  onSearch = async name => {
    const { categoryStore, appStore } = this.props;
    await appStore.fetchQueryApps({
      category_id: categoryStore.category.category_id,
      search_word: name
    });
  };

  onRefresh = async () => {
    const { categoryStore, appStore } = this.props;
    await appStore.fetchQueryApps({ category_id: categoryStore.category.category_id });
  };

  changeApps = async current => {
    const { categoryStore, appStore } = this.props;
    await appStore.fetchQueryApps({
      category_id: categoryStore.category.category_id,
      offset: (current - 1) * appStore.pageSize
    });
  };

  renderHandleMenu = category => {
    const { modifyCategoryShow } = this.props.categoryHandleStore;
    return (
      <div className="operate-menu">
        <span
          onClick={() => {
            modifyCategoryShow(category);
          }}
        >
          Modify Category
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

    return (
      <Modal
        width={500}
        title="Modify Category"
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
                categorySubmit(this.props.categoryStore, categoryDetail.category_id, 'detail');
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    const { categoryStore, appStore } = this.props;
    const detail = categoryStore.category;
    const data = toJS(appStore.apps);
    const appCount = appStore.totalCount;
    const columns = [
      {
        title: 'App Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => <TdName name={name} description={obj.description} image={obj.icon} />
      },
      {
        title: 'Latest Version',
        dataIndex: 'latest_version',
        key: 'latest_version'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Developer',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Visibility',
        dataIndex: 'visibility',
        key: 'visibility'
      }
    ];
    const tags = [{ id: 1, name: 'Apps', link: '#' }];
    const curTag = 'Apps';

    return (
      <Layout>
        <BackBtn label="categories" link="/dashboard/categories" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <CategoryCard detail={detail} appCount={appCount} />
              <Popover className={styles.operation} content={this.renderHandleMenu(detail)}>
                <Icon name="more" />
              </Popover>
            </div>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search & Filter"
                  onSearch={this.onSearch}
                />
                <Button className={styles.buttonRight} onClick={this.onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table columns={columns} dataSource={data} />
            </div>
            {appStore.totalCount > 0 && (
              <Pagination onChange={this.changeApps} total={appStore.totalCount} />
            )}
          </div>
        </div>
        {this.renderCategoryModal()}
      </Layout>
    );
  }
}
