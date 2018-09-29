import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Table, Popover, Radio, Button, Input, Select, Icon, Modal } from 'components/Base';
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
      noLimit: true,
      active: ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted']
    });
  }

  constructor(props) {
    super(props);
    const { clusterStore } = this.props;
    clusterStore.currentPairId = '';
    clusterStore.loadNodeInit();
  }

  goBack = () => {
    history.back();
  };

  onClickPair = item => {
    const { clusterStore } = this.props;
    const { currentPairId, fetchNodes } = clusterStore;

    if (currentPairId !== item.key_pair_id) {
      clusterStore.currentPairId = item.key_pair_id;
      fetchNodes({ node_id: item.node_id });
    }
  };

  showDeleteModal = (e, pairId) => {
    e.stopPropagation();
    const { clusterStore } = this.props;
    clusterStore.pairId = pairId;
    clusterStore.showModal('deleteKey');
  };

  showCreateModal = () => {
    const { clusterStore } = this.props;
    clusterStore.keyPairReset();
    clusterStore.showModal('addKey');
  };

  renderOperateMenu = pairId => {
    const { t } = this.props;

    return (
      <div className="operate-menu">
        <span onClick={e => this.showDeleteModal(e, pairId)}>{t('Delete')}</span>
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
        {t('delete_key_desc')}
      </Dialog>
    );
  };

  renderAddModal = () => {
    const { clusterStore, t } = this.props;
    const { isModalOpen, hideModal } = clusterStore;

    return (
      <Modal title={t('Add SSH Key')} visible={isModalOpen} onCancel={hideModal} hideFooter>
        {this.renderForm(hideModal)}
      </Modal>
    );
  };

  renderDownloadModal = () => {
    const { clusterStore, t } = this.props;
    const { isModalOpen, hideModal } = clusterStore;

    return (
      <Dialog
        title={t('Download the private key of the SSH key ')}
        visible={isModalOpen}
        onCancel={hideModal}
        hideFooter
      >
        <p className={styles.downloadWord}>
          Click "Download" button to get the private key. Its download link will be kept for 10
          minutes.
        </p>
        <Button type="primary">{t('Download')}</Button>
      </Dialog>
    );
  };

  renderForm(cancelFun) {
    const { clusterStore, t } = this.props;
    const { addKeyPairs, changeName, changePubkey, changeDescription } = clusterStore;

    return (
      <form className={styles.createForm}>
        <div>
          <label className={styles.name}>{t('Name')}</label>
          <Input name="name" value={clusterStore.name} onChange={changeName} maxLength="50" />
        </div>
        <div className={styles.textareaItem}>
          <label className={styles.name}>{t('Public Key')}</label>
          <textarea name="pub_key" value={clusterStore.pub_key} onChange={changePubkey} />
          <p className={styles.rightShow}>
            {t('Format')}: ssh-rsa AAAAB3NzaC1ycEAAArwtrdgjUTEEHh...
          </p>
        </div>
        <div className={styles.textareaItem}>
          <label className={styles.name}>{t('Description')}</label>
          <textarea
            name="description"
            value={clusterStore.description}
            onChange={changeDescription}
          />
        </div>

        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} onClick={addKeyPairs}>
            {t('Confirm')}
          </Button>
          <Button onClick={cancelFun || this.goBack}>{t('Cancel')}</Button>
        </div>
      </form>
    );
  }

  renderAside() {
    const { t } = this.props;

    return <p>{t('ssh_key_guide')}</p>;
  }

  renderCard(pair) {
    const { t } = this.props;

    return (
      <div className={styles.sshCard}>
        <div className={styles.title}>{pair.name}</div>
        <div className={styles.pubKey}>{pair.pub_key}</div>
        <div className={styles.time}>
          {t('Created on')}: {formatTime(pair.create_time, 'YYYY/MM/DD HH:mm:ss')}
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
      }
      /*{
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
      }*/
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
          <Button
            onClick={() => this.showCreateModal()}
            className={styles.addButton}
            type="primary"
          >
            {t('Add')}
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
    );
  }

  render() {
    const { t } = this.props;
    const { keyPairs, modalType } = this.props.clusterStore;

    return (
      <Layout title={t('SSH Keys')}>
        {keyPairs.length > 0 ? (
          this.renderDetail()
        ) : (
          <CreateResource title={'Create SSH Key'} aside={this.renderAside()} asideTitle="SSH Keys">
            {this.renderForm()}
          </CreateResource>
        )}
        {modalType === 'deleteKey' && this.renderDeleteModal()}
        {modalType === 'addKey' && this.renderAddModal()}
        {modalType === 'download' && this.renderDownloadModal()}
      </Layout>
    );
  }
}
