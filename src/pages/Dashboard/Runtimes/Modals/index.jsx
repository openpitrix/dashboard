import React, { Component } from 'react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { Input } from 'components/Base';
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
      const { selectCredentialId, setCredentialId, runtimeName } = envStore;

      return (
        <Dialog
          title={t('Switch runtime authorization info', { runtimeName })}
          width={550}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={handleOperation}
          className={styles.dialog}
          okText={t('Switch')}
        >
          {_.map(
            credentials,
            ({ name, description, runtime_credential_id }, idx) => {
              const selected = selectCredentialId === runtime_credential_id;
              const checked = rt.runtime_credential_id === runtime_credential_id;
              const onClick = checked
                ? _.noop
                : () => setCredentialId(runtime_credential_id);

              return (
                <Card
                  className={classnames(styles.item, {
                    [styles.checked]: checked,
                    [styles.enable]: !checked,
                    [styles.selected]: selected
                  })}
                  key={idx}
                  onClick={onClick}
                >
                  <span className={styles.name}>
                    {name}
                    {checked && (
                      <span className={styles.checkedTxt}>
                        ({t('Checked this')})
                      </span>
                    )}
                  </span>
                  <span className={styles.desc}>{description}</span>
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
