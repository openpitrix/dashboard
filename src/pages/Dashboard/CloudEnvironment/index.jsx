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
  cloudEnvironmentStore: rootStore.cloudEnvironmentStore
}))
@observer
export default class CloudEnvironment extends Component {
  async componentDidMount() {
    const { cloudEnvironmentStore } = this.props;
    cloudEnvironmentStore.fetchAll();
  }

  renderItem = item => {
    const checked = item.status === 'active';
    return (
      <div
        key={item.id}
        className={classnames(styles.item, {
          [styles.disabled]: !checked
        })}
      >
        <Icon name={item.id} />
        <span className={styles.itemName}>{item.name}</span>
        <Switch checked={checked} />
      </div>
    );
  };

  render() {
    const { t, cloudEnvironmentStore } = this.props;
    const { environment } = cloudEnvironmentStore;
    return (
      <Layout isCenterPage pageTitle={t('Cloud environment')}>
        <h3 className={styles.title}>{t('CLOUD-ENVIRONMENT-DESCRIBE')}</h3>
        <div className={styles.list}>
          {_.map(environment, item => this.renderItem(item))}
        </div>
      </Layout>
    );
  }
}
