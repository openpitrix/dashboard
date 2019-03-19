import React from 'react';
import { Translation } from 'react-i18next';

import TimeShow from 'components/TimeShow';
import Status from 'components/Status';

export default [
  {
    title: <Translation>{t => <span>{t('Event Id')}</span>}</Translation>,
    key: 'repo_event_id',
    render: item => item.repo_event_id
  },
  {
    title: <Translation>{t => <span>{t('Status')}</span>}</Translation>,
    key: 'status',
    render: item => <Status type={item.status} transition={item.transition} />
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
