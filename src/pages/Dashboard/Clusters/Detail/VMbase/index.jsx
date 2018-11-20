import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import _ from 'lodash';

import { Button, Icon, Table, Radio, Input, Modal } from 'components/Base';
import { Card, Dialog } from 'components/Layout';
import DetailTabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';
import columns from './columns';
import { getFilterOptions } from '../utils';
import { formatTime } from 'utils';

import styles from '../index.scss';

@translate()
@inject(({ rootStore }) => ({
  store: rootStore.clusterDetailStore,
  sshKeyStore: rootStore.sshKeyStore
  // clusterStore: rootStore.clusterStore
}))
@observer
export default class VMbasedCluster extends React.Component {
  static propTypes = {
    cluster: PropTypes.object.isRequired
  };
  static defaultProps = {
    cluster: {}
  };

  onClickAddNodes = () => {
    this.props.store.showModal('addNodes');
  };

  onClickDeleteNodes = () => {
    this.props.store.showModal('deleteNodes');
  };

  attachKeyPairsShow = () => {
    const { sshKeyStore } = this.props;
    sshKeyStore.pairId = '';
    this.props.store.showModal('attachKeyPairs');
  };

  attachKeyPairs = async () => {
    const { store, sshKeyStore, t } = this.props;
    const { selectedNodeIds, hideModal, cancelSelectNodes } = store;
    const { pairId, attachKeyPairs } = sshKeyStore;

    if (pairId) {
      const result = await attachKeyPairs([pairId], selectedNodeIds);
      if (!(result && result.err)) {
        hideModal();
        cancelSelectNodes();
      }
    } else {
      sshKeyStore.error(t('Please select SSH key'));
    }
  };

  handleAddNodes = async (e, formData) => {
    const { selectedNodeRole, addNodes } = this.props.store;
    const { cluster } = this.props;

    formData = _.extend(_.pick(formData, ['node_count', 'advanced_params']), {
      cluster_id: cluster.clusterId,
      role: selectedNodeRole
    });

    formData.node_count = parseInt(formData.node_count);

    await addNodes(formData);
  };

  handleDeleteNodes = async () => {
    const { deleteNodes, selectedNodeIds } = this.props.store;

    await deleteNodes({
      cluster_id: this.clusterId,
      node_id: selectedNodeIds,
      advanced_params: [] // todo
    });
  };

  handleResizeCluster = () => {
    // todo
  };

  getClusterRoles() {
    const { cluster } = this.props.store;
    return _.uniq(_.get(cluster, 'cluster_role_set', []).map(cl => cl.role));
  }

  onSelectKey = item => {
    const { sshKeyStore } = this.props;
    const { pairId } = sshKeyStore;

    if (pairId !== item.key_pair_id) {
      sshKeyStore.pairId = item.key_pair_id;
    }
  };

  renderDetailTabs() {
    return <DetailTabs tabs={['Nodes']} />;
  }

  renderToolbar() {
    const { store, t } = this.props;
    const { searchNode, onSearchNode, onClearNode, onRefreshNode, selectedNodeIds } = store;

    if (selectedNodeIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button type="delete" onClick={this.onClickDeleteNodes} className="btn-handle">
            {t('Delete')}
          </Button>
          <Button onClick={this.attachKeyPairsShow}>{t('Attach')}</Button>
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
      >
        {/*<Button type="primary" className={styles.addNodesBtn} onClick={this.onClickAddNodes}>*/}
        {/*<Icon name="add" size="mini" type="white" />*/}
        {/*<span className={styles.addNodeTxt}>{t('Add Nodes')}</span>*/}
        {/*</Button>*/}
      </Toolbar>
    );
  }

  renderTable() {
    const { store, t } = this.props;

    const {
      clusterNodes,
      selectedNodeKeys,
      selectNodeStatus,
      onChangeSelectNodes,
      changePaginationNode,
      onChangeNodeStatus,
      totalNodeCount,
      isLoading
    } = store;

    return (
      <Table
        isLoading={isLoading}
        columns={columns(t)}
        dataSource={clusterNodes}
        filterList={getFilterOptions({
          trans: t,
          onChange: onChangeNodeStatus,
          selectValue: selectNodeStatus
        })}
        pagination={{
          tableType: 'Clusters',
          onChange: changePaginationNode,
          total: totalNodeCount,
          current: 1,
          noCancel: false
        }}
        rowSelection={{
          type: 'checkbox',
          selectType: 'onSelect',
          selectedRowKeys: selectedNodeKeys,
          onChange: onChangeSelectNodes
        }}
      />
    );
  }

