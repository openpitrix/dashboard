import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import ManageTabs from 'components/ManageTabs';
import CategoryCard from 'components/DetailCard/CategoryCard';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import TdName from 'components/TdName';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore
}))
@observer
export default class CategoryDetail extends Component {
  static async onEnter({ categoryStore, appStore }, { categoryId }) {
    await categoryStore.fetchCategoryDetail(categoryId);
    await appStore.fetchAll({ page: 1 });
  }

  onSearch = async name => {
    await this.props.appStore.fetchQueryApps(name);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  render() {
    const { categoryStore, appStore } = this.props;
    const detail = categoryStore.category;
    const data = toJS(appStore.apps);
    const fetchAll = async current => {
      await appStore.fetchAll({ page: current });
    };
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
      <div className={styles.categoryDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/categories">← Back to Categories</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <CategoryCard detail={detail} />
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
              <Pagination onChange={fetchAll} total={appStore.totalCount} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
