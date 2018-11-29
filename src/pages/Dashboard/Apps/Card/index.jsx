import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getPastTime } from 'src/utils';
import Status from 'components/Status';
import styles from './index.scss';

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
      icon, name, description, status, status_time
    } = data;
    // TODO change icon
    let imgStr = icon;
    if (icon && icon.includes('att-')) {
      imgStr = `${apiServer.split('/v')[0]}/attachments/${icon}/raw`;
    }
    const deliverTypes = ['VM', 'API', 'Helm'];
    return (
      <div className={classnames(styles.container, className)}>
        <div className={styles.title}>
          <img className={styles.icon} src={imgStr || ''} alt="logo" />
          <div>
            <span className={styles.name}>{name}</span>
            <Status className={styles.status} name={status} type={status} />
          </div>
        </div>
        <div className={styles.description}>{description}</div>
        <div className={styles.deliverTypes}>
          <span>{t('Delivery type')}：</span>
          {deliverTypes.map(type => (
            <span key={type} className={styles.deliverType}>
              {type}
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
