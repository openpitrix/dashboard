import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import { get } from 'lodash';

import {
  Table, PopoverIcon, Button, Input, Icon
} from 'components/Base';
import { Dialog, Grid, Section } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import Loading from 'components/Loading';

import { clusterStatus } from 'config/resource-status';
import columns from './columns';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  clusterStore: rootStore.clusterStore,
  clusterDetailStore: rootStore.clusterDetailStore,
  sshKeyStore: rootStore.sshKeyStore,
  user: rootStore.user
}))
@observer
export default class SSHKeys extends Component {
  async componentDidMount() {
    const {
      clusterStore, clusterDetailStore, sshKeyStore, user
    } = this.props;

    sshKeyStore.userId = user.user_id;
    await sshKeyStore.fetchKeyPairs();

    const nodeIds = get(sshKeyStore.keyPairs.slice(), '[0].node_id', '') || [
      '0'
    ];
    clusterDetailStore.nodeIds = nodeIds;
    if (nodeIds) {
      await clusterStore.fetchAll({
        noLimit: true,
        active: clusterStatus
      });
      clusterDetailStore.nodeIds = nodeIds;
      await clusterDetailStore.fetchNodes({ node_id: nodeIds });
    }
  }

  componentWillUnmount() {
    const { clusterDetailStore } = this.props;
    clusterDetailStore.reset();
  }

  goBack = () => {
    window.history.back();
  };

  onClickPair = item => {
    const { clusterDetailStore, sshKeyStore } = this.props;
    const { currentPairId } = sshKeyStore;
    const { cancelSelectNodes, fetchNodes } = clusterDetailStore;

    if (currentPairId !== item.key_pair_id) {
      cancelSelectNodes();
      sshKeyStore.currentPairId = item.key_pair_id;
      // clusterDetailStore.nodeIds = item.node_id || ['0'];
      fetchNodes();
    }
  };

  detachAllKeysShow = nodeIds => {
    const { clusterDetailStore, sshKeyStore } = this.props;
    clusterDetailStore.selectedNodeIds = nodeIds || [];
    sshKeyStore.showModal('detachAllKey');
  };

  detachKeyPairs = async () => {
    const { clusterDetailStore, sshKeyStore, user } = this.props;
    const { detachKeyPairs, currentPairId } = sshKeyStore;
    const {
      selectedNodeIds,
      cancelSelectNodes,
      fetchNodes
    } = clusterDetailStore;

    const result = await detachKeyPairs([currentPairId], selectedNodeIds);
    if (!(result && result.err)) {
      cancelSelectNodes();
      // fix api refresh data has delay
      setTimeout(async () => {
        await sshKeyStore.fetchKeyPairs({ owner: user.user_id });
        const keyPairs = sshKeyStore.keyPairs.filter(
          item => item.key_pair_id === currentPairId
        );
        const nodeIds = get(keyPairs.slice(), '[0].node_id', '');
        await fetchNodes({ node_id: nodeIds || 0 });
      }, 3000);
    }
  };

  showDeleteModal = (e, pairId) => {
    e.stopPropagation();
    const { sshKeyStore } = this.props;
    sshKeyStore.pairId = pairId;
    sshKeyStore.showModal('deleteKey');
  };

  showCreateModal = () => {
    const { sshKeyStore } = this.props;
    sshKeyStore.resetKeyPair();
    sshKeyStore.showModal('addKey');
  };

  renderOperateMenu = pair => {
    const { t } = this.props;
    const len = pair.nodeIds && pair.nodeIds.length;

    return (
      <div className="operate-menu">
        {len > 0 && (
          <span onClick={() => this.detachAllKeysShow(pair.nodeIds)}>
            <Icon name="close" type="dark" />
            {t('Detach all nodes')}
          </span>
        )}
        <span onClick={e => this.showDeleteModal(e, pair.key_pair_id)}>
          <Icon name="trash" type="dark" />
          {t('Delete')}
        </span>
      </div>
    );
  };

  renderDeleteModal = () => {
    const { sshKeyStore, t } = this.props;
    const {
      isModalOpen, hideModal, modalType, removeKeyPairs
    } = sshKeyStore;
    let title = t('Delete SSH Key'),
      desc = t('delete_key_desc'),
      submit = removeKeyPairs;
    if (['detachKey', 'detachAllKey'].includes(modalType)) {
      title = t('Detach SSH Key');
      desc = modalType === 'detachAllKey'
        ? t('detach_all_key_desc')
        : t('detach_key_desc');
      submit = this.detachKeyPairs;
    }

    return (
      <Dialog
        title={title}
        visible={isModalOpen}
        onSubmit={submit}
        onCancel={hideModal}
      >
        {desc}
      </Dialog>
    );
  };

