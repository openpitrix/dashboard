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
      'stopped',
      'ceased',
      'pending',
      'suspended',
      'deleted'
    ])
  };

  static defaultProps = {
    status: 'pending'
  };

  render() {
    const { style, className, name, type, t } = this.props;

    return (
      <span className={classnames(styles.status, className)} style={style}>
        <i className={classnames(styles.icon, styles[type])} />
        {t(capitalize(name))}
      </span>
    );
  }
}
