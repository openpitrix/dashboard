import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';
import styles from './index.scss';

export default class NoData extends PureComponent {
  static propTypes = {
    type: PropTypes.string
  };

  static defaultProps = {
    type: 'Apps'
  };

  render() {
    const { type } = this.props;
    const iconMap = {
      Apps: 'appcenter',
      Clusters: 'cluster',
      Runtimes: 'stateful-set',
      Repos: 'stateful-set',
      Categories: 'components',
      Events: 'tateful-set',
      Versions: 'tag'
    };
    let iconName = iconMap[type] || 'appcenter';

    return (
      <div className={styles.noData}>
        <Icon name={iconName} size={120} type={`light`} />
        <div className={styles.word}>No results or data for {type}</div>
      </div>
    );
  }
}
