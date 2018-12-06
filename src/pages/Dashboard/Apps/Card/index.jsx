import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';

import Status from 'components/Status';
import { Image } from 'components/Base';
import { getPastTime } from 'src/utils';

import styles from './index.scss';

@withRouter
export default class AppCard extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    data: PropTypes.object
  };

  render() {
    const { className, data, t } = this.props;
    const {
      app_id,
      icon,
      name,
      description,
      status,
      status_time,
      app_version_types
    } = data;
    const versions = app_version_types.split(',');
    return (
      <div
        className={classnames(styles.container, className)}
        onClick={() => {
          this.props.history.push(`/dashboard/app/${app_id}`);
        }}
      >
        <div className={styles.title}>
          <Image
            className={styles.icon}
            iconLetter={name}
            src={icon}
            iconSize={48}
            alt="logo"
          />
          <div>
            <span className={styles.name}>{name}</span>
            <Status className={styles.status} name={status} type={status} />
          </div>
        </div>
        <div className={styles.description}>{description}</div>
        <div className={styles.deliverTypes}>
          <span>{t('Delivery type')}：</span>
          {versions.map(type => (
            <span key={type} className={styles.deliverType}>
              {t(`version_type_${type}`)}
            </span>
          ))}
        </div>
        <div>
          <span>{t('Updated At')}：</span>
          <span>{getPastTime(status_time)}</span>
        </div>
      </div>
    );
  }
}
