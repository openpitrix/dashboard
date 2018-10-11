import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import CopyId from './CopyId';

import { roleMap } from 'config/roles';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user
}))
@observer
export default class UserCard extends React.Component {
  static propTypes = {
    userDetail: PropTypes.object.isRequired
  };

  static defaultProps = {
    userDetail: {}
  };

  render() {
    const { userDetail, user, t } = this.props;

    return (
      <div className={styles.detailCard}>
        <div className={styles.title}>
          <div className={styles.name} title={userDetail.username}>
            {user.username}
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
            {t(roleMap[userDetail.role] || 'None')}
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
