import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './index.scss';

const CreateResourcePage = ({
  className,
  children,
  title,
  aside,
  asideTitle,
  noAside,
  ...rest
}) => (
  <div className={classnames(styles.wrapper, className)} {...rest}>
    <div className={styles.leftInfo}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
    {!noAside ? (
      <div className={styles.rightInfo}>
        <div className={styles.title}>{asideTitle}</div>
        <div className={styles.content}>{aside}</div>
      </div>
    ) : null}
  </div>
);

CreateResourcePage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  aside: PropTypes.node,
  asideTitle: PropTypes.string,
  noAside: PropTypes.bool
};

CreateResourcePage.defaultProps = {
  asideTitle: 'Guide'
};

export default CreateResourcePage;
