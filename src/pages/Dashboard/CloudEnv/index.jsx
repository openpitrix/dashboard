import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import Layout from 'components/Layout';

import { Icon, Switch } from 'components/Base';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  cloudEnvStore: rootStore.cloudEnvStore
}))
@observer
export default class CloudEnvironment extends Component {
  async componentDidMount() {
    const { cloudEnvStore } = this.props;
    await cloudEnvStore.fetchAll();
  }

  renderItem = ({
    key, name, icon, disabled
  }) => {
    const { cloudEnvStore } = this.props;
    const { changeEnv } = cloudEnvStore;
    return (
      <div
        key={key}
        className={classnames(styles.item, {
          [styles.disabled]: disabled
        })}
      >
        <Icon name={icon} />
        <span className={styles.itemName}>{name}</span>
        <Switch checked={!disabled} onChange={changeEnv(key)} />
      </div>
    );
  };

  render() {
    const { t, cloudEnvStore } = this.props;
    const { environment } = cloudEnvStore;
    return (
      <Layout isCenterPage centerWidth={660} pageTitle={t('Cloud environment')}>
        <h3 className={styles.title}>{t('CLOUD-ENVIRONMENT-DESCRIBE')}</h3>
        <div className={styles.list}>
          {_.map(environment, item => this.renderItem(item))}
        </div>
      </Layout>
    );
  }
}
