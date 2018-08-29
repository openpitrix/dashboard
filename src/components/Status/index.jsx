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
      'running',
      'active',
      'stopping',
      'stopped',
      'ceased',
      'pending',
      'suspended',
      'deleted'
    ]),
    transitionStatus: PropTypes.string
  };

  static defaultProps = {
    status: 'pending',
    transitionStatus: ''
  };

  render() {
    const { style, className, name, type, transitionStatus, t } = this.props;

    let status = transitionStatus || type;

    return (
      <span className={classnames(styles.status, className)} style={style}>
        <i className={classnames(styles.icon, styles[status])} />
        {t(capitalize(name))}
      </span>
    );
  }
}
