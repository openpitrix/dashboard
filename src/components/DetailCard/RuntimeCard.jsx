import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Status from '../Status';
import TagShow from '../TagShow';
import { getParseDate } from 'utils';
import styles from './index.scss';

export default class RuntimeCard extends PureComponent {
  static propTypes = {
    detail: PropTypes.object.isRequired,
    appCount: PropTypes.number
  };

  render() {
    const { detail, appCount } = this.props;
    return (
      <div className={styles.detailCard}>
        <div className={classnames(styles.title, styles.noImg)}>
          <div className={styles.name}>{detail.name}</div>
          <div className={styles.id}>id:{detail.runtime_id || detail.repo_id}</div>
          <div className={styles.description}>{detail.description}</div>
        </div>
        <ul className={styles.detail}>
          <li>
            <span className={styles.name}>Status</span>
            <Status name={detail.status} type={detail.status} />
          </li>
          <li>
            <span className={styles.name}>Runtime Provider</span>
            {detail.repo_id && detail.providers.map(data => <span key={data}>{data}</span>)}
            {detail.runtime_id && <span>{detail.provider}</span>}
          </li>
          <li>
            <span className={styles.name}>Visibility</span>
            {detail.visibility}
          </li>
          <li>
            <span className={styles.name}>Creator</span>
            {detail.owner}
          </li>
          <li>
            <span className={styles.name}>App Count</span>
            {appCount}
          </li>
          <li>
            <span className={styles.name}>Labels</span>
            <div className={styles.labels}>
              {detail.labels && <TagShow tags={detail.labels.slice()} tagStyle="purple" />}
            </div>
          </li>
          <li>
            <span className={styles.name}>Date Updated</span>
            {getParseDate(detail.status_time)}
          </li>
        </ul>
      </div>
    );
  }
}
