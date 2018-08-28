import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { capitalize } from 'lodash';
import { translate } from 'react-i18next';

import { ucfirst } from 'utils/string';
import { Icon } from 'components/Base';
import styles from './index.scss';

@translate()
export default class StepContent extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    explain: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const { name, explain, children } = this.props;

    return (
      <div className={styles.stepContent}>
        <div className={styles.stepName}>{name}</div>
        <div className={styles.stepExplain}>{explain}</div>
        {children}
      </div>
    );
  }
}
