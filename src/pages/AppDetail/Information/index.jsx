import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Section from '../section';

import { formatTime } from 'utils';
import { ProviderName } from 'components/TdName';
import styles from './index.scss';

const Information = ({ app, repo }) => {
  const repoName = get(repo, 'name', '');
  const repoProvider = get(repo, 'providers[0]', '');

  return (
    <Section title="Information" className={styles.information} contentClass={styles.content}>
      <dl>
        <dt>Category</dt>
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
        <dd>
          <ProviderName provider={repoProvider} name={repoName} className={styles.repoName} />
        </dd>
      </dl>
      <dl>
        <dt>Created At</dt>
        <dd>{formatTime(app.create_time, 'YYYY-MM-DD HH:mm:ss')}</dd>
      </dl>
    </Section>
  );
};

Information.propTypes = {
  app: PropTypes.object,
  repo: PropTypes.object
};

Information.defaultProps = {
  app: {},
  repo: {}
};

export default Information;
