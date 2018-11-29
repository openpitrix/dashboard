import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Icon, Link } from 'components/Base';

import styles from './index.scss';

@translate()
@observer
export default class CreateAppCard extends Component {
  static propTypes = {
    appCreateStore: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    intro: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string
  };

  render() {
    const {
      name,
      value,
      icon,
      intro,
      className,
      t,
      appCreateStore
    } = this.props;
    const { attribute, selectVersionType, checkAddedDelivery } = appCreateStore;
    const { version_type } = attribute;
    const isAdded = checkAddedDelivery(value);

    return (
      <div
        onClick={() => selectVersionType(value)}
        className={classNames(styles.container, className, {
          [styles.addedContainer]: isAdded
        })}
      >
        {isAdded && <span className={styles.addedType}>{t('Added')} </span>}
        {value === version_type && (
          <Icon
            className={styles.checkedIcon}
            name="checked-circle"
            size={20}
          />
        )}
        <Icon name={icon} size={48} className={styles.icon} type={'light'} />
        <div className={styles.name}>{name}</div>
        <div className={styles.intro}>{t(intro)}</div>
        <Link type={'Create_App_Linkto_Intro_App'} isExternal={true}>
          {t('Linkto_Intro_App')}
          <Icon
            className={styles.linkIcon}
            name="next-icon"
            type="light"
            size={20}
          />
        </Link>
      </div>
    );
  }
}
