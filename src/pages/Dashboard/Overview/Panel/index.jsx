import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Button from 'components/Base/Button';
import { Icon } from 'components/Base';

import styles from './index.scss';

@translate()
export default class Panel extends PureComponent {
  static propTypes = {
    buttonTo: PropTypes.string,
    children: PropTypes.node,
    len: PropTypes.number,
    linkTo: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string
  };

  renderNoDataWelcome() {
    const {
      type, linkTo, buttonTo, t
    } = this.props;

    const iconMap = {
      app: 'appcenter',
      repo: 'stateful-set',
      runtime: 'stateful-set',
      cluster: 'cluster'
    };
    const titleMap = {
      app: 'Browse Apps',
      repo: 'Create Repo',
      runtime: 'Create Runtime',
      cluster: 'Manage Clusters'
    };
    const descMap = {
      app: 'EMPTY_APP_TIPS',
      repo: 'EMPTY_REPO_TIPS',
      runtime: 'EMPTY_REPO_TIPS',
      cluster: 'EMPTY_CLUSTER_TIPS'
    };
    const btnMap = {
      app: 'Browse',
      repo: 'Create',
      runtime: 'Create',
      cluster: 'Manage'
    };

    return (
      <div className={styles.blankList}>
        <div className={styles.iconName}>
          <Icon name={iconMap[type]} size={64} />
        </div>
        <div className={styles.title}>{t(titleMap[type])}</div>
        <div className={styles.description} title={descMap[type]}>
          {t(descMap[type])}
        </div>
        <Link className={styles.button} to={buttonTo || linkTo}>
          <Button type="default">{t(btnMap[type])}</Button>
        </Link>
      </div>
    );
  }

  renderDataList() {
    const {
      isAdmin, linkTo, title, children, t
    } = this.props;
    const childNodes = React.Children.map(children, child => React.cloneElement(child, {
      ...child.props,
      isAdmin
    }));

    return (
      <div className={styles.panel}>
        <div className={styles.title}>
          {t(title)}
          <Link className={styles.more} to={linkTo}>
            {t('more')}
          </Link>
        </div>
        {childNodes}
      </div>
    );
  }

  render() {
    const { len } = this.props;

    if (!len) {
      return this.renderNoDataWelcome();
    }

    return this.renderDataList();
  }
}
