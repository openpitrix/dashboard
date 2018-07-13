import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Button from 'components/Base/Button';
import { imgPlaceholder } from 'utils';
import trans, { __ } from 'hoc/trans';

import styles from './index.scss';

@trans()
export default class Panel extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    linkTo: PropTypes.string,
    children: PropTypes.node,
    isAdmin: PropTypes.bool,
    btnName: PropTypes.string,
    len: PropTypes.number
  };

  static defaultProps = {
    isAdmin: false
  };

  renderWelcomForNormalUser() {
    const { btnName, linkTo } = this.props;

    return (
      <div className={styles.blankList}>
        <img src={imgPlaceholder(64)} className={styles.image} />
        <div className={styles.title}>
          {btnName === 'Browse' && 'Browse Apps'}
          {btnName === 'Create' && 'Create Runtime'}
          {btnName === 'Manage' && 'Manage Clusters'}
        </div>
        <div className={styles.description}>{__('pg-overview.normal_welcome_desc')}</div>
        <Link className={styles.button} to={linkTo}>
          <Button>{__(btnName)}</Button>
        </Link>
      </div>
    );
  }

  renderDataListForAdmin() {
    const { isAdmin, linkTo, title, children, btnName } = this.props;
    const childNodes = React.Children.map(children, child =>
      React.cloneElement(child, {
        ...child.props,
        isAdmin
      })
    );

    return (
      <div className={classNames(styles.panel, { [styles.normal]: !isAdmin })}>
        <div className={styles.title}>
          {!isAdmin && <img src={imgPlaceholder(24)} className={styles.image} />}
          {__(title)}
          {isAdmin && (
            <Link className={styles.more} to={linkTo}>
              {__('more')}
            </Link>
          )}
        </div>
        {childNodes}
        {!isAdmin && (
          <Link className={styles.button} to={linkTo}>
            <Button>{__(btnName)}</Button>
          </Link>
        )}
      </div>
    );
  }

  render() {
    const { isAdmin, len } = this.props;

    if (!isAdmin && !len) {
      return this.renderWelcomForNormalUser();
    }

    return this.renderDataListForAdmin();
  }
}
