import React, { Component } from 'react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { Icon, Input } from 'components/Base';
import { Card, Dialog } from 'components/Layout';

import styles from '../index.scss';

@translate()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  envStore: rootStore.testingEnvStore,
  credentialStore: rootStore.runtimeCredentialStore,
  user: rootStore.user
}))
@observer
export default class RuntimeModal extends Component {
  render() {
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
    const rt = _.find(runtimes, { runtime_id: selectId });

    if (modalType === 'modify_runtime') {
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
              const checked = !selectCredentialId
                ? rt.runtime_credential_id === runtime_credential_id
                : selectCredentialId === runtime_credential_id;

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

    return null;
  }
}
