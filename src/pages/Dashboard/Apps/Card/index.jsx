import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import routes, { toRoute } from 'routes';

import { Image } from 'components/Base';
import Status from 'components/Status';
import VersionType from 'components/VersionType';

import { getPastTime, mappingStatus } from 'src/utils';

import styles from './index.scss';

export class AppCard extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    data: PropTypes.object
  };

  render() {
    const {
      children, className, data, t
    } = this.props;
    const {
      app_id,
      icon,
      name,
      abstraction,
      description,
      status,
      status_time,
      app_version_types
    } = data;

    return (
      <div
        className={classnames(styles.container, className)}
        onClick={() => {
          this.props.history.push(
            toRoute(routes.portal._dev.versions, {
              appId: app_id
            })
          );
        }}
      >
        <div className={styles.title}>
          <label className={styles.imageOuter}>
            <Image iconLetter={name} src={icon} iconSize={48} alt="logo" />
          </label>
          <div>
            <p className={styles.name}>{name}</p>
            <Status
              className={styles.status}
              name={mappingStatus(status)}
              type={status}
            />
          </div>
        </div>
        <pre className={styles.description}>{abstraction || description}</pre>
        <div className={styles.deliverTypes}>
          <span>{t('Delivery type')}：</span>
          <span className={styles.deliverType}>
            <VersionType types={app_version_types} />
          </span>
        </div>
        <div>
          <span>{t('Updated At')}：</span>
          <span>{getPastTime(status_time)}</span>
          <div className={styles.operateBtn}>{children}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(AppCard);
