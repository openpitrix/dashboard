import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';

import { Image } from 'components/Base';
import { getVersionTypesName } from 'config/version-types';

import styles from './index.scss';

@translate()
class Card extends PureComponent {
  static propTypes = {
    canToggle: PropTypes.bool,
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

  renderContent() {
    const {
      icon, name, desc, fold, maintainer, type, t
    } = this.props;
    const iconSize = fold ? 36 : 48;

    return (
      <Fragment>
        <div className={styles.basicCard}>
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
          <p
            className={classnames(styles.desc, { [styles.hide]: fold })}
            title={desc}
          >
            {desc}
          </p>
        </div>

        <div className={styles.toggleCard}>
          <div className={styles.title}>
            <span className={styles.icon}>
              <Image src={icon} alt="Icon" iconSize={36} iconLetter={name} />
            </span>
            <p className={styles.name}>{name}</p>
          </div>
          <p className={styles.desc} title={desc}>
            {desc}
          </p>
          <p className={styles.maintainer}>
            <span className={styles.label}>{t('Service provider')}: </span>
            <span>{this.transMaintainers(maintainer)}</span>
          </p>
          <p className={styles.type}>
            <span className={styles.label}>{t('Delivery type')}: </span>
            <span>{getVersionTypesName(type)}</span>
          </p>
        </div>
      </Fragment>
    );
  }

  render() {
    const {
      icon, name, desc, fold, className, canToggle
    } = this.props;
    const iconSize = fold ? 36 : 48;

    return (
      <div
        className={classnames(
          styles.card,
          {
            [styles.foldCard]: fold,
            [styles.canToggle]: canToggle
          },
          className
        )}
        onClick={this.handleClick}
      >
        {this.renderContent()}
      </div>
    );
  }
}

export default withRouter(Card);
