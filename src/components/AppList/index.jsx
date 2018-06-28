import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Card from '../Card';
import CardTitle from '../Card/CardTitle';
import styles from './index.scss';

export default class AppList extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    apps: PropTypes.array,
    categoryApps: PropTypes.array,
    categoryTitle: PropTypes.string,
    appSearch: PropTypes.string,
    isCategorySearch: PropTypes.bool,
    moreApps: PropTypes.func
  };

  renderCategoryApps() {
    const { categoryTitle, appSearch, moreApps, categoryApps, isCategorySearch } = this.props;
    const categoryShow = !categoryTitle && !appSearch && categoryApps;

    if (isCategorySearch) {
      return null;
    }

    if (categoryShow) {
      return categoryApps.map((cate, idx) => {
        cate.apps = cate.apps || [];

        return (
          <div key={`${idx}-${cate.name}`}>
            <CardTitle categoryId={cate.category_id} title={cate.name} more moreApps={moreApps} />

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
    let { apps, appSearch, categoryTitle = 'Newest' } = this.props;
    return (
      (appSearch && `There are ${apps.length} applications with search word: ${appSearch}`) ||
      categoryTitle
    );
  }

  render() {
    const { apps, className } = this.props;

    return (
      <div className={classnames(styles.appList, className)}>
        {apps && <CardTitle title={this.getSearchTitle()} more={false} />}

        {apps.map(app => (
          <Link key={app.app_id} to={`/app/${app.app_id}`}>
            <Card icon={app.icon} name={app.name} desc={app.description} />
          </Link>
        ))}

        {!apps.length && <div className={styles.noData}>No Application Data!</div>}

        {this.renderCategoryApps()}
      </div>
    );
  }
}
