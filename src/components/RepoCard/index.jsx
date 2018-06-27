import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AppImages from '../Rectangle/AppImages';
import TagShow from '../TagShow';
import styles from './index.scss';

export default class RepoCard extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    providers: PropTypes.array,
    images: PropTypes.array,
    tags: PropTypes.array
  };

  render() {
    const { name, description, providers, images, tags } = this.props;
    return (
      <div className={styles.repoCard}>
        <div className={styles.inner}>
          <div className={styles.column}>
            <div className={styles.titleName}>{name}</div>
            <div className={styles.description}>{description}</div>
          </div>
          <div className={styles.column}>
            <div className={styles.title}>Runtime Provider</div>
            <div className={styles.providerImg}>{providers && providers.join('\n')}</div>
          </div>
          <div className={styles.column}>
            <AppImages images={images} />
          </div>
        </div>
        <TagShow tags={tags} tagStyle="purple2" />
      </div>
    );
  }
}
