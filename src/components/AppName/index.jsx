import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Image } from 'components/Base';
import styles from './index.scss';

@translate()
export default class AppName extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    linkUrl: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    versionName: PropTypes.string
  };

  render() {
    const {
      className, icon, name, linkUrl, type, versionName
    } = this.props;

    return (
      <div className={classnames(styles.appName, className)}>
        <span className={styles.image}>
          <Image src={icon} iconLetter={name} iconSize={40} />
        </span>

        <span className={styles.info}>
          {linkUrl ? (
            <Link to={linkUrl} title={name} className={styles.name}>
              {name}
            </Link>
          ) : (
            <div title={name} className={styles.name}>
              {name}
            </div>
          )}

          {Boolean(type || versionName) && (
            <div className={styles.description}>
              <span className={styles.type}>{type}</span>
              &nbsp;/&nbsp;<span className={styles.versionName}>
                {versionName}
              </span>
            </div>
          )}
        </span>
      </div>
    );
  }
}
