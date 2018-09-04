import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import styles from './index.scss';

@translate()
export default class NoData extends PureComponent {
  static propTypes = {
    type: PropTypes.string
  };

  static defaultProps = {
    type: 'Apps'
  };

  render() {
    const { type, t } = this.props;
    const iconMap = {
      Apps: 'appcenter',
      Clusters: 'cluster',
      Runtimes: 'stateful-set',
      Repos: 'stateful-set',
      Users: 'group',
      Categories: 'components',
      Events: 'tateful-set',
      Versions: 'tag'
    };
    let iconName = iconMap[type] || 'appcenter';

    return (
      <div className={styles.noData}>
        <Icon name={iconName} size={120} type={`light`} />
        <div className={styles.word}>{t('No search data')}</div>
      </div>
    );
  }
}
