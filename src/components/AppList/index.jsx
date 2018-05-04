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
    fold: PropTypes.bool
  };

  render() {
    const { apps, fold, className } = this.props;
    const title = 'Catalog Title';
    const moreFlag = true;

    return (
      <div className={classnames(styles.appList, className)}>
        <CardTitle title={title} more={moreFlag} />
        {apps &&
          apps.map(app => (
            <Link key={app.app_id} to={`/app/${app.app_id}`}>
              <Card icon={app.icon} name={app.name} desc={app.description} fold={fold} />
            </Link>
          ))}
      </div>
    );
  }
}
