import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon, Image } from 'components/Base';

import styles from './index.scss';

export default class Card extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    desc: PropTypes.string,
    fold: PropTypes.bool
  };

  render() {
    const { icon, name, desc, fold } = this.props;
    const iconSize = fold ? 36 : 48;
    const iconsrc = '/assets/None' + iconSize + '.svg';

    return (
      <div className={classnames(styles.card, { [styles.foldCard]: fold })}>
        <div className={styles.title}>
          <Image src={icon || iconsrc} className={styles.icon} alt="Icon" size={iconSize} />
          <p className={styles.name}>{name}</p>
          <p className={classnames(styles.desc, { [styles.hide]: !fold })} title={desc}>
            {desc}
          </p>
        </div>
        <div className={classnames(styles.line, { [styles.hide]: fold })} />
        <p className={classnames(styles.desc, { [styles.hide]: fold })} title={desc}>
          {desc}
        </p>
      </div>
    );
  }
}
