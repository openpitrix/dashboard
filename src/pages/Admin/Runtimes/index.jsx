import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import Statistics from 'components/Statistics';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import Popover from 'components/Base/Popover';
import TdName from 'components/TdName';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import Layout from 'components/Layout/Admin';
import Modal from 'components/Base/Modal';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class Runtimes extends Component {
  static async onEnter({ runtimeStore }) {
    await runtimeStore.fetchAll();
  }

  renderHandleMenu = (id, status) => {
    const { runtimeStore } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/runtime/${id}`}>View runtime detail</Link>
        {status !== 'deleted' && (
          <Fragment>
            <Link to={`/dashboard/runtime/edit/${id}`}>Modify runtime</Link>
            <span onClick={showDeleteRuntime.bind(runtimeStore, id)}>Delete runtime</span>
          </Fragment>
        )}
      </div>
    );
  };

  deleteRuntimeModal = () => {
    const { isModalOpen, hideModal, remove } = this.props.runtimeStore;

    return (
      <Modal
        width={500}
        title="Delete Runtime"
        visible={showDeleteRuntime}
        hideFooter
        onCancel={hideModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Runtime?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={hideModal}>
              Cancel
            </Button>
            {status !== 'deleted' && (
              <Button
                type="primary"
                onClick={() => {
                  remove(this.props.runtimeStore);
                }}
              >
                Confirm
              </Button>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    const { runtimeStore } = this.props;
    const data = toJS(runtimeStore.runtimes);
    const { isLoading } = runtimeStore;
    const {
      image,
      name,
      total,
      centerName,
      progressTotal,
      progress,
      lastedTotal,
      histograms
    } = toJS(runtimeStore.statistics);

    const columns = [
      {
        title: 'Runtime Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => (
          <TdName
            name={name}
            description={obj.description}
            linkUrl={`/dashboard/runtime/${obj.runtime_id}`}
          />
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider'
      },
      {
        title: 'Zone/Namspace',
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: 'Cluster Count',
        dataIndex: 'node_count',
        key: 'node_count'
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        dataIndex: 'status_time',
        key: 'status_time',
        width: '10%',
        render: getParseDate
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '80px',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item.runtime_id, item.status)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    return (
      <Layout isLoading={isLoading}>
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
                placeholder="Search Runtimes Name"
                onSearch={runtimeStore.fetchAll}
              />
              <Link to={`/dashboard/runtime/create`}>
                <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                  Create
                </Button>
              </Link>
              <Button className={styles.buttonRight} onClick={runtimeStore.fetchAll}>
                <Icon name="refresh" />
              </Button>
            </div>

            <Table className={styles.tableOuter} columns={columns} dataSource={data} />
          </div>
          {runtimeStore.totalCount > 0 && (
            <Pagination onChange={runtimeStore.fetchAll} total={runtimeStore.totalCount} />
          )}
        </div>
        {this.deleteRuntimeModal()}
      </Layout>
    );
  }
}
