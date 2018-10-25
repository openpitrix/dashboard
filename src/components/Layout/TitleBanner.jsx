import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { inject } from 'mobx-react/index';

import { Image, Icon, Input } from 'components/Base';
import styles from './index.scss';

// translate hoc should place before mobx
@translate()
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  clusterDetailStore: rootStore.clusterDetailStore,
  runtimeStore: rootStore.runtimeStore,
  user: rootStore.user
}))
@observer
class TitleBanner extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    hasSearch: PropTypes.bool
  };

  static defaultProps = {
    title: '',
    hasSearch: false
  };

  onSearch = async value => {
    this.props.history.push('/store/search/' + value);
  };

  onClearSearch = async () => {
    this.props.history.push('/');
  };

  renderContent = type => {
    const { appStore, clusterDetailStore, runtimeStore } = this.props;
    let detail = {};
    let hasImage = false;

    switch (type) {
      case 'appDetail':
        detail = appStore.appDetail;
        hasImage = true;
        break;
      case 'clusterDetail':
        detail = clusterDetailStore.cluster;
        break;
      case 'runtimeDetail':
        detail = runtimeStore.runtimeDetail;
        break;
    }

    if (detail.name) {
      return (
        <div className={styles.wrapper}>
          {hasImage && (
            <span className={styles.image}>
              <Image src={detail.icon} iconSize={48} />
            </span>
          )}
          {type === 'runtimeDetail' && (
            <span className={styles.icon}>
              <Icon name={detail.provider} size={24} type="white" />
            </span>
          )}
          <div className={styles.name}>{detail.name}</div>
          <div className={styles.desc}>{detail.description}</div>
        </div>
      );
    }

    return null;
  };

  render() {
    const { appStore, title, t } = this.props;
    const descMap = {
      'App Store': t('APP_STORE_DESC', { total: appStore.storeTotal }),
      Purchased: t('PURCHASED_DESC'),
      'My Runtimes': t('MY_RUNTIMES_DESC')
    };

    return (
      <div className={styles.titleBanner}>
        {Boolean(descMap[title]) && (
          <div className={styles.wrapper}>
            <div className={styles.name}>{t(title)}</div>
            <div className={styles.desc}>{descMap[title]}</div>
          </div>
        )}
        {!Boolean(descMap[title]) && this.renderContent(title)}
      </div>
    );
  }
}

export default withRouter(TitleBanner);
