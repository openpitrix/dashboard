import React from 'react';
import { I18n } from 'react-i18next';
import { get } from 'lodash';

import TdName from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';

export default [
  {
    title: <I18n>{t => <span>{t('App Name')}</span>}</I18n>,
    key: 'name',
    width: '190px',
    render: item => (
      <TdName
        name={item.name}
        description={item.app_id}
        image={item.icon || 'appcenter'}
        linkUrl={`/dashboard/app/${item.app_id}`}
      />
    )
  },
  {
    title: <I18n>{t => <span>{t('Latest Version')}</span>}</I18n>,
    key: 'latest_version',
    width: '116px',
    render: item => get(item, 'latest_app_version.name', '')
  },
  {
    title: <I18n>{t => <span>{t('Status')}</span>}</I18n>,
    key: 'status',
    width: '100px',
    render: item => <Status type={item.status} name={item.status} />
  },
  {
    title: <I18n>{t => <span>{t('Categories')}</span>}</I18n>,
    key: 'category',
    render: item =>
      get(item, 'category_set', [])
        .filter(cate => cate.category_id && cate.status === 'enabled')
        .map(cate => cate.name)
        .join(', ')
  },
  {
    title: <I18n>{t => <span>{t('Developer')}</span>}</I18n>,
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
