import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import styles from './index.scss';

@translate()
export default class GroupCard extends PureComponent {
  static propTypes = {
    groups: PropTypes.array,
    selectValue: PropTypes.string,
    selectCard: PropTypes.func
  };

  static defaultProps = {
    groups: [],
    selectValue: ''
  };

  render() {
    const { groups, selectCard, selectValue, t } = this.props;
    return (
      <ul className={styles.groupCard}>
        {groups.map((data, index) => (
          <li
            key={data.id || index}
            onClick={() => {
              selectCard(data);
            }}
            className={classnames({ [styles.current]: data.value === selectValue })}
          >
            <div className={styles.name}>{t(data.name)}</div>
            {data.id && <div className={styles.id}>id:{data.id}</div>}
            <div className={styles.description}>{t(data.description)}</div>
          </li>
        ))}
      </ul>
    );
  }
}
