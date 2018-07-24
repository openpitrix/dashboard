import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Section from '../section';

import { formatTime } from 'utils';

import styles from './index.scss';

const Information = ({ app }) => {
  return (
    <Section title="Information" className={styles.information} contentClass={styles.content}>
      <dl>
        <dt>Catelog</dt>
        <dd>
          {get(app, 'category_set', [])
            .filter(cate => cate.category_id && cate.status === 'enabled')
            .map(cate => cate.name)
            .join(', ')}
        </dd>
      </dl>
      <dl>
        <dt>Application ID</dt>
        <dd>{app.app_id}</dd>
      </dl>
      <dl>
        <dt>Repo</dt>
        <dd>{app.repo_id}</dd>
      </dl>
      <dl>
        <dt>Created At</dt>
        <dd>{formatTime(app.create_time, 'YYYY-MM-DD HH:mm:ss')}</dd>
      </dl>
    </Section>
  );
};

Information.propTypes = {
  app: PropTypes.object
};

Information.defaultProps = {
  app: {}
};

export default Information;
