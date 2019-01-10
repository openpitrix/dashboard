import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { Image } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import TimeShow from 'components/TimeShow';
import { toUrl } from 'utils/url';
import { getVersionTypesName } from 'config/version-types';

import styles from './index.scss';

const clusterLink = id => toUrl(`/:dash/cluster/${id}`);

const columns = (t, apps, isDev) => [
  {
    title: t('Status'),
    key: 'status',
    width: '100px',
    render: cl => <Status type={cl.status} transition={cl.transition_status} />
  },
  {
    title: t('Instance Name ID'),
    key: 'name',
    width: '155px',
    render: cl => (
      <TdName
        name={cl.name}
        description={cl.cluster_id}
        linkUrl={clusterLink(cl.cluster_id)}
        noIcon
      />
    )
  },
  {
    title: t('App / Delivery type / Version'),
    key: 'app_id',
    width: '150px',
    render: cl => {
      const app = _.find(apps, { app_id: cl.app_id }) || {};
      const {
        name, icon, app_id, app_version_types
      } = app;

      return (
        <span className={styles.colItems}>
          <span className={styles.icon}>
            <Image src={icon} iconLetter={name} />
            <Link
              to={isDev ? toUrl(`/:dash/app/${app_id}`) : `/store/${app_id}`}
            >
              {name}
            </Link>
          </span>
          <span className={styles.type}>
            {getVersionTypesName(app_version_types)}
          </span>
          <span className={styles.version}>
            {_.get(app, 'latest_app_version.name')}
          </span>
        </span>
      );
    }
  },
  {
    title: t('Node Count'),
    key: 'node_count',
    width: '80px',
    render: cl => (cl.cluster_node_set && cl.cluster_node_set.length) || 0
  },
  {
    title: t('Created At'),
    key: 'create_time',
    width: '80px',
    render: cl => <TimeShow time={cl.create_time} />
  }
];

export default columns;
