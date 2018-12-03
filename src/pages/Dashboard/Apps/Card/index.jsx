import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import _ from 'lodash';

import { getPastTime } from 'src/utils';
import Status from 'components/Status';
import { Image } from 'components/Base';

import styles from './index.scss';

@withRouter
export default class Loading extends Component {
  static propTypes = {
    apiServer: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    data: PropTypes.object
  };

  render() {
    const {
      apiServer, className, data, t
    } = this.props;
    const {
      app_id,
      icon,
      name,
      description,
      status,
      status_time,
      app_version_types
    } = data;
    let imgStr = icon;
    if (icon && _.startsWith(icon, 'att-')) {
      imgStr = `${apiServer.split('/v')[0]}/attachments/${icon}/raw`;
    }
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
            src={imgStr}
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
