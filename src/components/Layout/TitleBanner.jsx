import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { observer, inject } from 'mobx-react';

import { Image } from 'components/Base';
import SearchBox from 'pages/Home/SearchBox';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
class TitleBanner extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    hasSearch: PropTypes.bool,
    icon: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    icon: '',
    title: '',
    description: '',
    hasSearch: false
  };

  render() {
    const {
      icon, title, description, hasSearch, rootStore, t
    } = this.props;
    const { fixNav } = rootStore;

    return (
      <div
        className={classnames('banner', styles.titleBanner, {
          [styles.shrink]: fixNav
        })}
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

export default withRouter(TitleBanner);
