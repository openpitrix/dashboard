import React from 'react';
import { I18n } from 'react-i18next';

import TdName, { ProviderName } from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';

export default clusters => [
  {
    title: <I18n>{t => <span>{t('Runtime Name')}</span>}</I18n>,
    key: 'name',
    width: '155px',
    render: item => (
      <TdName
        name={item.name}
        description={item.runtime_id}
        linkUrl={`/dashboard/runtime/${item.runtime_id}`}
        noIcon
      />
    )
  },
  {
    title: <I18n>{t => <span>{t('Status')}</span>}</I18n>,
    key: 'status',
    render: item => <Status type={item.status} name={item.status} />
  },
  {
    title: <I18n>{t => <span>{t('Provider')}</span>}</I18n>,
    key: 'provider',
    render: item => (
      <ProviderName provider={item.provider} name={item.provider} />
    )
  },
  {
    title: <I18n>{t => <span>{t('Zone')}</span>}</I18n>,
    key: 'zone',
    render: item => item.zone
  },
  {
    title: <I18n>{t => <span>{t('Cluster Count')}</span>}</I18n>,
    key: 'node_count',
    render: item => clusters.filter(cluster => item.runtime_id === cluster.runtime_id).length
  },
  {
    title: <I18n>{t => <span>{t('User')}</span>}</I18n>,
    key: 'owner',
    render: item => item.owner
  },
  {
    title: <I18n>{t => <span>{t('Updated At')}</span>}</I18n>,
    key: 'status_time',
    width: '95px',
    render: item => <TimeShow time={item.status_time} />
  }
];
