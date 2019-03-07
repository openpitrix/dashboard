import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import {
  PopoverIcon,
  Icon,
  Button,
  Input,
  Notification
} from 'components/Base';
import { Card, Dialog } from 'components/Layout';
import Loading from 'components/Loading';
import routes, { toRoute } from 'routes';
import { formatTime, obj2Qs } from 'utils';

import styles from '../index.scss';

@translate()
@inject(({ rootStore }) => ({
  envStore: rootStore.testingEnvStore,
  credentialStore: rootStore.runtimeCredentialStore
}))
@observer
export class Credential extends React.Component {
  static propTypes = {
    platform: PropTypes.string
  };

  static defaultProps = {
    platform: 'qingcloud'
  };

  componentDidMount() {
    this.props.envStore.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.platform !== this.props.platform) {
      this.props.envStore.fetchData();
    }
  }

  handleClickAction = (type, credential_id) => {
    const { showModal, setCredentialId } = this.props.envStore;
    if (type === 'add_runtime') {
      this.goPage({
        type: 'runtime',
        credential_id
      });
    } else {
      showModal(type);
      setCredentialId(credential_id);
    }
  };

  /**
   *
   * @param params | query string
   */
  goPage = (params = {}) => {
    const { envStore } = this.props;
    const page = toRoute(routes.portal.runtimeCreate);
    const query = {
      type: 'credential',
      provider: envStore.platform || 'qingcloud'
    };

    if (_.isObject(params) && !params.nativeEvent) {
      Object.assign(query, params);
    }

    this.props.history.push([page, obj2Qs(query)].join('?'));
  };

  renderMenu(credential_id) {
    const { t } = this.props;
    return (
      <div className="operate-menu">
        <span
          onClick={() => this.handleClickAction('modify_auth_info', credential_id)
          }
        >
          <Icon name="pen" type="dark" />
          {t('Modify')}
        </span>
        <span
          onClick={() => this.handleClickAction('add_runtime', credential_id)}
        >
          <Icon name="add" type="dark" />
          {t('Add runtime')}
        </span>
        <span
          onClick={() => this.handleClickAction('delete_auth_info', credential_id)
          }
        >
          <Icon name="trash" type="dark" />
          {t('Delete')}
        </span>
      </div>
    );
  }

  renderModals() {
    const { envStore, credentialStore, t } = this.props;
    const {
      isModalOpen,
      modalType,
      hideModal,
      selectCredentialId,
      handleOperation
    } = envStore;
    const { credentials } = credentialStore;

    if (modalType === 'modify_auth_info') {
      const cr = _.find(credentials, {
        runtime_credential_id: selectCredentialId
      });
      return (
        <Dialog
          title={t('Modify authorization info')}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={handleOperation}
        >
          <div className={styles.fmCtrl}>
            <label className={styles.label}>{t('Name')}</label>
            <Input
              className={styles.field}
              name="name"
              defaultValue={cr.name}
            />
          </div>
          <div className={styles.fmCtrl}>
            <label className={styles.label}>{t('Description')}</label>
            <Input
              className={styles.field}
              name="description"
              defaultValue={cr.description}
            />
          </div>
        </Dialog>
      );
    }

    if (modalType === 'delete_auth_info') {
      return (
        <Dialog
          title={t('Delete authorization info')}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={handleOperation}
        >
          <p>{t('DELETE_AUTH_INFO_CONFIRM')}</p>
        </Dialog>
      );
    }
  }

  renderEmpty() {
    const { envStore, t } = this.props;

    return (
      <Card className={styles.emptyData}>
        <p>{t('No authorization info')}</p>
        <p>{t('TIPS_NOT_ADD_AUTH', { env: envStore.platformName })}</p>
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
    const { credentialStore, t } = this.props;
    const { credentials } = credentialStore;
    if (credentials.length === 0) {
      return this.renderEmpty();
    }

    return (
      <div className={styles.authInfos}>
        {_.map(
          credentials,
          ({
            name, description, runtime_credential_id, create_time
          }, idx) => (
            <Card className={styles.info} key={idx}>
              <span className={styles.name}>{name}</span>
              <span className={styles.desc}>{description}</span>
              <span className={styles.time}>
                {formatTime(create_time, `YYYY年MM月DD日 HH:mm:ss`)}
              </span>
              <PopoverIcon
                className={classnames(
                  'operation',
                  styles.actionPop,
                  styles.fixMenu
                )}
                content={this.renderMenu(runtime_credential_id)}
              />
            </Card>
          )
        )}
        <div className={styles.addAuthInfo}>
          <Icon name="add" />
          <span onClick={this.goPage} className={styles.btnAdd}>
            {t('Add authorization info')}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const { envStore } = this.props;
    const { isLoading } = envStore;

    return (
      <Loading isLoading={isLoading}>
        <Notification />
        {this.renderContent()}
        {this.renderModals()}
      </Loading>
    );
  }
}

export default withRouter(Credential);
