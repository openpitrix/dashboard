import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';
import styles from './index.scss';

export default class ProviderName extends Component {
  static propTypes = {
    name: PropTypes.string,
    provider: PropTypes.string,
    className: PropTypes.string
  };
  static defaultProps = {
    provider: 'qingcloud'
  };

  render() {
    const { name, provider, className } = this.props;

    return (
      <div className={classnames(styles.repoName, className)} title={name}>
        <Icon name={provider} size={20} className={styles.icon} type="dark" />
        {name}
      </div>
    );
  }
}
