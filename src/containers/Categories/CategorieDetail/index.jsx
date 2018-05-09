import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import DetailCard from 'components/DetailCard';
import VersionList from 'components/VersionList';
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
  appStore: rootStore.appStore
}))
@observer
export default class CategorieDetail extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchClusters();
  }

  render() {
    const { appStore } = this.props;
    const data = (appStore.apps && toJS(appStore.apps.app_set)) || [];
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
      <div className={styles.appDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/categories">← Back to Categories</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <DetailCard />
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search className={styles.search} placeholder="Search App Name" />
                <Button className={styles.buttonRight}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table columns={columns} dataSource={data} />
            </div>
            <Pagination />
          </div>
        </div>
      </div>
    );
  }
}
