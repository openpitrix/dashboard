import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Input, Select } from 'components/Base';
import { Card } from 'components/Layout';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore
}))
@observer
export default class VersionEdit extends Component {
  render() {
    const { appVersionStore, t } = this.props;
    const { version, changeVersion } = appVersionStore;

    return (
      <Card className={styles.versionEdit}>
        <div className={styles.title}>{t('基本信息')}</div>
        <form className={styles.editForm}>
          <div className={styles.item}>
            <div className={styles.name}>
              <label>{t('交付类型')}</label>
              <p className={styles.noteWord}>{t('不可修改')}</p>
            </div>
            <Select value={version.type} disabled>
              <Select.Option>{version.type}</Select.Option>
            </Select>
          </div>
          <div className={styles.item}>
            <div className={styles.name}>
              <label>{t('版本号')}</label>
              <p className={styles.noteWord}>{t('应用版本的重要标识')}</p>
            </div>
            <Input
              name="name"
              maxLength={20}
              value={version.name}
              onChange={e => changeVersion(e, 'name')}
            />
          </div>
          <div className={styles.item}>
            <div className={styles.name}>
              <label>{t('更新日志')}</label>
              <p className={styles.noteWord}>
                {t('用于详细描述此次更新的具体内容')}
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
        <div className={styles.title}>{t('定价信息')}</div>
        <p className={styles.note}>{t('暂时不支持应用定价')}</p>
      </Card>
    );
  }
}
