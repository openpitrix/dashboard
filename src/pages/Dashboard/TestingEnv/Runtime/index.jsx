import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { providers } from 'config/testing-env';

import {
  Icon, Button, Popover, Input
} from 'components/Base';
import {
  Grid, Section, Card, Dialog
} from 'components/Layout';
import Loading from 'components/Loading';

import styles from '../index.scss';

@translate()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  envStore: rootStore.testingEnvStore,
  credentialStore: rootStore.runtimeCredentialStore
}))
@observer
class Runtime extends React.Component {
  static propTypes = {
    platform: PropTypes.string
  };

  static defaultProps = {
    platform: 'qingcloud'
  };

  async componentDidMount() {
    await this.props.envStore.fetchData();
  }

  async componentDidUpdate(prevProps) {
    const { platform, envStore } = this.props;
    if (prevProps.platform !== platform) {
      await envStore.fetchData();
    }
  }

  handleClickAction = (type, id) => {
    const { showModal, setCurrentId } = this.props.envStore;
    showModal(type);
    setCurrentId(id);
  };

  goPage = () => {
    const { platform = 'qingcloud' } = this.props.envStore;
    this.props.history.push(
      `/dashboard/testing-runtime/add?provider=${platform}`
    );
  };

  renderMenu(runtime_id) {
    const { t } = this.props;
    return (
      <div className="operate-menu">
        <span
          onClick={() => this.handleClickAction('modify_runtime', runtime_id)}
        >
          <Icon name="pen" type="dark" />
          {t('Modify')}
        </span>
        <span onClick={() => this.handleClickAction('switch_auth', runtime_id)}>
          <Icon name="refresh" type="dark" />
          {t('Switch authorization info')}
        </span>
        <span
          onClick={() => this.handleClickAction('delete_runtime', runtime_id)}
        >
          <Icon name="trash" type="dark" />
          {t('Delete')}
        </span>
      </div>
    );
  }

  renderModals() {
    const {
      envStore, runtimeStore, credentialStore, t
    } = this.props;
    const {
      isModalOpen,
      modalType,
      hideModal,
      selectId,
      handleOperation
    } = envStore;
    const { runtimes } = runtimeStore;

    if (modalType === 'modify_runtime') {
      const rt = _.find(runtimes, { runtime_id: selectId });
      return (
        <Dialog
          title={t('Modify Runtime')}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={handleOperation}
        >
          <div className={styles.fmCtrl}>
            <label className={styles.label}>{t('Name')}</label>
            <Input
              className={styles.field}
              name="name"
              defaultValue={rt.name}
            />
          </div>
          <div className={styles.fmCtrl}>
            <label className={styles.label}>{t('Description')}</label>
            <Input
              className={styles.field}
              name="description"
              defaultValue={rt.description}
            />
          </div>
        </Dialog>
      );
    }
    if (modalType === 'switch_auth') {
      const { credentials } = credentialStore;
      const { selectCredentialId, setCredentialId } = envStore;
      return (
        <Dialog
          title={t('Switch authorization info')}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={handleOperation}
          className={styles.dialog}
        >
          {_.map(
            credentials,
            ({ name, description, runtime_credential_id }, idx) => {
              const checked = selectCredentialId === runtime_credential_id;

              return (
                <Card
                  className={classnames(styles.item, {
                    [styles.checked]: checked
                  })}
                  key={idx}
                  onClick={() => setCredentialId(runtime_credential_id)}
                >
                  <span className={styles.name}>{name}</span>
                  <span className={styles.desc}>{description}</span>
                  <span className={styles.icon}>
                    {checked && <Icon name="check" />}
                  </span>
                </Card>
              );
            }
          )}
        </Dialog>
      );
    }
    if (modalType === 'delete_runtime') {
      return (
        <Dialog
          title={t('Delete Runtime')}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={handleOperation}
        >
          <p>{t('DELETE_RUNTIME_CONFIRM')}</p>
        </Dialog>
      );
    }
  }

  renderEmpty() {
    const { envStore, t } = this.props;
    const platformName = _.get(
      _.find(providers, { key: envStore.platform }),
      'name',
      ''
    );

    return (
      <Card className={styles.emptyData}>
        <p>{t('No env')}</p>
        <p>{t('TIPS_NOT_ADD_ENV', { env: platformName })}</p>
        <Button
          type="primary"
          className={styles.btnAddEnv}
          onClick={this.goPage}
        >
          <Icon name="add" type="white" />
          {t('Add')}
        </Button>
      </Card>
    );
  }

  renderContent() {
    const {
      envStore,
      runtimeStore,
      credentialStore,
      clusterStore,
      t
    } = this.props;
    const { platform } = envStore;
    const { runtimes } = runtimeStore;
    const { credentials } = credentialStore;
    const validRts = _.filter(runtimes, rt => rt.provider === platform);

    if (_.isEmpty(validRts)) {
      return this.renderEmpty();
    }

    const clusterRtMap = _.groupBy(clusterStore.clusters, 'runtime_id');

    return (
      <Grid className={styles.envs}>
        {_.map(
          validRts,
          ({
            name, description, runtime_id, runtime_credential_id, zone
          }) => {
            const cntCluster = clusterRtMap[runtime_id]
              ? clusterRtMap[runtime_id].length
              : 0;
            const credentialName = _.get(
              _.find(credentials, { runtime_credential_id }) || {},
              'name'
            );

            return (
              <Section size={6} key={runtime_id}>
                <Card className={styles.envItem}>
                  <div>
                    <span className={styles.name}>{name}</span>
                    <Popover
                      showBorder
                      className={classnames('operation', styles.actionPop)}
                      content={this.renderMenu(runtime_id)}
                    >
                      <Icon
                        name="more"
                        type="dark"
                        className={styles.actionBar}
                      />
                    </Popover>
                  </div>
                  <div className={styles.desc}>{description || ''}</div>
                  <div className={styles.bottomInfo}>
                    <div className={styles.info}>
                      <p className={styles.label}>区域</p>
                      <p className={styles.val}>{zone}</p>
                    </div>
                    <div className={styles.info}>
                      <p className={styles.label}>实例数</p>
                      <p className={styles.val}>{cntCluster}</p>
                    </div>
                    <div className={styles.info}>
                      <p className={styles.label}>授权信息</p>
                      <p className={styles.val}>
                        {credentialName || t('None')}
                      </p>
                    </div>
                  </div>
                </Card>
              </Section>
            );
          }
        )}
        <Section size={6} className={styles.cardAddEnv}>
          <Button className={styles.btnAdd} onClick={this.goPage}>
            <Icon name="add" type="dark" />
            {t('Add new env')}
          </Button>
        </Section>
      </Grid>
    );
  }

  render() {
    const { envStore } = this.props;
    const { isLoading } = envStore;

    return (
      <Loading isLoading={isLoading}>
        {this.renderContent()}
        {this.renderModals()}
      </Loading>
    );
  }
}

export default withRouter(Runtime);
