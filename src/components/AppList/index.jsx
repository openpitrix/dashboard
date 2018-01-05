import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Card from '../Card';
import styles from './index.scss';

export default class AppList extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    fold: PropTypes.bool,
  }

  render() {
    const { apps, fold, className } = this.props;

    return (
      <div className={classnames(styles.appList, className)}>
        {
          apps && apps.map(app =>
            <Link key={app.id} to={`/app/${app.id}`}>
              <Card
                icon={app.icon}
                name={app.name}
                desc={app.description}
                fold={fold}
              />
            </Link>,
          )
        }
      </div>
    );
  }
}
