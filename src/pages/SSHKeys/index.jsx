import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Table, Popover, Radio, Button, Input, Select, Icon, Modal } from 'components/Base';
import Layout, { CreateResource, Dialog, Panel, Grid, Row, Section, Card } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import { formatTime } from 'utils';

import { clusterStatus } from 'config/resource-status';
import columns from './columns';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  clusterStore: rootStore.clusterStore,
  clusterDetailStore: rootStore.clusterDetailStore,
  sshKeyStore: rootStore.sshKeyStore
}))
@observer
export default class SSHKeys extends Component {
  async componentDidMount() {
    const { clusterStore, clusterDetailStore, sshKeyStore } = this.props;

    await sshKeyStore.fetchKeyPairs();

    await clusterStore.fetchAll({
      noLimit: true,
      active: clusterStatus
    });
    await clusterDetailStore.fetchNodes();
  }

  goBack = () => {
    history.back();
  };

  onClickPair = item => {
    const { clusterDetailStore, sshKeyStore } = this.props;
    const { currentPairId } = sshKeyStore;
    const { fetchNodes } = clusterDetailStore;

    if (currentPairId !== item.key_pair_id) {
      sshKeyStore.currentPairId = item.key_pair_id;
      fetchNodes({ node_id: item.node_id });
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

  renderOperateMenu = pairId => {
    const { t } = this.props;

    return (
      <div className="operate-menu">
        <span onClick={e => this.showDeleteModal(e, pairId)}>{t('Delete')}</span>
      </div>
    );
  };

  renderDeleteModal = () => {
    const { sshKeyStore, t } = this.props;
    const { isModalOpen, removeKeyPairs, hideModal } = sshKeyStore;

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
    const { sshKeyStore, t } = this.props;
    const { isModalOpen, hideModal } = sshKeyStore;

    return (
      <Modal title={t('Add SSH Key')} visible={isModalOpen} onCancel={hideModal} hideFooter>
        {this.renderForm(hideModal)}
      </Modal>
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
          Click "Download" button to get the private key. Its download link will be kept for 10
          minutes.
        </p>
        <Button type="primary">{t('Download')}</Button>
      </Dialog>
    );
  };

  renderForm(cancelFun) {
    const { sshKeyStore, t } = this.props;
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
      <form className={styles.createForm}>
        <div>
          <label className={styles.name}>{t('Name')}</label>
          <Input name="name" value={name} onChange={changeName} maxLength="50" />
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
          <textarea name="description" value={description} onChange={changeDescription} />
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
    const { clusterStore, clusterDetailStore, sshKeyStore, t } = this.props;
    const { keyPairs, currentPairId } = sshKeyStore;
    const {
      isLoading,
      searchNode,
      onSearchNode,
      onClearNode,
      onRefreshNode,
      onChangeNodeStatus,
      selectNodeStatus,
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
          <Card>
            <Toolbar
              placeholder={t('Search Node')}
              searchWord={searchNode}
              onSearch={onSearchNode}
              onClear={onClearNode}
              onRefresh={onRefreshNode}
            />
            <Table
              columns={columns(clusters, t)}
              dataSource={clusterNodes.toJSON()}
              isLoading={isLoading}
              filterList={filterList}
              pagination={pagination}
            />
          </Card>
        </Section>
      </Grid>
    );
  }

  renderModals() {
    const { modalType } = this.props.sshKeyStore;

    if (modalType === 'addKey') {
      return this.renderAddModal();
    }
    if (modalType === 'deleteKey') {
      return this.renderDeleteModal();
    }
    if (modalType === 'download') {
      return this.renderDownloadModal();
    }
  }

  render() {
    const { t } = this.props;
    const { keyPairs } = this.props.sshKeyStore;

    return (
      <Layout title={t('SSH Keys')}>
        {keyPairs.length ? (
          this.renderDetail()
        ) : (
          <CreateResource title={'Create SSH Key'} aside={this.renderAside()} asideTitle="SSH Keys">
            {this.renderForm()}
          </CreateResource>
        )}
        {this.renderModals()}
      </Layout>
    );
  }
}
