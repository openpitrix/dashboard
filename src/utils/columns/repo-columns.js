import React from 'react';
import { Translation } from 'react-i18next';

import TdName, { ProviderName } from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';

export default [
  {
    title: <Translation>{t => <span>{t('Repo Name')}</span>}</Translation>,
    key: 'name',
    width: '155px',
    render: item => (
      <TdName
        name={item.name}
        description={item.repo_id}
        linkUrl={`/dashboard/repo/${item.repo_id}`}
      />
    )
  },
  {
    title: <Translation>{t => <span>{t('Status')}</span>}</Translation>,
    key: 'status',
    width: '100px',
    render: item => <Status type={item.status} name={item.status} />
  },
  {
    title: <Translation>{t => <span>{t('Visibility')}</span>}</Translation>,
    key: 'visibility',
    render: item => item.visibility
  },
  {
    title: <Translation>{t => <span>{t('Provider')}</span>}</Translation>,
    key: 'repo_id',
    render: item => item.providers.map(provider => (
        <ProviderName key={provider} name={provider} provider={provider} />
    ))
  },
  {
    title: <Translation>{t => <span>{t('Updated At')}</span>}</Translation>,
    key: 'status_time',
    width: '95px',
    render: item => <TimeShow time={item.status_time} />
  }
];
