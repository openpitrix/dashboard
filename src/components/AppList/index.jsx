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
    appSearch: PropTypes.string,
    moreApps: PropTypes.func
  };

  render() {
    const { apps, categoryApps, className, categoryTitle, appSearch, moreApps } = this.props;
    let title = categoryTitle ? categoryTitle : 'Newest';
    if (appSearch) {
      title = 'There are ' + apps.length + ' applications with search word "' + appSearch + '"';
    }
    const categoryShow = !categoryTitle && !appSearch && categoryApps;

    return (
      <div className={classnames(styles.appList, className)}>
        {apps && <CardTitle title={title} more={false} />}
        {apps.map(app => (
          <Link key={app.app_id} to={`/app/${app.app_id}`}>
            <Card icon={app.icon} name={app.name} desc={app.description} />
          </Link>
        ))}
        {apps.length == 0 && <div className={styles.noData}>No Application Data!</div>}

        {categoryShow &&
          categoryApps.map(data => (
            <Fragment key={data.category_id}>
              {data.showFlag && (
                <CardTitle
                  categoryId={data.category_id}
                  title={data.name}
                  more={true}
                  moreApps={moreApps}
                />
              )}
              {data.showFlag &&
                data.apps.slice(0, 6).map(app => (
                  <Link key={app.app_id} to={`/app/${app.app_id}`}>
                    <Card icon={app.icon} name={app.name} desc={app.description} fold={true} />
                  </Link>
                ))}
            </Fragment>
          ))}
      </div>
    );
  }
}
