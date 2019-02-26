import React from 'react';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';

import { getRoleName } from 'config/roles';

export default t => [
  {
    title: t('Username'),
    key: 'name',
    render: item => item.username
  },
  {
    title: t('Email'),
    key: 'email',
    render: item => item.email
  },
  {
    title: t('Role'),
    key: 'role',
    render: item => t(getRoleName(item.role, 'isv'))
  },
  {
    title: t('Status'),
    key: 'status',
    width: '90px',
    render: item => <Status type={item.status} name={item.status} />
  },
  {
    title: t('Updated At'),
    key: 'update_time',
    render: item => <TimeShow time={item.status_time} />
  }
];
