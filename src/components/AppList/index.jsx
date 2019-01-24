import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import Card from '../Card';
import CardTitle from '../Card/CardTitle';

import styles from './index.scss';

@translate()
export default class AppList extends PureComponent {
  static propTypes = {
    apps: PropTypes.array,
    className: PropTypes.string,
    fixNav: PropTypes.bool,
    isLoading: PropTypes.bool,
    search: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    apps: [],
    isLoading: false
  };

  getSearchTitle() {
    const { search, title, t } = this.props;
    if (search) {
      return t('search_results');
    }

    return title || t('Newest');
  }

  render() {
    const {
      apps, className, isLoading, fixNav, t
    } = this.props;

    return (
      <div
        className={classnames(
          styles.appList,
          {
            [styles.fixNav]: !fixNav
          },
          className
        )}
      >
        {<CardTitle title={this.getSearchTitle()} more={false} />}

        {apps.map(
          (
            {
              app_id, name, icon, description, app_version_types, maintainers
            },
            idx
          ) => (
            <Card
              icon={icon}
              name={name}
              desc={description}
              link={`/apps/${app_id}`}
              key={idx}
              maintainer={maintainers}
              type={app_version_types}
            />
          )
        )}

        {!apps.length
          && !isLoading && (
            <div className={styles.noData}>{t('NO_SEARCH_DATA')}</div>
        )}
      </div>
    );
  }
}
