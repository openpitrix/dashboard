import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';

import styles from './index.scss';

@withTranslation()
export default class Status extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.string,
    transMap: PropTypes.object,
    /* type: PropTypes.oneOf([
     *   'draft',
     *   'running',
     *   'active',
     *   'stopped',
     *   'ceased',
     *   'pending',
     *   'suspended',
     *   'successful',
     *   'failed',
     *   'deleted',
     *   'working', // job status

     *   'enabled',
     *   'disabled',

     *   'published'
     * ]), */
    transition: PropTypes.oneOf([
      '',
      'starting',
      'updating',
      'stopping',
      'deleting',
      'creating',
      'upgrading',
      'rollbacking',
      'recovering',
      'ceasing',
      'resizing',
      'scaling'
    ]),
    type: PropTypes.string
  };

  static defaultProps = {
    type: 'pending',
    transition: '',
    transMap: {}
  };

  render() {
    const {
      style,
      className,
      name,
      type,
      transition,
      transMap,
      t
    } = this.props;
    const status = String(transition || type).toLowerCase();
    let transName = name || status;
    transName = transMap[transName] || transName;
    const normalizeName = t(capitalize(transName));

    return (
      <span className={classnames(styles.status, className)} style={style}>
        <i className={classnames(styles.icon, styles[status])} />
        <span className={styles.name}>{normalizeName}</span>
      </span>
    );
  }
}
