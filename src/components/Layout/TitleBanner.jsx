import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import Input from '../Base/Input';

import styles from './index.scss';
import { inject } from 'mobx-react/index';

// translate hoc should place before mobx
@translate()
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
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

  render() {
    const { title, t } = this.props;
    const descMap = {
      'App Store': 'Openpitrix 官方商店，有 1203 款应用。',
      'Purchased': '所有你购买过的应用都会展示在此，包括应用对应的实例。',
      'My Runtimes': '平台同时支持多种云环境，可以在这里进行统一管理。'
    }

    return (
      <div className={styles.titleBanner}>
        <div className={styles.wrapper}>
          <div className={styles.name}>{t(title)}</div>
          <div className={styles.desc}>{descMap[title]}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(TitleBanner);
