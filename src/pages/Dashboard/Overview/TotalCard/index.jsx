import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Translation } from 'react-i18next';

import { Icon } from 'components/Base';
import { Panel } from 'components/Layout';

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
    const {
      iconName, name, total, iconSize, ...rest
    } = this.props;

    return (
      <Translation>
        {t => (
          <Panel>
            <div className={styles.totalCard} {...rest}>
              <div className={styles.name}>
                <Icon name={iconName} size={iconSize} type={'light'} />
                {t(name)}
              </div>
              <div className={styles.number}>{total}</div>
            </div>
          </Panel>
        )}
      </Translation>
    );
  }
}