  renderAddModal = () => {
    const { sshKeyStore, t } = this.props;
    const { isModalOpen, hideModal } = sshKeyStore;

    const {
      name,
      pub_key,
      description,
      addKeyPairs,
      changeName,
      changePubkey,
      changeDescription
    } = sshKeyStore;

    return (
      <Dialog
        width={744}
        title={t('Create SSH Key')}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={addKeyPairs}
        isDialog={false}
      >
        <div className={styles.createForm}>
          <div>
            <label className={styles.name}>{t('Name')}</label>
            <Input
              name="name"
              value={name}
              onChange={changeName}
              maxLength="50"
            />
          </div>
          <div className={styles.textareaItem}>
            <label className={styles.name}>{t('Public Key')}</label>
            <textarea name="pub_key" value={pub_key} onChange={changePubkey} />
            <p className={styles.rightShow}>
              {t('Format')}: ssh-rsa AAAAB3NzaC1ycEAAArwtrdgjUTEEHh...
            </p>
          </div>
          <div className={styles.textareaItem}>
            <label className={styles.name}>{t('Description')}</label>
            <textarea
              name="description"
              value={description}
              onChange={changeDescription}
            />
          </div>
        </div>
      </Dialog>
    );
  };

  renderDownloadModal = () => {
    const { sshKeyStore, t } = this.props;
    const { isModalOpen, hideModal } = sshKeyStore;

    return (
      <Dialog
        title={t('Download the private key of the SSH key ')}
        visible={isModalOpen}
        onCancel={hideModal}
        hideFooter
      >
        <p className={styles.downloadWord}>
          Click "Download" button to get the private key. Its download link will
          be kept for 10 minutes.
        </p>
        <Button type="primary">{t('Download')}</Button>
      </Dialog>
    );
  };

  renderKeyPairs() {
    const { sshKeyStore, user, t } = this.props;
    const { keyPairs, currentPairId } = sshKeyStore;

    return (
      <Section
        size={3}
        className={classnames(styles.sshKeys, {
          [styles.greyBg]: !user.isUserPortal
        })}
      >
        <ul>
          {keyPairs.map(pair => (
            <li
              key={pair.key_pair_id}
              onClick={() => this.onClickPair(pair)}
              className={classnames({
                [styles.active]: pair.key_pair_id === currentPairId
              })}
            >
              <label className={styles.name} title={pair.name}>
                {pair.name}
              </label>
              <span className={styles.total}>
                ({(pair.nodeIds && pair.nodeIds.length) || 0})
              </span>
              <PopoverIcon
                className={styles.operation}
                content={this.renderOperateMenu(pair)}
              />
            </li>
          ))}
        </ul>
        <div
          onClick={() => this.showCreateModal()}
          className={styles.addKey}
          type="primary"
        >
          <Icon name="add" size={16} className={styles.icon} />
          <span>{t('Create SSH Key')}</span>
        </div>
      </Section>
    );
  }

  renderToolbar() {
    const { clusterDetailStore, sshKeyStore, t } = this.props;
    const {
      searchNode,
      onSearchNode,
      onClearNode,
      onRefreshNode,
      selectedNodeIds
    } = clusterDetailStore;

    if (selectedNodeIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button
            onClick={() => sshKeyStore.showModal('detachKey')}
            className="btn-handle"
          >
            {t('Detach')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search Node')}
        searchWord={searchNode}
        onSearch={onSearchNode}
        onClear={onClearNode}
        onRefresh={onRefreshNode}
      />
    );
  }

  renderDetail() {
    const { clusterStore, clusterDetailStore, t } = this.props;
    const {
      isLoading,
      onChangeNodeStatus,
      selectNodeStatus,
      selectedNodeKeys,
      onChangeSelectNodes,
      changePaginationNode,
      totalNodeCount,
      clusterNodes
    } = clusterDetailStore;

    const { clusters } = clusterStore;

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

    const rowSelection = {
      type: 'checkbox',
      selectType: 'onSelect',
      selectedRowKeys: selectedNodeKeys,
      onChange: onChangeSelectNodes
    };

    const pagination = {
      tableType: 'Clusters',
      onChange: changePaginationNode,
      total: totalNodeCount,
      current: 1,
      noCancel: false
    };

    return (
      <Grid>
        {this.renderKeyPairs()}

        <Section size={9}>
          {this.renderToolbar()}

          <Table
            columns={columns(clusters, t)}
            dataSource={clusterNodes.toJSON()}
            isLoading={isLoading}
            rowSelection={rowSelection}
            filterList={filterList}
            pagination={pagination}
          />
        </Section>
      </Grid>
    );
  }

  renderModals() {
    const { modalType } = this.props.sshKeyStore;

    if (modalType === 'addKey') {
      return this.renderAddModal();
    }
    if (['deleteKey', 'detachKey', 'detachAllKey'].includes(modalType)) {
      return this.renderDeleteModal();
    }
    if (modalType === 'download') {
      return this.renderDownloadModal();
    }
  }

  renderContent() {
    const { sshKeyStore, t } = this.props;
    const { keyPairs } = sshKeyStore;

    if (keyPairs.length === 0) {
      return (
        <div className={styles.nullKeys}>
          <Icon name="ssh" size={84} type="dark" />
          <p className={styles.word1}>{t('No SSH key is available')}</p>
          <p className={styles.word2}>
            {t('Please click the create button below to add')}
          </p>
          <Button type="primary" onClick={() => this.showCreateModal()}>
            <Icon name="add" size={20} type="white" />
            {t('Create')}
          </Button>
        </div>
      );
    }

    return this.renderDetail();
  }

  render() {
    const { sshKeyStore } = this.props;

    return (
      <Loading isLoading={sshKeyStore.isLoading} className={styles.sshPage}>
        {this.renderContent()}
        {this.renderModals()}
      </Loading>
    );
  }
}
