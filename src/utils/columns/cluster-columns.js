import React from 'react';
import { Translation } from 'react-i18next';

import TdName, { ProviderName } from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import { getObjName } from 'utils';
import routes, { toRoute } from 'routes';

export default (runtimes, versions) => [
  {
    title: <Translation>{t => <span>{t('Cluster Name')}</span>}</Translation>,
    key: 'name',
    render: ({ name, cluster_id }) => (
      <TdName
        name={name}
        description={cluster_id}
        linkUrl={toRoute(routes.portal.clusterDetail, {
          clusterId: cluster_id
        })}
      />
    )
  },
  {
    title: <Translation>{t => <span>{t('Status')}</span>}</Translation>,
    key: 'status',
    width: '80px',
    render: obj => (
      <Status type={`${obj.status}`.toLowerCase()} name={obj.status} />
    )
  },
  {
    title: <Translation>{t => <span>{t('App Version')}</span>}</Translation>,
    key: 'version_id',
    width: '100px',
    render: obj => getObjName(versions, 'version_id', obj.version_id, 'name')
  },
  {
    title: <Translation>{t => <span>{t('Node Count')}</span>}</Translation>,
    key: 'cluster_node_set',
    render: ({ cluster_node_set }) => cluster_node_set && cluster_node_set.length
  },
  {
    title: <Translation>{t => <span>{t('Runtime')}</span>}</Translation>,
    key: 'runtime_id',
    width: '100px',
    render: obj => (
      <ProviderName
        name={getObjName(runtimes, 'runtime_id', obj.runtime_id, 'name')}
        provider={getObjName(
          runtimes,
          'runtime_id',
          obj.runtime_id,
          'provider'
        )}
      />
    )
  },
  {
    title: <Translation>{t => <span>{t('User')}</span>}</Translation>,
    key: 'owner',
    dataIndex: 'owner'
  },
  {
    title: <Translation>{t => <span>{t('Date Created')}</span>}</Translation>,
    key: 'create_time',
    width: '90px',
    render: item => <TimeShow time={item.status_time} />
  }
];
