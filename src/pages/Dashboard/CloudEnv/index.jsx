import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import Layout from 'components/Layout';
import { Icon, Tooltip, Switch } from 'components/Base';

import styles from './index.scss';

@withTranslation()
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

  renderItem({
    key, name, icon, disabled, enable
  }) {
    const { cloudEnvStore, t } = this.props;
    const { changeEnv } = cloudEnvStore;
    return (
      <div
        key={key}
        className={classnames({
          disabled: !enable,
          [styles.item]: !disabled
        })}
      >
        {disabled ? (
          <Tooltip
            isShowArrow
            portal
            placement="top"
            content={t('Not support currently')}
            key={key}
            targetCls={styles.item}
            popperCls={styles.popper}
          >
            <Icon name={icon} />
            <span className={styles.itemName}>{name}</span>
          </Tooltip>
        ) : (
          <Fragment>
            <Icon name={icon} />
            <span className={styles.itemName}>{name}</span>
            <Switch
              checked={enable}
              onChange={checked => changeEnv(checked, key)}
            />
          </Fragment>
        )}
      </div>
    );
  }

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