  renderModals = () => {
    const { modalType, isModalOpen } = this.props.store;

    if (!isModalOpen) {
      return null;
    }

    if (['delete', 'start', 'stop'].includes(modalType)) {
      return this.renderOperationModal();
    }

    if (modalType === 'addNodes') {
      return this.renderAddNodesModal();
    }

    if (modalType === 'deleteNodes') {
      return this.renderDeleteNodesModal();
    }

    if (modalType === 'attachKeyPairs') {
      return this.renderAttachModal();
    }

    if (modalType === 'resize') {
      return this.renderResizeClusterModal();
    }
  };

  renderOperationModal = () => {
    const { t } = this.props;
    const { hideModal, isModalOpen, modalType } = this.props.store;

    return (
      <Dialog
        title={t(`${_.capitalize(modalType)} cluster`)}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleOperateCluster}
      >
        {t('operate cluster desc', { operate: t(_.capitalize(modalType)) })}
      </Dialog>
    );
  };

  renderResizeClusterModal = () => {
    const { store, t } = this.props;
    const { isModalOpen, hideResizeClusterModal } = store;

    // todo
    return (
      <Dialog
        title={t(`Resize cluster`)}
        isOpen={isModalOpen}
        onCancel={hideResizeClusterModal}
        onSubmit={_.noop}
      >
        <p>resize cluster</p>
      </Dialog>
    );
  };

  renderAddNodesModal = () => {
    const { store, t } = this.props;
    const { hideAddNodesModal, isModalOpen, selectedNodeRole, onChangeNodeRole } = store;
    const roles = this.getClusterRoles();
    const hideRoles = roles.length === 1 && roles[0] === '';

    return (
      <Dialog
        title={t(`Add Nodes`)}
        isOpen={isModalOpen}
        onCancel={hideAddNodesModal}
        onSubmit={this.handleAddNodes}
      >
        <div className={styles.wrapAddNodes}>
          <div className={classnames(styles.formControl, { [styles.hide]: hideRoles })}>
            <label>{t('Node Role')}</label>
            <Radio.Group value={selectedNodeRole || roles[0]} onChange={onChangeNodeRole}>
              {roles.map((role, idx) => (
                <Radio value={role} key={idx} className={styles.radio}>
                  {role}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          <div className={styles.formControl}>
            <label>{t('Node Count')}</label>
            <Input
              name="node_count"
              type="number"
              className={styles.input}
              defaultValue={1}
              required
            />
          </div>
        </div>
      </Dialog>
    );
  };

  renderDeleteNodesModal = () => {
    const { store, t } = this.props;
    const { hideDeleteNodesModal, isModalOpen, selectedNodeIds } = store;

    return (
      <Dialog
        title={t('Delete Nodes')}
        isOpen={isModalOpen}
        onCancel={hideDeleteNodesModal}
        onSubmit={this.handleDeleteNodes}
      >
        {t('DEL_RESOURCE_TIPS', { resource_ids: selectedNodeIds.join(', ') })}
      </Dialog>
    );
  };

  renderKeyCard(pair) {
    return (
      <div className={styles.sshCard}>
        <div className={styles.title}>{pair.name}</div>
        <div className={styles.pubKey}>{pair.pub_key}</div>
      </div>
    );
  }

  renderAttachModal = () => {
    const { store, sshKeyStore, t } = this.props;
    const { isModalOpen, hideModal } = store;
    const { keyPairs, pairId } = sshKeyStore;

    return (
      <Modal title={t('Attach SSH Key')} visible={isModalOpen} onCancel={hideModal} hideFooter>
        <div className={styles.attachContent}>
          {keyPairs.map(pair => (
            <div
              key={pair.key_pair_id}
              onClick={() => this.onSelectKey(pair)}
              className={classnames(styles.sshCardOuter, {
                [styles.active]: pair.key_pair_id === pairId
              })}
            >
              {this.renderKeyCard(pair)}
            </div>
          ))}
        </div>
        <div className={styles.operateBtns}>
          <Button type="primary" onClick={this.attachKeyPairs}>
            {t('Confirm')}
          </Button>
          <Button type="default" onClick={hideModal}>
            {t('Cancel')}
          </Button>
        </div>
      </Modal>
    );
  };

  render() {
    return (
      <div>
        {this.renderDetailTabs()}
        <Card hasTable>
          {this.renderToolbar()}
          {this.renderTable()}
        </Card>
        {this.renderModals()}
      </div>
    );
  }
}
