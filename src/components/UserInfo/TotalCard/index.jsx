import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { imgPlaceholder } from 'src/utils';
import { I18n } from 'react-i18next';

import styles from './index.scss';

export default class TotalCard extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    total: PropTypes.number
  };

  static defaultProps = {
    icon: imgPlaceholder()
  };

  render() {
    const { icon, name, total, ...rest } = this.props;

    return (
      <I18n>
        {t => (
          <div className={styles.totalCard} {...rest}>
            <div className={styles.name}>
              <img src={icon} />
              {t(name)}
            </div>
            <div className={styles.number}>{total}</div>
          </div>
        )}
      </I18n>
    );
  }
}
