import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Button from 'components/Base/Button';
import { imgPlaceholder } from 'utils';
import styles from './index.scss';

const Panel = ({ title, linkTo, children, isAdmin, btnName, len }) =>
  isAdmin || len > 0 ? (
    <div className={classNames(styles.panel, { [styles.normal]: !isAdmin })}>
      <div className={styles.title}>
        {!isAdmin && <img src={imgPlaceholder(24)} className={styles.image} />}
        {title}
        {isAdmin && (
          <Link className={styles.more} to={linkTo}>
            more...
          </Link>
        )}
      </div>
      {children}
      {!isAdmin && (
        <Link className={styles.button} to={linkTo}>
          <Button>{btnName}</Button>
        </Link>
      )}
    </div>
  ) : (
    <div className={styles.blankList}>
      <img src={imgPlaceholder(64)} className={styles.image} />
      <div className={styles.title}>
        {btnName === 'Browse' && 'Browse Apps'}
        {btnName === 'Create' && 'Create Runtime'}
        {btnName === 'Manage' && 'Manage Clusters'}
      </div>
      <div className={styles.description}>
        Deployed as one-stop-shop application management platform in an organization to support
        multiple cloud systems including hybrid cloud.
      </div>
      <Link className={styles.button} to={linkTo}>
        <Button>{btnName}</Button>
      </Link>
    </div>
  );

Panel.propTypes = {
  title: PropTypes.string,
  linkTo: PropTypes.string,
  children: PropTypes.node,
  isAdmin: PropTypes.bool,
  btnName: PropTypes.string,
  len: PropTypes.number
};

export default Panel;
