import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { toUrl } from 'utils/url';
import pathLink from './path-link';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user
}))
@observer
export default class BreadCrumb extends Component {
  static propTypes = {
    linkPath: PropTypes.string
  };

  static defaultProps = {
    linkPath: ''
  };

  render() {
    const {
      children, linkPath, user, t
    } = this.props;
    const paths = linkPath.split('>').map(s => s.trim());
    const linkLen = paths.length - 1;
    const pathToLink = pathLink(user.isDev);

    return (
      <div className={styles.breadCrumb}>
        {paths.map((path, index) => (
          <Fragment key={path}>
            {index !== linkLen && (
              <label>
                <Link to={toUrl(pathToLink[path]) || '/'}>{t(path)}</Link> /{' '}
              </label>
            )}
            {index === linkLen && <label>{t(path)}</label>}
          </Fragment>
        ))}
        {children}
      </div>
    );
  }
}
