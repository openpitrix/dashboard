import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tabs from '../Tabs';
import Notification from 'components/Base/Notification';

import styles from './index.scss';

const Page = ({ children, msg, hideMsg, className, ...rest }) => {
  if (typeof msg === 'object') {
    msg = msg + ''; // transform mobx object
  }

  return (
    <div className={classnames(styles.container, className)} {...rest}>
      <Tabs />
      {msg ? <Notification message={msg} onHide={hideMsg} timeOut={3000} /> : null}
      {children}
    </div>
  );
};

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  msg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  hideMsg: PropTypes.func
};

Page.defaultProps = {
  msg: '',
  hideMsg: () => {}
};

export BackBtn from './BackBtn';
export CreateResource from './CreateResource';
export default Page;
