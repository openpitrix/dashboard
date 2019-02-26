import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
    const iconName = iconMap[type] || type;

    return (
      <div className={styles.noData}>
        <Icon name={iconName} size={84} type={`dark`} />
        <div className={styles.word}>{t('No data')}!</div>
      </div>
    );
  }
}
