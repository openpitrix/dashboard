import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'react-i18next';

// import { Icon } from 'components/Base';

import styles from './index.scss';

@translate()
export default class StepContent extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    explain: PropTypes.string,
    name: PropTypes.string
  };

  render() {
    const {
      name, explain, children, className
    } = this.props;

    return (
      <div className={classNames(styles.stepContent, className)}>
        <div className={styles.stepName}>{name}</div>
        <div className={styles.stepExplain}>{explain}</div>
        {children}
      </div>
    );
  }
}
