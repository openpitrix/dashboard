import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Image } from 'components/Base';
import styles from './index.scss';

@translate()
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

  onSearch = async value => {
    this.props.history.push(`/store/search/${value}`);
  };

  onClearSearch = async () => {
    this.props.history.push('/');
  };

  render() {
    const {
      icon, title, description, t
    } = this.props;

    return (
      <div className={styles.titleBanner}>
        <div className={styles.wrapper}>
          {Boolean(icon) && (
            <span className={styles.image}>
              <Image src={icon} iconSize={48} iconLetter={title} />
            </span>
          )}
          <div className={styles.name}>{t(title)}</div>
          <div className={styles.description}>{t(description)}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(TitleBanner);
