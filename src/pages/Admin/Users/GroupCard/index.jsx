import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class GroupCard extends PureComponent {
  static propTypes = {
    groups: PropTypes.array,
    selectItem: PropTypes.number,
    selectCard: PropTypes.func
  };

  render() {
    const { groups, selectCard, selectItem } = this.props;
    return (
      <ul className={styles.groupCard}>
        {groups &&
          groups.map((data, index) => (
            <li
              key={data.id}
              onClick={() => {
                selectCard(index, name);
              }}
              className={classnames({ [styles.current]: selectItem === index })}
            >
              <div className={styles.name}>{data.name}</div>
              <div className={styles.id}>id:{data.id}</div>
              <div className={styles.description}>{data.description}</div>
            </li>
          ))}
      </ul>
    );
  }
}
