import React, { PureComponent, Fragment } from 'react';
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
      return categoryApps.map(data => {
        data.apps = data.apps || [];
        return (
          <Fragment key={data.category_id}>
            {data.apps && (
              <CardTitle
                categoryId={data.category_id}
                title={data.name}
                more={true}
                moreApps={moreApps}
              />
            )}
            {data.apps.slice(0, 6).map(app => (
              <Link key={app.app_id} to={`/app/${app.app_id}`}>
                <Card icon={app.icon} name={app.name} desc={app.description} fold={true} />
              </Link>
            ))}
          </Fragment>
        );
      });
    }
  }

  getSearchTitlte() {
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
        {apps && <CardTitle title={this.getSearchTitlte()} more={false} />}
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
