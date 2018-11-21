import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getObjName } from 'utils';
import styles from './index.scss';

export default class Progress extends PureComponent {
  static propTypes = {
    objs: PropTypes.array,
    progress: PropTypes.array,
    total: PropTypes.number,
    type: PropTypes.string
  };

  calLeft = (index, progress, total) => {
    let sum = 0;
    for (let i = 0; i < index; i++) {
      sum += progress[i].number;
    }
    return sum * 100.0 / total;
  };

  render() {
    const {
      progress, total, objs, type
    } = this.props;

    return (
      <div className={styles.progress}>
        {progress.map((data, index) => (
          <div
            key={data.id}
            className={styles.inner}
            style={{
              width: `${data.number * 100.0 / total}%`,
              left: `${this.calLeft(index, progress, total)}%`
            }}
          >
            <div className={styles.tips}>
              <span className={styles.arrow} />
              <div className={styles.number}>{data.number}</div>
              <div className={styles.name}>
                {type === 'Apps'
                  && getObjName(objs, 'repo_id', data.id, 'name')}
                {type === 'Clusters'
                  && getObjName(objs, 'runtime_id', data.id, 'name')}
                {type === 'Runtimes' && data.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
