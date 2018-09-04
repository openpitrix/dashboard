import React from 'react';
import { I18n } from 'react-i18next';

import TdName, { ProviderName } from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';

export default [
  {
    title: <I18n>{t => <span>{t('Repo Name')}</span>}</I18n>,
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
    title: <I18n>{t => <span>{t('Status')}</span>}</I18n>,
    key: 'status',
    width: '100px',
    render: item => <Status type={item.status} name={item.status} />
  },
  {
    title: <I18n>{t => <span>{t('Visibility')}</span>}</I18n>,
    key: 'visibility',
    render: item => item.visibility
  },
  {
    title: <I18n>{t => <span>{t('Provider')}</span>}</I18n>,
    key: 'repo_id',
    render: item =>
      item.providers.map(provider => (
        <ProviderName key={provider} name={provider} provider={provider} />
      ))
  },
  {
    title: <I18n>{t => <span>{t('Updated At')}</span>}</I18n>,
    key: 'status_time',
    width: '95px',
    render: item => <TimeShow time={item.status_time} type="lineTime" />
  }
];
