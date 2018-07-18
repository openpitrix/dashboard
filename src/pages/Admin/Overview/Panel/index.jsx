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
    return (
      <div className={styles.blankList}>
        <div className={styles.iconName}>
          <Icon name={iconName} size={64} type="coloured" />
        </div>
        <div className={styles.title}>
          {iconName === 'appcenter' && 'Browse Apps'}
          {iconName === 'stateful-set' && 'Create Repo'}
          {iconName === 'cluster' && 'Manage Clusters'}
        </div>
        <div className={styles.description}>{t('pg-overview.normal_welcome_desc')}</div>
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
