import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, PopoverIcon } from 'components/Base';
import { Card } from 'components/Layout';

import { CLUSTER_TYPE } from 'config/runtimes';

import styles from '../index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  envStore: rootStore.testingEnvStore,
  credentialStore: rootStore.runtimeCredentialStore
}))
@observer
export default class RuntimeCard extends Component {
  get isDetialCard() {
    const { envStore } = this.props;
    return !!_.get(envStore, 'runtimeToShowInstances.runtime_id');
  }

  handleClickAction = (type, id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const { showModal, setCurrentId } = this.props.envStore;
    showModal(type);
    setCurrentId(id);
  };

  renderMenu(runtime_id) {
    const { t } = this.props;
    return (
      <div className="operate-menu">
        <span
          onClick={e => this.handleClickAction('modify_runtime', runtime_id, e)}
        >
          <Icon name="pen" type="dark" />
          {t('Modify')}
        </span>
        <span
          onClick={e => this.handleClickAction('switch_auth', runtime_id, e)}
        >
          <Icon name="refresh" type="dark" />
          {t('Switch authorization info')}
        </span>
        <span
          onClick={e => this.handleClickAction('delete_runtime', runtime_id, e)}
        >
          <Icon name="trash" type="dark" />
          {t('Delete')}
        </span>
      </div>
    );
  }

  render() {
    const {
      clusterStore,
      credentialStore,
      name,
      description,
      runtime_id,
      runtime_credential_id,
      zone,
      onClick,
      t
    } = this.props;
    const cntCluster = _.filter(
      clusterStore.clusters,
      cl => cl.cluster_type === CLUSTER_TYPE.instance
        && cl.runtime_id === runtime_id
    ).length;
    const { credentials } = credentialStore;
    const credentialName = _.get(
      _.find(credentials, { runtime_credential_id }) || {},
      'name'
    );
    const agentCluster = this.isDetialCard
      ? _.filter(
        clusterStore.clusters,
        cl => cl.cluster_type === CLUSTER_TYPE.agent
            && cl.runtime_id === runtime_id
      ).length
      : 0;

    return (
      <Card
        className={classnames(styles.envItem, {
          [styles.clickable]: !this.isDetialCard
        })}
        onClick={onClick}
      >
        <div>
          <span className={styles.name}>{name}</span>
          <PopoverIcon
            showBorder
            iconCls={styles.actionBar}
            className={classnames('operation', styles.actionPop)}
            content={this.renderMenu(runtime_id)}
          />
        </div>
        <div className={styles.desc}>{description || ''}</div>
        <div className={styles.bottomInfo}>
          <div className={styles.info}>
            <p className={styles.label}>{t('Zone')}</p>
            <p className={styles.val}>{zone}</p>
          </div>
          <div className={styles.info}>
            <p className={styles.label}>{t('Instance count')}</p>
            <p className={styles.val} style={{ cursor: 'pointer' }}>
              {cntCluster}
            </p>
          </div>
          {this.isDetialCard && (
            <div className={styles.info}>
              <p className={styles.label}>{t('Agent Instance count')}</p>
              <p className={styles.val} style={{ cursor: 'pointer' }}>
                {agentCluster}
              </p>
            </div>
          )}

          <div className={styles.info}>
            <p className={styles.label}>{t('Authorization info')}</p>
            <p className={styles.val}>{credentialName || t('None')}</p>
          </div>
        </div>
      </Card>
    );
  }
}
