import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';

import { Image } from 'components/Base';
import SearchBox from 'pages/Home/SearchBox';

import styles from './index.scss';

@translate()
@inject('rootStore')
@observer
export default class TitleBanner extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    hasSearch: PropTypes.bool,
    icon: PropTypes.string,
    stretch: PropTypes.bool,
    title: PropTypes.string
  };

  static defaultProps = {
    icon: '',
    title: '',
    description: '',
    hasSearch: false,
    stretch: false
  };

  render() {
    const {
      icon,
      title,
      description,
      hasSearch,
      className,
      stretch,
      rootStore,
      t
    } = this.props;

    return (
      <div
        className={classnames(
          'banner',
          styles.titleBanner,
          {
            [styles.stretch]: stretch,
            [styles.shrink]: rootStore.fixNav
          },
          className
        )}
      >
        <div className={styles.wrapper}>
          <div className={styles.words}>
            {Boolean(icon) && (
              <span className={styles.image}>
                <Image src={icon} iconSize={48} iconLetter={title} />
              </span>
            )}
            <div className={styles.name}>{t(title)}</div>
            <div className={styles.description}>{t(description)}</div>
          </div>

          {hasSearch && <SearchBox className={styles.search} />}
        </div>
      </div>
    );
  }
}
