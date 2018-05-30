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
import Select from 'components/Base/Select';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  appHandleStore: rootStore.appHandleStore
}))
@observer
export default class Apps extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchAll({ page: 1 });
    await appStore.fetchStatistics();
  }

  renderHandleMenu = item => {
    const { deleteAppShow, categoryModalShow } = this.props.appHandleStore;

    return (
      <div id={item.app_id} className="operate-menu">
        <Link to={`/manage/apps/${item.app_id}`}>View app detail</Link>
        {item.status !== 'deleted' && (
          <span
            onClick={() => {
              deleteAppShow(item.app_id);
            }}
          >
            Delete app
          </span>
        )}
        {item.status !== 'deleted' && (
          <span
            onClick={() => {
              categoryModalShow(item.app_id, item.app_category_set);
            }}
          >
            Modify category
          </span>
        )}
      </div>
    );
  };

  renderDeleteModal = () => {
    const { showDeleteModal, deleteAppClose, deleteApp } = this.props.appHandleStore;

    return (
      <Modal
        width={500}
        title="Delete APP"
        visible={showDeleteModal}
        hideFooter
        onCancel={deleteAppClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this App?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={deleteAppClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                deleteApp(this.props.appStore);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  renderCategoryModal = () => {
    const { appHandleStore } = this.props;
    const {
      showCategoryModal,
      categoryModalClose,
      selectValue,
      changeCategory,
      modifyCategory
    } = this.props.appHandleStore;
    const categories = toJS(appHandleStore.categories);

    return (
      <Modal
        width={500}
        title="Modify Category"
        visible={showCategoryModal}
        hideFooter
        onCancel={categoryModalClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.selectItem}>
            <label className={styles.name}>Category</label>
            <Select className={styles.select} value={selectValue} onChange={changeCategory}>
              {categories &&
                categories.map(data => (
                  <Select.Option key={data.category_id} value={data.category_id}>
                    {data.name}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className={styles.operation}>
            <Button type="default" onClick={categoryModalClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                modifyCategory(this.props.appStore);
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
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        dataIndex: 'status_time',
        key: 'status_time',
        render: getParseDate
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];
    const { fetchQueryApps } = appStore;
    const { onRefresh } = this.props.appHandleStore;

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
                onSearch={fetchQueryApps}
              />
              {/*<Link to={'/manage/addapp'}>*/}
              {/*<Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">*/}
              {/*Create*/}
              {/*</Button>*/}
              {/*</Link>*/}
              <Button
                className={styles.buttonRight}
                onClick={() => {
                  onRefresh(this.props.appStore);
                }}
              >
                <Icon name="refresh" />
              </Button>
            </div>

            <Table className={styles.tableOuter} columns={columns} dataSource={appsData} />
          </div>
          {appStore.totalCount > 0 && (
            <Pagination onChange={appStore.fetchAll} total={appStore.totalCount} />
          )}
        </div>
        {this.renderDeleteModal()}
        {this.renderCategoryModal()}
      </div>
    );
  }
}
