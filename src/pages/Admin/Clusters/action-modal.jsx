import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { capitalize } from 'lodash';
import { Dialog } from 'components/Layout';
import { Select, CodeMirror, Modal } from 'components/Base';

@observer
export default class ClusterActionModal extends Component {
  constructor(props) {
    super(props);
    const { clusterStore, appVersionStore } = this.props;
    const { cluster } = clusterStore;
    const { app_id } = cluster;
    appVersionStore.fetchAll({ app_id });
  }
  handleCluster = () => {
    const { clusterStore } = this.props;
    const { clusterId, clusterIds, modalType, operateType } = clusterStore;
    const ids = operateType === 'multiple' ? clusterIds.toJSON() : [clusterId];
    switch (modalType) {
      case 'cease':
        clusterStore.cease(ids);
        break;
      case 'delete':
        clusterStore.remove(ids);
        break;
      case 'start':
        clusterStore.start(ids);
        break;
      case 'stop':
        clusterStore.stop(ids);
        break;
      case 'rollback':
        clusterStore.rollback(ids);
        break;
      case 'update_env':
        clusterStore.updateEnv(ids);
        break;
      case 'upgrade':
        clusterStore.upgradeVersion(ids);
        break;
      default:
        break;
    }
  };
  renderConfirmModal() {
    const { t, clusterStore } = this.props;
    const { hideModal, isModalOpen, modalType } = clusterStore;
    const types = ['cease', 'delete', 'start', 'stop', 'rollback'];

    if (!types.includes(modalType)) return null;

    return (
      <Dialog
        title={t(`${capitalize(modalType)} cluster`)}
        visible={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleCluster}
      >
        {t('operate cluster desc', { operate: t(capitalize(modalType)) })}
      </Dialog>
    );
  }
  renderUpgradeEvnModal() {
    const { t, clusterStore } = this.props;
    const { isModalOpen, hideModal, modalType, changeEnv, env } = clusterStore;
    return (
      <Modal
        title={t(`${capitalize(modalType)} cluster`)}
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={this.handleCluster}
      >
        <div className="formContent">
          <div className="inputItem">
            <CodeMirror code={env} onChange={changeEnv} options={{ mode: 'yaml' }} />
          </div>
        </div>
      </Modal>
    );
  }
  renderUpgradeModal() {
    const { t, clusterStore, appVersionStore } = this.props;
    const { isModalOpen, hideModal, modalType, changeAppVersion } = clusterStore;
    const { versions } = appVersionStore;
    if (versions.length === 0) {
      return null;
    }

    return (
      <Modal
        title={t(`${capitalize(modalType)} cluster`)}
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={this.handleCluster}
      >
        <div className="formContent">
          <Select value={clusterStore.versionId} onChange={changeAppVersion}>
            {versions.map(({ version_id, name }) => (
              <Select.Option key={version_id} value={version_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    );
  }
  render() {
    const { clusterStore } = this.props;
    const { modalType } = clusterStore;
    return (
      <div>
        {this.renderConfirmModal()}
        {modalType === 'upgrade' && this.renderUpgradeModal()}
        {modalType === 'update_env' && this.renderUpgradeEvnModal()}
      </div>
    );
  }
}
