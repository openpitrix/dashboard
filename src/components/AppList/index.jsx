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
    isLoading: PropTypes.bool,
    search: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    apps: [],
    categoryApps: [],
    isLoading: false
  };

  getSearchTitle() {
    const { search, title, t } = this.props;
    return (search && t('search_results')) || title || t('Newest');
  }

  render() {
    const {
      apps, className, isLoading, t
    } = this.props;

    return (
      <div className={classnames(className)}>
        <div className={styles.appList}>
          {<CardTitle title={this.getSearchTitle()} more={false} />}

          {apps.map(({
            app_id, name, icon, description
          }, idx) => (
            <Card
              icon={icon}
              name={name}
              desc={description}
              key={idx}
              link={`/apps/${app_id}`}
            />
          ))}

          {!apps.length
            && !isLoading && (
              <div className={styles.noData}>{t('NO_SEARCH_DATA')}</div>
          )}
        </div>
      </div>
    );
  }
}
