import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Statistics from 'components/Statistics';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import Popover from 'components/Base/Popover';
import TdName from 'components/TdName';
import Modal from 'components/Base/Modal';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore
}))
@observer
export default class Apps extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchAll({ page: 1 });
    await appStore.fetchStatistics();
  }

  constructor(props) {
    super(props);
    this.state = {
      appId: '',
      showDeleteModal: false
    };
  }

  onSearch = async name => {
    await this.props.appStore.fetchQueryApps(name);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  deleteApp = async () => {
    await this.props.appStore.fetchDeleteApp(this.state.appId);
    this.deleteAppClose();
    await this.onRefresh();
  };

  deleteAppShow = id => {
    this.setState({
      appId: id,
      showDeleteModal: true
    });
  };
  deleteAppClose = () => {
    this.setState({
      showDeleteModal: false
    });
  };

  renderDeleteModal = () => (
    <Modal
      width={500}
      title="Delete APP"
      visible={this.state.showDeleteModal}
      hideFooter
      onCancel={this.deleteAppClose}
    >
      <div className={styles.modalContent}>
        <div className={styles.noteWord}>Are you sure delete this App?</div>
        <div className={styles.operation}>
          <Button type="default" onClick={this.deleteAppClose}>
            Cancel
          </Button>
          <Button type="primary" onClick={this.deleteApp}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );

  renderHandleMenu = id => (
    <div id={id} className="operate-menu">
      <Link to={`/manage/apps/${id}`}>View app detail</Link>
      <span
        onClick={() => {
          this.deleteAppShow(id);
        }}
      >
        Delete app
      </span>
    </div>
  );

  render() {
    const { appStore } = this.props;
    const appsData = toJS(appStore.apps);
    const {
      image,
      name,
      total,
      centerName,
      progressTotal,
      progress,
      lastedTotal,
      histograms
    } = toJS(appStore.statistics);
    const fetchAll = async current => {
      await appStore.fetchAll({ page: current });
    };
    const columns = [
      {
        title: 'App Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, obj) => <TdName name={text} description={obj.description} image={obj.icon} />
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
        title: 'Categories',
        dataIndex: 'category',
        key: 'category'
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
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item.app_id)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    return (
      <div className={styles.apps}>
        <ManageTabs />
        <Statistics
          image={image}
          name={name}
          total={total}
          centerName={centerName}
          progressTotal={progressTotal}
          progress={progress}
          lastedTotal={lastedTotal}
          histograms={histograms}
        />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.toolbar}>
              <Input.Search
                className={styles.search}
                placeholder="Search App Name or Keywords"
                onSearch={this.onSearch}
              />
              <Link to={'/manage/addapp'}>
                <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                  Create
                </Button>
              </Link>
              <Button className={styles.buttonRight} onClick={this.onRefresh}>
                <Icon name="refresh" />
              </Button>
            </div>

            <Table className={styles.tableOuter} columns={columns} dataSource={appsData} />
          </div>
          {appStore.totalCount > 0 && (
            <Pagination onChange={fetchAll} total={appStore.totalCount} />
          )}
        </div>
        {this.renderDeleteModal()}
      </div>
    );
  }
}
