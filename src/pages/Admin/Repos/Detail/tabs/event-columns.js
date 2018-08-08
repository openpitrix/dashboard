import React from 'react';
import { I18n } from 'react-i18next';

import TimeShow from 'components/TimeShow';

export default [
  {
    title: <I18n>{t => <span>{t('Event Id')}</span>}</I18n>,
    key: 'repo_event_id',
    render: item => item.repo_event_id
  },
  {
    title: <I18n>{t => <span>{t('Status')}</span>}</I18n>,
    key: 'status',
    render: item => item.status
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
