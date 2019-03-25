import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { Image, Icon } from 'components/Base';
import Status from 'components/Status';
import TdName from 'components/TdName';
import TimeShow from 'components/TimeShow';
import { getVersionTypesName } from 'config/version-types';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

const clusterLink = id => toRoute(routes.portal.clusterDetail, { clusterId: id });

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
    width: '220px',
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
              to={
                isDev
                  ? toRoute(routes.portal.appDetail, { appId: app_id })
                  : toRoute(routes.appDetail, { appId: app_id })
              }
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
    width: '180px',
    render: cl => <TimeShow time={cl.create_time} />
  }
];

export default columns;

export const frontgateCols = t => [
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
    render: cl => <TdName name={cl.name} description={cl.cluster_id} noIcon />
  },
  {
    title: t('Subnet'),
    key: 'Subnet',
    width: '155px',
    render: cl => cl.subnet_id
  },
  {
    title: t('IP address'),
    key: 'ip_address',
    width: '155px',
    render: cl => {
      const nodeSet = _.get(cl, 'cluster_node_set[0]');
      if (!nodeSet) return null;

      return (
        <Fragment>
          {nodeSet.private_ip && (
            <div title={t('Private network IP')}>
              <Icon name="ip" type="dark" />
              {nodeSet.private_ip}
            </div>
          )}
          {nodeSet.eip && (
            <div className="eip" title={t('Public network IP')}>
              <Icon name="eip" type="dark" />
              {nodeSet.eip}
            </div>
          )}
        </Fragment>
      );
    }
  },
  {
    title: t('Configuration'),
    key: 'Configuration',
    width: '155px',
    render: cl => {
      const roleSet = _.get(cl, 'cluster_role_set[0]');
      if (!roleSet) return null;
      const text = `${roleSet.cpu}-Core ${roleSet.memory / 1024}GB ${
        roleSet.storage_size
      }GB`;

      return <div>{text}</div>;
    }
  },
  {
    title: t('Created At'),
    key: 'create_time',
    width: '180px',
    render: cl => <TimeShow time={cl.create_time} />
  }
];
