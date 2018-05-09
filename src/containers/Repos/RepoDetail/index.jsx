import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
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
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RepoDetail extends Component {
  static async onEnter({ repoStore, appStore, runtimeStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
    await appStore.fetchAll();
    await runtimeStore.fetchRuntimes();
  }
  constructor(props) {
    super(props);
    this.changeCurTag = this.changeCurTag.bind(this);
    this.state = { curTag: 'Apps' };
    this.repoDetail = toJS(this.props.repoStore.repoDetail) || {};
    this.appsData = toJS(this.props.appStore.apps) || [];
    this.runtimesData = toJS(this.props.runtimeStore.runtimes) || [];
  }
  changeCurTag = name => {
    this.setState({
      curTag: name
    });
  };

  render() {
    const repoDetail = this.repoDetail;
    const appsData = this.appsData;
    const runtimesData = this.runtimesData;
    const appsColumns = [
      {
        title: 'App Name',
        dataIndex: 'name',
        key: 'name',
        width: '150px',
        render: (name, obj) => <TdName name={name} description={obj.description} image={obj.icon} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '130px',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Categories',
        dataIndex: 'categories',
        key: 'categories'
      },
      {
        title: 'Developer',
        dataIndex: 'developer',
        key: 'developer'
      },
      {
        title: 'Visibility',
        dataIndex: 'visibility',
        key: 'visibility'
      },
      {
        title: 'Updated At',
        dataIndex: 'update_time',
        key: 'update_time',
        render: getParseDate
      }
    ];
    const runtimesColumns = [
      {
        title: 'Runtime Name',
        dataIndex: 'name',
        key: 'name',
        width: '130px',
        render: (name, obj) => <TdName name={name} description={obj.description} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '130px',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider'
      },
      {
        title: 'Zone',
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        dataIndex: 'update_time',
        key: 'update_time',
        render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Apps' }, { id: 2, name: 'Runtimes' }, { id: 3, name: 'Events' }];
    const curTag = this.state.curTag;

    let data = [];
    let columns = [];
    let searchTip = 'Search App Name';
    switch (curTag) {
      case 'Apps':
        data = appsData;
        columns = appsColumns;
        break;
      case 'Runtimes':
        data = runtimesData;
        columns = runtimesColumns;
        searchTip = 'Search Runtime Name';
        break;
    }

    return (
      <div className={styles.repoDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/repos">← Back to Repos</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <RuntimeCard detail={repoDetail} />
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} changeCurTag={this.changeCurTag} />
              <div className={styles.toolbar}>
                <Input.Search className={styles.search} placeholder={searchTip} />
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
