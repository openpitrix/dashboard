import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';

import Card from '../Card';
import CardTitle from '../Card/CardTitle';

import styles from './index.scss';

@withTranslation()
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
              app_id,
              name,
              icon,
              abstraction,
              description,
              app_version_types,
              company_name
            },
            idx
          ) => (
            <Card
              className={styles.card}
              icon={icon}
              name={name}
              desc={abstraction || description}
              link={`/apps/${app_id}`}
              key={idx}
              maintainer={company_name}
              type={app_version_types}
            />
          )
        )}

        {!apps.length && !isLoading && (
          <div className={styles.noData}>{t('NO_SEARCH_DATA')}</div>
        )}
      </div>
    );
  }
}
