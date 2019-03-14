import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './index.scss';

const TdUser = ({ className, users, userId }) => {
  const user = _.find(users, { user_id: userId }) || {};

  return (
    <div className={classnames(styles.userShow, className)}>
      <label className={styles.name}>{user.username || userId}</label>
      {user.email}
    </div>
  );
};

TdUser.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string,
  users: PropTypes.array
};

TdUser.defaultProps = {
  users: [],
  userId: ''
};

export default TdUser;
