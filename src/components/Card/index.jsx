import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';

import { Image } from 'components/Base';
import { getVersionTypesName } from 'config/version-types';

import styles from './index.scss';

@translate()
export class Card extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    desc: PropTypes.string,
    fold: PropTypes.bool,
    icon: PropTypes.string,
    link: PropTypes.string,
    maintainer: PropTypes.string,
    name: PropTypes.string, // delivery type
    type: PropTypes.string
  };

  static defaultProps = {
    fold: false
  };

  handleClick = () => {
    const { history, link } = this.props;

    history.push(link);
  };

  transMaintainers(maint = '') {
    const { t } = this.props;
    if (!maint) {
      return t('unknown');
    }

    try {
      const names = [].concat(JSON.parse(maint));
      return names.map(item => item.name).join(', ');
    } catch (e) {
      return `${maint}`;
    }
  }

  render() {
    const {
      icon, name, desc, fold, maintainer, type, className, t
    } = this.props;

    const iconSize = fold ? 36 : 48;

    return (
      <div className={classnames(styles.card, className)} onClick={this.handleClick}>
        <div className={styles.icon}>
          <Image
            src={icon}
            alt="Icon"
            iconSize={iconSize}
            iconLetter={name}
          />
        </div>
        <div className={styles.name}>{name}</div>
        <div className={styles.desc} title={desc}>
          {desc}
        </div>
        <div className={styles.attrs}>
          <dl className={styles.maintainer}>
            <dt className={styles.label}>{t('Service provider')}:</dt>
            <dd className={styles.val}>{this.transMaintainers(maintainer)}</dd>
          </dl>
          <dl className={styles.type}>
            <dt className={styles.label}>{t('Delivery type')}:</dt>
            <dd className={styles.val}>
              {getVersionTypesName(type)}
            </dd>
          </dl>
        </div>
      </div>
    );
  }
}

export default withRouter(Card);
