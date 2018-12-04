import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Icon, DocLink } from 'components/Base';

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
    const {
      selectVersionType,
      checkAddedVersionType,
      checkSelectedVersionType
    } = appCreateStore;
    const isAdded = checkAddedVersionType(value);
    const isSelected = checkSelectedVersionType(value);

    return (
      <div
        onClick={() => !isAdded && selectVersionType(value)}
        className={classNames(styles.container, className, {
          [styles.addedContainer]: isAdded
        })}
      >
        {isAdded && <span className={styles.addedType}>{t('Added')} </span>}
        {isSelected && (
          <Icon
            className={styles.checkedIcon}
            name="checked-circle"
            size={20}
          />
        )}
        <Icon name={icon} size={48} className={styles.icon} type={'light'} />
        <div className={styles.name}>{name}</div>
        <div className={styles.intro}>{t(intro)}</div>
        <DocLink name={'Create_App_Linkto_Intro_App'}>
          {t('Linkto_Intro_App')}
          <Icon
            className={styles.linkIcon}
            name="next-icon"
            type="light"
            size={20}
          />
        </DocLink>
      </div>
    );
  }
}
