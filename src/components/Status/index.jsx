import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { capitalize } from 'lodash';
import { translate } from 'react-i18next';

import styles from './index.scss';

@translate()
export default class Status extends PureComponent {
  static propTypes = {
    style: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf([
      'draft',
      'running',
      'active',
      'stopped',
      'ceased',
      'pending',
      'suspended',
      'successful',
      'failed',
      'deleted',
      'working', // job status

      'enabled',
      'disabled'
    ]),
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
    ])
  };

  static defaultProps = {
    type: 'pending',
    transition: ''
  };

  render() {
    const { style, className, name, type, transition, t } = this.props;
    let status = String(transition || type).toLowerCase();

    const normalizeName = t(capitalize(name || status));

    return (
      <span className={classnames(styles.status, className)} style={style}>
        <i className={classnames(styles.icon, styles[status])} />
        {normalizeName}
      </span>
    );
  }
}
