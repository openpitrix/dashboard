import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Table, Popover, Radio, Button, Input, Select, Icon } from 'components/Base';
import Layout, { CreateResource, Dialog, Panel, Grid, Row, Section, Card } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import Status from 'components/Status';
import TdName from 'components/TdName';
import Configuration from 'pages/Admin/Clusters/Detail/Configuration';
import { getObjName, formatTime } from 'utils';
import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  clusterStore: rootStore.clusterStore
}))
@observer
export default class SSHKeys extends Component {
  static async onEnter({ clusterStore }) {
    await clusterStore.fetchKeyPairs();
    await clusterStore.fetchAll({
      limit: 200,
      active: ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted']
    });
  }

  constructor(props) {
    super(props);
    const { clusterStore } = this.props;
    clusterStore.currentPairId = '';
    clusterStore.loadNodeInit();
  }

  onClickPair = item => {
    const { clusterStore } = this.props;
    clusterStore.currentPairId = item.key_pair_id;
    clusterStore.fetchNodes({ node_id: item.node_id });
  };

  showDeleteModal = (e, pairId) => {
    e.stopPropagation();
    const { clusterStore } = this.props;
    clusterStore.pairId = pairId;
    clusterStore.showModal('delPair');
  };

  renderOperateMenu = pairId => {
    const { t } = this.props;
    return (
      <div className="operate-menu">
        <span onClick={e => this.showDeleteModal(e, pairId)}>{t('Delete SSH Key')}</span>
      </div>
    );
  };

  renderDeleteModal = () => {
    const { clusterStore, t } = this.props;
    const { isModalOpen, removeKeyPairs, hideModal } = clusterStore;

    return (
      <Dialog
        title={t('Delete SSH Key')}
        visible={isModalOpen}
        onSubmit={removeKeyPairs}
        onCancel={hideModal}
      >
        Are you sure delete this SSH Key?
      </Dialog>
    );
  };

  renderForm() {
    const { t } = this.props;

    return (
      <form className={styles.createForm}>
        <div>
          <label className={styles.name}>{t('Name')}</label>
          <Input className={styles.input} name="name" maxLength="50" required />
          <p className={classNames(styles.rightShow, styles.note)}>
            {t('The name of the SSH key')}
          </p>
        </div>
        <div>
          <label className={styles.name}>{t('Model')}</label>
          <Radio.Group className={styles.radioGroup}>
            <Radio value="1">Create a new keypair</Radio>
            <Radio value="2">Use the existing public key</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={classNames(styles.name, styles.selectName)}>
            {t('Encrypt Method')}
          </label>
          <Select className={styles.select}>
            <Select.Option key="test" value="test">
              test
            </Select.Option>
          </Select>
        </div>
        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} htmlType="submit">
            {t('Confirm')}
          </Button>
          <Link to="/profile">
            <Button>{t('Cancel')}</Button>
          </Link>
        </div>
      </form>
    );
  }

  renderAside() {
    return (
      <p>
        SSH keys allow you to establish a secure connection between your computer and Cluster Nodes.
      </p>
    );
  }

  renderCard(pair) {
    const { t } = this.props;

    return (
      <div className={styles.sshCard}>
        <div className={styles.title}>{pair.name}</div>
        <div className={styles.item}>{pair.pub_key}</div>
        <div className={styles.item}>
          Created on: {formatTime(pair.create_time, 'YYYY/MM/DD HH:mm:ss')}
        </div>
      </div>
    );
  }

  renderDetail() {
    const { clusterStore, t } = this.props;

    const {
      isLoading,
      searchNode,
      onSearchNode,
      onClearNode,
      onRefreshNode,
      onChangeNodeStatus,
      selectNodeStatus,
      totalNodeCount,
      clusters,
      keyPairs,
      currentPairId
    } = clusterStore;

    const clusterNodes = clusterStore.clusterNodes.toJSON();
    const columns = [
      {
        title: t('Name'),
        key: 'name',
        width: '155px',
        render: item => <TdName name={item.name} description={item.node_id} noIcon />
      },
      {
        title: t('Cluster Name'),
        key: 'cluster_id',
        render: item => (
          <TdName
            name={getObjName(clusters, 'cluster_id', item.cluster_id, 'name')}
            description={item.cluster_id}
            linkUrl={`/dashboard/cluster/${item.cluster_id}`}
            noIcon
          />
        )
      },
      {
        title: t('Status'),
        key: 'status',
        width: '102px',
        // fixme: prop type check case sensitive
        render: item => <Status type={(item.status + '').toLowerCase()} name={item.status} />
      },
      {
        title: t('Role'),
        key: 'role',
        dataIndex: 'role'
      },
      {
        title: t('Private IP'),
        key: 'private_ip',
        dataIndex: 'private_ip',
        width: '100px'
      },
      {
        title: t('Configuration'),
        key: 'configuration',
        width: '100px',
        render: item => <Configuration configuration={item.cluster_role || {}} />
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        render: item => (
          <div className={styles.actions}>
            <Popover className="actions">
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];
    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Pending'), value: 'pending' },
          { name: t('Active'), value: 'active' },
          { name: t('Stopped'), value: 'stopped' },
          { name: t('Suspended'), value: 'suspended' },
          { name: t('Deleted'), value: 'deleted' },
          { name: t('Ceased'), value: 'ceased' }
        ],
        onChangeFilter: onChangeNodeStatus,
        selectValue: selectNodeStatus
      }
    ];
    const pagination = {
      tableType: 'Clusters',
      onChange: () => {},
      total: totalNodeCount,
      current: 1
    };

    return (
      <Fragment>
        <div className={styles.sshTitle}>SSH Keys ({keyPairs.length})</div>
        <Grid>
          <Section size={3}>
            {keyPairs.map(pair => (
              <Card
                key={pair.key_pair_id}
                onClick={() => this.onClickPair(pair)}
                className={classNames(styles.sshCardOuter, {
                  [styles.active]: pair.key_pair_id === currentPairId
                })}
              >
                {this.renderCard(pair)}
                <Popover className="operation" content={this.renderOperateMenu(pair.key_pair_id)}>
                  <Icon name="more" />
                </Popover>
              </Card>
            ))}
            <Button className={styles.addButton} type="primary">
              Add
            </Button>
          </Section>

          <Section size={9}>
            <Panel>
              <Card>
                <Toolbar
                  placeholder={t('Search Node')}
                  searchWord={searchNode}
                  onSearch={onSearchNode}
                  onClear={onClearNode}
                  onRefresh={onRefreshNode}
                />
                <Table
                  columns={columns}
                  dataSource={clusterNodes}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
            </Panel>
          </Section>
        </Grid>
      </Fragment>
    );
  }

  render() {
    const { keyPairs } = this.props.clusterStore;

    return (
      <Layout isProfile>
        {keyPairs.length > 0 ? (
          this.renderDetail()
        ) : (
          <CreateResource title="Create SSH Key" aside={this.renderAside()} asideTitle="SSH Keys">
            {this.renderForm()}
          </CreateResource>
        )}
        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
