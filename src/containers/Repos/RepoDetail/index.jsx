import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import DetailCard from 'components/DetailCard';
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
  repoStore: rootStore.repoStore
}))
@observer
export default class RepoDetail extends Component {
  static async onEnter({ repoStore }, { repoId }) {
    //await repoStore.fetchRepoDetail(repoId);
    await repoStore.fetchRepoApps(repoId);
    //await repoStore.fetchRepoRunTimes(repoId);
    //await repoStore.fetchRepoTasks(v);
  }
  constructor(props) {
    super(props);
    this.changeCurTag = this.changeCurTag.bind(this);
    this.state = { curTag: 'Apps' };
    this.appsData = (this.props.repoStore.apps && toJS(this.props.repoStore.apps.app_set)) || [];
  }
  changeCurTag = name => {
    this.setState({
      curTag: name
    });
  };

  render() {
    const appsData = this.appsData;
    const columns = [
      {
        title: 'App Name',
        dataIndex: 'name',
        key: 'name',
        width: '130px',
        render: (name, obj) => <TdName name={name} description={obj.description} />
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
        width: '100px',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Categories',
        dataIndex: 'categories',
        key: 'categories'
      },
      {
        title: 'Visibility',
        dataIndex: 'visibility',
        key: 'visibility'
      },
      {
        title: 'Repo',
        dataIndex: 'repo_id',
        key: 'repo_id'
      },
      {
        title: 'Developer',
        dataIndex: 'developer',
        key: 'developer'
      },
      {
        title: 'Updated At',
        dataIndex: 'update_time',
        key: 'update_time',
        render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Apps' }, { id: 2, name: 'Runtimes' }, { id: 3, name: 'Tasks' }];
    const curTag = this.state.curTag;

    const data = curTag === 'Apps' ? appsData : [];

    return (
      <div className={styles.repoDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/repos">← Back to Repos</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <DetailCard />
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} changeCurTag={this.changeCurTag} />
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
