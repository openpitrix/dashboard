import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';
import styles from './index.scss';

export default class ProviderName extends Component {
  static propTypes = {
    name: PropTypes.string,
    provider: PropTypes.oneOf(['qingcloud', 'aws', 'kubernetes'])
  };

  render() {
    const { name, provider } = this.props;

    return (
      <div className={styles.repoName}>
        <Icon name={provider} size={24} className={styles.icon} type="coloured" />
        {name}
      </div>
    );
  }
}
