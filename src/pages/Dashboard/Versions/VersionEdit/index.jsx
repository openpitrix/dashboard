import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import { Input, Select } from 'components/Base';
import { Card } from 'components/Layout';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore
}))
@observer
export default class VersionEdit extends Component {
  render() {
    const { appVersionStore, t } = this.props;
    const {
      version,
      changeVersion,
      checkVersion,
      checkResult
    } = appVersionStore;

    return (
      <Card className={styles.versionEdit}>
        <div className={styles.title}>{t('Base Info')}</div>
        <form className={styles.editForm}>
          <div className={styles.item}>
            <div className={styles.name}>
              <label>{t('Delivery type')}</label>
              <p className={styles.noteWord}>{t('Not editable')}</p>
            </div>
            <Select value={version.type} disabled>
              <Select.Option>{version.type}</Select.Option>
            </Select>
          </div>
          <div
            className={classnames(styles.item, {
              [styles.error]: checkResult.name
            })}
          >
            <div className={styles.name}>
              <label>{t('Version No')}</label>
              <p className={styles.noteWord}>
                {t('Significant identity of app version')}
              </p>
            </div>
            <Input
              name="name"
              maxLength={20}
              value={version.name}
              onChange={e => changeVersion(e, 'name')}
              onBlur={e => checkVersion(e, 'name')}
              onFocus={e => checkVersion(e, 'name', true)}
            />
            <p className={styles.errorInfo}>{t(checkResult.name)}</p>
          </div>
          <div className={styles.item}>
            <div className={styles.name}>
              <label>{t('Update Log')}</label>
              <p className={styles.noteWord}>
                {t(
                  'Used to describe in detail the specific content of this update'
                )}
              </p>
            </div>
            <textarea
              name="description"
              value={version.description}
              onChange={e => changeVersion(e, 'description')}
              maxLength={2000}
            />
          </div>
        </form>
        <div className={styles.title}>{t('Pricing information')}</div>
        <p className={styles.note}>
          {t('App pricing is not supported for the time being')}
        </p>
      </Card>
    );
  }
}
