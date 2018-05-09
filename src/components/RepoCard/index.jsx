import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AppImgs from '../Rectangle/AppImgs';
import TagShow from '../TagShow';
import styles from './index.scss';

export default class RepoCard extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    provider: PropTypes.string,
    imgArray: PropTypes.array,
    tags: PropTypes.array
  };

  render() {
    const { name, description, provider, imgArray, tags } = this.props;
    return (
      <div className={styles.repoCard}>
        <div className={styles.inner}>
          <div className={styles.column}>
            <div className={styles.titleName}>{name}</div>
            <div className={styles.description}>{description}</div>
          </div>
          <div className={styles.column}>
            <div className={styles.title}>Runtime Provider</div>
            <div className={styles.providerImg}>{provider}</div>
          </div>
          <div className={styles.column}>
            <AppImgs imgArray={imgArray} />
          </div>
        </div>
        <TagShow tags={tags} tagStyle="purple2Style" />
      </div>
    );
  }
}
