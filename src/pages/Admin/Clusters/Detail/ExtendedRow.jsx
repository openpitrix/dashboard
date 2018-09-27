import React from 'react';
import styles from './index.scss';
import Status from 'components/Status';
import { Icon } from 'components/Base';

export default function ExtendedRow({ name, status, host_id, host_ip, private_ip }) {
  return (
    <div className={styles.extendedTr}>
      <div className={styles.extendedFirstChild} />
      <div className={styles.extendedIcon}>
        <Icon name="pods" />
      </div>
      <div>
        <div>Pods:</div>
        <div className={styles.extendedTdName}>{name}</div>
      </div>
      <div className={styles.extendedTdStatus}>
        <Status type={status} name={status} />
      </div>
      <div className={styles.extendedFlex}>
        <div>Instance:</div>
        <div>{`${host_id} ${host_ip}`}</div>
      </div>
      <div className={styles.extendedFlex}>
        <div>IP:</div>
        <div>{private_ip}</div>
      </div>
    </div>
  );
}
