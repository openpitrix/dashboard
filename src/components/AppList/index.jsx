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
    appSearch: PropTypes.string
  };

  renderCategoryApps() {
    const { categoryTitle, appSearch, categoryApps } = this.props;
    const categoryShow = !categoryTitle && !appSearch && categoryApps;

    if (!categoryShow) {
      return null;
    }

    if (categoryShow) {
      return categoryApps.map((cate, idx) => {
        cate.apps = cate.apps || [];

        return (
          <div key={`${idx}-${cate.name}`} className={styles.categoryApps}>
            {cate.apps.length > 0 && (
              <CardTitle categoryId={cate.category_id} title={cate.name} more />
            )}

            {cate.apps.slice(0, 6).map(app => (
              <Link key={app.app_id} to={`/app/${app.app_id}`}>
                <Card icon={app.icon} name={app.name} desc={app.description} fold />
              </Link>
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
    const { apps, className, t } = this.props;

    return (
      <div className={classnames(styles.appList, className)}>
        {<CardTitle title={this.getSearchTitle()} more={false} />}

        {apps.map(app => (
          <Link key={app.app_id} to={`/app/${app.app_id}`}>
            <Card icon={app.icon} name={app.name} desc={app.description} />
          </Link>
        ))}

        {!apps.length && <div className={styles.noData}>{t('NO_SEARCH_DATA')}</div>}

        {this.renderCategoryApps()}
      </div>
    );
  }
}
