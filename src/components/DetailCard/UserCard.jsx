import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import CopyId from './CopyId';

import styles from './index.scss';

@translate()
export default class UserCard extends React.Component {
  static propTypes = {
    userDetail: PropTypes.object.isRequired
  };

  static defaultProps = {
    userDetail: {}
  };

  render() {
    const { userDetail, t } = this.props;

    return (
      <div className={styles.detailCard}>
        <div className={styles.title}>
          <div className={styles.name} title={userDetail.username}>
            {userDetail.username}
          </div>
          <CopyId id={userDetail.user_id} />
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>{t('Status')}</span>
            <Status name={userDetail.status} type={userDetail.status} />
          </li>
          <li>
            <span className={styles.name}>{t('Role')}</span>
            {userDetail.role}
          </li>
          <li>
            <span className={styles.name}>{t('Email')}</span>
            {userDetail.email}
          </li>
          <li>
            <span className={styles.name}>{t('Date Updated')}</span>
            <TimeShow time={userDetail.status_time} type="detailTime" />
          </li>
        </ul>
      </div>
    );
  }
}
