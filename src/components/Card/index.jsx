import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';

import { Image } from 'components/Base';

import styles from './index.scss';

class Card extends PureComponent {
  static propTypes = {
    desc: PropTypes.string,
    fold: PropTypes.bool,
    icon: PropTypes.string,
    link: PropTypes.string,
    name: PropTypes.string
  };

  handleClick = () => {
    const { history, link } = this.props;

    history.push(link);
  };

  render() {
    const {
      icon, name, desc, fold
    } = this.props;
    const iconSize = fold ? 36 : 48;

    return (
      <div
        className={classnames(styles.card, { [styles.foldCard]: fold })}
        onClick={this.handleClick}
      >
        <div className={styles.title}>
          <span className={styles.icon}>
            <Image
              src={icon}
              alt="Icon"
              iconSize={iconSize}
              iconLetter={name}
            />
          </span>
          <p className={styles.name}>{name}</p>
          <p
            className={classnames(styles.desc, { [styles.hide]: !fold })}
            title={desc}
          >
            {desc}
          </p>
        </div>
        <div className={classnames(styles.line, { [styles.hide]: fold })} />
        <p
          className={classnames(styles.desc, { [styles.hide]: fold })}
          title={desc}
        >
          {desc}
        </p>
      </div>
    );
  }
}

export default withRouter(Card);
