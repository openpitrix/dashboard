import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import _ from 'lodash';

import {
  Button, Table, Radio, Input, Icon
} from 'components/Base';
import { Card, Dialog } from 'components/Layout';
import DetailTabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';
import DeploySection, { Group as DeployGroup } from 'components/Deploy';
import Cache from 'lib/cache';
import VMParser, { factory } from 'lib/config-parser';
import { compareObj } from 'utils/object';
import columns from './columns';
import { getFilterOptions } from '../utils';

import styles from '../index.scss';

const keysShouldBeNumber = ['cpu', 'memory', 'storage_size', 'volume_size'];

@withTranslation()
@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  detailStore: rootStore.clusterDetailStore,
  sshKeyStore: rootStore.sshKeyStore,
  deployStore: rootStore.appDeployStore
}))
@observer
export default class VMbasedCluster extends React.Component {
  static propTypes = {
    cluster: PropTypes.object.isRequired
  };

  static defaultProps = {
    cluster: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      configJson: null
    };

    this.cache = new Cache();
    this.vmParser = new VMParser();
  }

  componentDidUpdate = async () => {
    const { deployStore, clusterStore, cluster } = this.props;
    const { modalType } = clusterStore;
    const { version_id } = cluster;
    const { configJson } = this.state;

    if (['addNodes', 'resize'].includes(modalType) && _.isEmpty(configJson)) {
      const cachedConfig = this.cache.get(version_id);
      if (cachedConfig) {
        this.setState({
          configJson: cachedConfig
        });
      } else {
        await deployStore.fetchFilesByVersion(version_id);
        const cacheData = deployStore.configJson;

        this.cache.set(version_id, cacheData);
        this.setState({
          configJson: cacheData
        });
      }
    }
  };

  onClickAddNodes = () => {
    this.props.clusterStore.showModal('addNodes');
  };

  onCancelAddNodes = () => {
    const { clusterStore, detailStore } = this.props;
    clusterStore.hideModal();
    detailStore.setNodeRole();
  };

  onClickDeleteNodes = () => {
    this.props.clusterStore.showModal('deleteNodes');
  };

  onCancelDeleteNodes = () => {
    const { clusterStore, detailStore } = this.props;
    clusterStore.hideModal();
    detailStore.cancelDeleteNodes();
  };

  showKeyPairs = () => {
    const { sshKeyStore } = this.props;
    sshKeyStore.pairId = '';
    this.props.clusterStore.showModal('attachKeyPairs');
  };

  attachKeyPairs = async () => {
    const {
      clusterStore, detailStore, sshKeyStore, t
    } = this.props;
    const { selectedNodeIds, cancelSelectNodes } = detailStore;
    const { pairId, attachKeyPairs } = sshKeyStore;

    if (pairId) {
      const result = await attachKeyPairs([pairId], selectedNodeIds);
      if (!(result && result.err)) {
        clusterStore.hideModal();
        cancelSelectNodes();
      }
    } else {
      sshKeyStore.error(t('Please select SSH key'));
    }
  };

  /**
   * transform role conf from config.json
   * @param data
   * @param keyPrefix
   */
  transformRoleConf(data = {}, keyPrefix = 'node.') {
    // compose role conf from config.json
    const rawRoleConf = _.pickBy(
      data,
      (val, key) => key.indexOf(keyPrefix) === 0
    );

    // transform raw conf
    return _.transform(
      rawRoleConf,
      (res, val, key) => {
        const keyParts = key.split('.');
        if (keyParts.length < 3) {
          return false;
        }

        const [, role, meter] = [...keyParts];
        if (keysShouldBeNumber.indexOf(meter) > -1) {
          val = parseInt(val);
        }

        if (!res[role]) {
          res[role] = {};
        }

        _.extend(res[role], {
          [meter]: val
        });
      },
      {}
    );
  }

  handleAddNodes = async (e, formData) => {
    const { cluster, detailStore, clusterStore } = this.props;
    const { clusterNodes, selectedNodeRole } = detailStore;

    const origData = _.extend({}, formData);

    formData = _.extend(_.pick(formData, ['node_count']), {
      cluster_id: cluster.cluster_id,
      role: selectedNodeRole,
      advanced_params: []
    });
    formData.node_count = parseInt(formData.node_count);

    // check if role is newly added
    if (!_.find(clusterNodes, { role: selectedNodeRole })) {
      formData.advanced_params.push(
        JSON.stringify({
          conf: {
            cluster: this.transformRoleConf(origData)
          }
        })
      );
    }

    const res = await detailStore.addNodes(formData);

    if (res) {
      clusterStore.hideModal();
      detailStore.setNodeRole();
      await detailStore.onRefreshNode();
    }
  };

  handleDeleteNodes = async () => {
    const { cluster, detailStore, clusterStore } = this.props;
    const { deleteNodes, selectedNodeIds } = detailStore;

    const res = await deleteNodes({
      cluster_id: cluster.cluster_id,
      node_id: selectedNodeIds,
      advanced_params: []
    });

    if (res) {
      clusterStore.hideModal();
      detailStore.cancelDeleteNodes();
      await detailStore.onRefreshNode();
    }
  };

  handleResize = async (e, formData) => {
    const { cluster, detailStore, clusterStore } = this.props;
    const { selectedNodeRole, resizeCluster } = detailStore;
    const roleConf = this.transformRoleConf(formData);
    const params = {
      cluster_id: cluster.cluster_id,
      role_resource: [],
      advanced_param: []
    };

    if (roleConf[selectedNodeRole]) {
      params.role_resource.push(
        _.extend({}, roleConf[selectedNodeRole], {
          role: selectedNodeRole
        })
      );
    }

    const res = await resizeCluster(params);

    if (res) {
      clusterStore.hideModal();
      detailStore.setNodeRole();
    }
  };

  onSelectKey = item => {
    const { sshKeyStore } = this.props;
    const { pairId } = sshKeyStore;

    if (pairId !== item.key_pair_id) {
      sshKeyStore.pairId = item.key_pair_id;
    }
  };

  renderDetailTabs = () => <DetailTabs tabs={['Nodes']} />;

  renderToolbar() {
    const { clusterStore, detailStore, t } = this.props;
    const { onlyView } = clusterStore;
    const {
      searchNode,
      onSearchNode,
      onClearNode,
      onRefreshNode,
      selectedNodeIds,
      cluster
    } = detailStore;

    if (selectedNodeIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button
            type="delete"
            onClick={this.onClickDeleteNodes}
            className="btn-handle"
          >
            {t('Delete')}
          </Button>
          <Button onClick={this.showKeyPairs}>{t('Attach')}</Button>
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
        {!onlyView && (
          <Button
            type="primary"
            className={styles.addNodesBtn}
            onClick={this.onClickAddNodes}
            disabled={cluster.status !== 'active'}
          >
            <Icon name="add" size="mini" type="white" />
            {t('Add')}
          </Button>
        )}
      </Toolbar>
    );
  }

  renderTable() {
    const { clusterStore, detailStore, t } = this.props;
    const { onlyView } = clusterStore;

    const {
      clusterNodes,
      selectedNodeKeys,
      selectNodeStatus,
      onChangeSelectNodes,
      changePaginationNode,
      onChangeNodeStatus,
      totalNodeCount,
      isLoading
    } = detailStore;

    const rowSelection = {
      type: 'checkbox',
      selectType: 'onSelect',
      selectedRowKeys: selectedNodeKeys,
      onChange: onChangeSelectNodes
    };

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
        rowSelection={onlyView ? {} : rowSelection}
      />
    );
  }

  renderModals = () => {
    const { clusterStore, detailStore, t } = this.props;
    const { modalType, isModalOpen, hideModal } = clusterStore;
    const { env } = detailStore;

    if (!isModalOpen) {
      return null;
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
      return this.renderResize();
    }

    if (modalType === 'update_env') {
      let envSettings = [];
      let validEnv = false;

      try {
        this.vmParser.setConfig(env);
        envSettings = this.vmParser.getEnvSetting();
        if (!Array.isArray(envSettings)) {
          envSettings = [envSettings];
        }

        this.origEnvParams = this.vmParser.getEnvDefaultParams(envSettings);
        validEnv = true;
      } catch (err) {
        this.origEnvParams = {};
      }

      return (
        <Dialog
          width={744}
          title={t(`Update cluster env`)}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={this.handleUpdateEnv}
        >
          {validEnv
            && envSettings.map((group, idx) => (
              <DeployGroup detail={group} seq={idx} key={idx} />
            ))}
          {!validEnv && t('Invalid config.json')}
        </Dialog>
      );
    }
  };

  handleUpdateEnv = (e, formData) => {
    const { doActions } = this.props.clusterStore;
    formData = this.transformRoleConf(formData, 'env.');
    if (compareObj(formData, this.origEnvParams)) {
      this.props.clusterStore.info('Data not changed');
      return;
    }

    doActions({
      env: JSON.stringify({ env: formData })
    });
  };

  renderAddNodesModal = () => {
    const { clusterStore, detailStore, t } = this.props;
    const { isModalOpen } = clusterStore;
    const { selectedNodeRole, setNodeRole } = detailStore;

    const roles = detailStore.getClusterRoles();
    const hideRoles = roles.length === 1 && roles[0] === '';

    if (!hideRoles && !selectedNodeRole) {
      setNodeRole(roles[0]);
    }

    return (
      <Dialog
        title={t(`Add Nodes`)}
        isOpen={isModalOpen}
        onCancel={this.onCancelAddNodes}
        onSubmit={this.handleAddNodes}
      >
        <div className={styles.wrapAddNodes}>
          <div
            className={classnames(styles.formControl, {
              [styles.hide]: hideRoles
            })}
          >
            <label>{t('Node Role')}</label>
            <Radio.Group
              value={selectedNodeRole || roles[0]}
              onChange={setNodeRole}
            >
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
          {this.renderRoleSettings()}
        </div>
      </Dialog>
    );
  };

  renderRoleSettings = ({ checkRoleNewlyAdd = true } = {}) => {
    const { clusterNodes, selectedNodeRole } = this.props.detailStore;
    const { configJson } = this.state;

    if (checkRoleNewlyAdd) {
      if (_.find(clusterNodes, { role: selectedNodeRole })) {
        return null;
      }
    }

    if (_.isEmpty(configJson)) {
      return <div>Loading..</div>;
    }

    this.vmParser.setConfig(configJson);
    const nodeSettings = this.vmParser.getNodeSetting();
    const roleSetting = _.find(nodeSettings, { key: selectedNodeRole }) || {};

    return (
      <div className={styles.roleSetting}>
        {factory(roleSetting.properties).map((sec, idx) => {
          if (_.isFunction(sec.toJSON)) {
            sec = sec.toJSON();
          }
          return (
            <DeploySection
              detail={sec}
              key={idx}
              labelClsName={styles.roleSettingLabel}
            />
          );
        })}
      </div>
    );
  };

  renderDeleteNodesModal = () => {
    const { clusterStore, detailStore, t } = this.props;
    const { isModalOpen } = clusterStore;
    const { selectedNodeIds } = detailStore;

    return (
      <Dialog
        title={t('Delete Nodes')}
        isOpen={isModalOpen}
        onCancel={this.onCancelDeleteNodes}
        onSubmit={this.handleDeleteNodes}
      >
        {t('DEL_RESOURCE_TIPS', { resource_ids: selectedNodeIds.join(', ') })}
      </Dialog>
    );
  };

  renderResize = () => {
    const { clusterStore, detailStore, t } = this.props;
    const { isModalOpen, hideModal } = clusterStore;

    const { selectedNodeRole, setNodeRole } = detailStore;

    const roles = detailStore.getClusterRoles();
    const hideRoles = roles.length === 1 && roles[0] === '';

    if (!hideRoles && !selectedNodeRole) {
      setNodeRole(roles[0]);
    }

    return (
      <Dialog
        title={t(`Resize cluster`)}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleResize}
      >
        <div className={styles.wrapAddNodes}>
          <div
            className={classnames(styles.formControl, {
              [styles.hide]: hideRoles
            })}
          >
            <label>{t('Node Role')}</label>
            <Radio.Group
              value={selectedNodeRole || roles[0]}
              onChange={setNodeRole}
            >
              {roles.map((role, idx) => (
                <Radio value={role} key={idx} className={styles.radio}>
                  {role}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          {this.renderRoleSettings({ checkRoleNewlyAdd: false })}
        </div>
      </Dialog>
    );
  };

  renderKeyCard = pair => (
    <div className={styles.sshCard}>
      <div className={styles.title}>{pair.name}</div>
      <div className={styles.pubKey}>{pair.pub_key}</div>
    </div>
  );

  renderAttachModal = () => {
    const { clusterStore, sshKeyStore, t } = this.props;
    const { isModalOpen, hideModal } = clusterStore;
    const { keyPairs, pairId } = sshKeyStore;

    return (
      <Dialog
        isOpen={isModalOpen}
        title={t('Attach SSH Key')}
        onCancel={hideModal}
        onSubmit={this.attachKeyPairs}
      >
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
      </Dialog>
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
