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
    title: PropTypes.string,
    linkTo: PropTypes.string,
    children: PropTypes.node,
    iconName: PropTypes.string,
    len: PropTypes.number
  };

  renderNoDataWelcome() {
    const { iconName, linkTo, t } = this.props;

    const btnObj = {
      appcenter: 'Browse',
      'stateful-set': 'Create',
      cluster: 'Manage'
    };
    const descMap = {
      appcenter: t('EMPTY_APP_TIPS'),
      'stateful-set': t('EMPTY_REPO_TIPS'),
      cluster: t('EMPTY_CLUSTER_TIPS')
    };

    return (
      <div className={styles.blankList}>
        <div className={styles.iconName}>
          <Icon name={iconName} size={64} />
        </div>
        <div className={styles.title}>
          {iconName === 'appcenter' && t('Browse Apps')}
          {iconName === 'stateful-set' && t('Create Repo')}
          {iconName === 'cluster' && t('Manage Clusters')}
        </div>
        <div className={styles.description} title={descMap[iconName]}>
          {descMap[iconName]}
        </div>
        <Link className={styles.button} to={linkTo}>
          <Button type="default">{t(btnObj[iconName])}</Button>
        </Link>
      </div>
    );
  }

  renderDataList() {
    const { isAdmin, linkTo, title, children, t } = this.props;
    const childNodes = React.Children.map(children, child =>
      React.cloneElement(child, {
        ...child.props,
        isAdmin
      })
    );

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
