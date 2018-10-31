import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Card from '../Card';
import CardTitle from '../Card/CardTitle';

import styles from './index.scss';

@translate()
export default class AppList extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    apps: PropTypes.array,
    categoryApps: PropTypes.array,
    categoryTitle: PropTypes.string,
    appSearch: PropTypes.string,
    skipLink: PropTypes.string,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    apps: [],
    categoryApps: [],
    skipLink: 'apps',
    isLoading: false
  };

  renderCategoryApps() {
    const { categoryTitle, appSearch, categoryApps, skipLink } = this.props;
    const categoryShow = !categoryTitle && !appSearch && categoryApps;

    if (!categoryShow) {
      return null;
    }

    if (categoryShow) {
      return categoryApps.map(({ category_id, name, apps }) => {
        apps = apps || [];
        if(apps.length === 0) {
          return null;
        }

        return (
          <div key={category_id} className={styles.categoryApps}>
            {apps.length > 0 && (
              <CardTitle skipLink={skipLink} categoryId={category_id} title={name} more />
            )}

            {apps
              .slice(0, 6)
              .map(app => (
                <Card
                  key={app.app_id}
                  icon={app.icon}
                  name={app.name}
                  desc={app.description}
                  link={`/${skipLink}/${app.app_id}`}
                  fold
                />
              ))}
          </div>
        );
      });
    }
  }

  getSearchTitle() {
    let { appSearch, categoryTitle, t } = this.props;
    return (appSearch && t('search_results')) || categoryTitle || t('Newest');
  }

  render() {
    const { apps, className, skipLink, isLoading, t } = this.props;

    return (
      <div className={classnames(className)}>
        <div className={styles.appList}>
          {<CardTitle title={this.getSearchTitle()} more={false} />}

          {apps.map((app, idx) => (
            <Card
              icon={app.icon}
              name={app.name}
              desc={app.description}
              key={idx}
              link={`/${skipLink}/${app.app_id}`}
            />
          ))}

          {!apps.length && !isLoading && <div className={styles.noData}>{t('NO_SEARCH_DATA')}</div>}
        </div>

        {this.renderCategoryApps()}
      </div>
    );
  }
}
