import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18next';

import { Icon } from 'components/Base';
import styles from './index.scss';

export default class TotalCard extends PureComponent {
  static propTypes = {
    iconName: PropTypes.string,
    iconSize: PropTypes.number,
    name: PropTypes.string,
    total: PropTypes.number
  };

  static defaultProps = {
    iconSize: 32
  };

  render() {
    const { iconName, name, total, iconSize, ...rest } = this.props;

    return (
      <I18n>
        {t => (
          <div className={styles.totalCard} {...rest}>
            <div className={styles.name}>
              <Icon name={iconName} size={iconSize} type="coloured" />
              {t(name)}
            </div>
            <div className={styles.number}>{total}</div>
          </div>
        )}
      </I18n>
    );
  }
}
