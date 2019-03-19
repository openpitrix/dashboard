import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { toRoute } from 'routes';
import pathLink from './path-link';

import styles from './index.scss';

@withTranslation()
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

  genPath = (path, end = false) => {
    const { t } = this.props;

    if (!end) {
      if (pathLink[path] !== undefined) {
        return (
          <label>
            <Link to={toRoute(pathLink[path])}>{t(path)}</Link>
            <span> / </span>
          </label>
        );
      }
      return (
        <label>
          <span>{t(path)}</span>
          <span> / </span>
        </label>
      );
    }
    return <label>{t(path)}</label>;
  };

  render() {
    const { children, linkPath } = this.props;
    const paths = linkPath.split('>').map(s => s.trim());
    const linkLen = paths.length - 1;

    return (
      <div className={styles.breadCrumb}>
        {paths.map((path, index) => (
          <Fragment key={index}>
            {this.genPath(path, linkLen === index)}
          </Fragment>
        ))}
        {children}
      </div>
    );
  }
}
