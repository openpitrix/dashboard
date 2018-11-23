import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AppImages from 'components/AppImages';
import CopyId from 'components/DetailCard/CopyId';
import styles from './index.scss';

export default class CategoryCard extends PureComponent {
  static propTypes = {
    apps: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    description: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  render() {
    const {
      title, description, apps, total, id
    } = this.props;

    return (
      <div className={styles.categoryCard}>
        <div className={styles.title} title={title}>
          <Link to={`/dashboard/category/${id}`}>{title}</Link>
        </div>
        <CopyId id={id} className={styles.idShow} />
        <div className={styles.description}>{description}</div>
        <AppImages apps={apps} total={total} />
      </div>
    );
  }
}
