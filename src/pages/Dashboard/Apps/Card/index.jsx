import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';

import { Image } from 'components/Base';
import Status from 'components/Status';
import { getPastTime } from 'src/utils';
import { getVersionTypesName } from 'config/version-types';

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
    return (
      <div
        className={classnames(styles.container, className)}
        onClick={() => {
          this.props.history.push(`/dashboard/app/${app_id}/versions`);
        }}
      >
        <div className={styles.title}>
          <label className={styles.imageOuter}>
            <Image iconLetter={name} src={icon} iconSize={48} alt="logo" />
          </label>
          <div>
            <p className={styles.name}>{name}</p>
            <Status className={styles.status} name={status} type={status} />
          </div>
        </div>
        <pre className={styles.description}>{description}</pre>
        <div className={styles.deliverTypes}>
          <span>{t('Delivery type')}：</span>
          <span className={styles.deliverType}>
            {(getVersionTypesName(app_version_types) || []).join(' ')}
          </span>
        </div>
        <div>
          <span>{t('Updated At')}：</span>
          <span>{getPastTime(status_time)}</span>
        </div>
      </div>
    );
  }
}
