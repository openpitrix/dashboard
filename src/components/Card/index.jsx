import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Card extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    desc: PropTypes.string,
    fold: PropTypes.bool,
  }

  render() {
    const { icon, name, desc, fold } = this.props;
    return (
      <div className={classnames(styles.card, { [styles.foldCard]: fold })}>
        <img src={icon || 'http://via.placeholder.com/96x96'} className={styles.icon} alt="Icon"/>
        <div className={styles.line}></div>
        <p className={styles.name}>{name}</p>
        <p className={styles.desc}>{desc}</p>
      </div>
    );
  }
}
