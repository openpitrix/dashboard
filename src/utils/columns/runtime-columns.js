import React from 'react';
import { Translation } from 'react-i18next';

import TdName, { ProviderName } from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import routes, { toRoute } from 'routes';

export default clusters => [
  {
    title: <Translation>{t => <span>{t('Runtime Name')}</span>}</Translation>,
    key: 'name',
    width: '155px',
    render: item => (
      <TdName
        name={item.name}
        description={item.runtime_id}
        linkUrl={toRoute(routes.portal.runtimes)}
        noIcon
      />
    )
  },
  {
    title: <Translation>{t => <span>{t('Status')}</span>}</Translation>,
    key: 'status',
    render: item => <Status type={item.status} name={item.status} />
  },
  {
    title: <Translation>{t => <span>{t('Provider')}</span>}</Translation>,
    key: 'provider',
    render: item => (
      <ProviderName provider={item.provider} name={item.provider} />
    )
  },
  {
    title: <Translation>{t => <span>{t('Zone')}</span>}</Translation>,
    key: 'zone',
    render: item => item.zone
  },
  {
    title: <Translation>{t => <span>{t('Cluster Count')}</span>}</Translation>,
    key: 'node_count',
    render: item => clusters.filter(cluster => item.runtime_id === cluster.runtime_id).length
  },
  {
    title: <Translation>{t => <span>{t('User')}</span>}</Translation>,
    key: 'owner',
    render: item => item.owner
  },
  {
    title: <Translation>{t => <span>{t('Updated At')}</span>}</Translation>,
    key: 'status_time',
    width: '95px',
    render: item => <TimeShow time={item.status_time} />
  }
];
