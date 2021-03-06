import React from 'react';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import { PopoverIcon } from 'components/Base';

import { getRoleName } from 'config/roles';

export default (t, renderHandleMenu) => {
  const columns = [
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

  if (typeof renderHandleMenu === 'function') {
    columns.push({
      title: t('Actions'),
      key: 'actions',
      width: '84px',
      className: 'actions',
      render: item => (
        <PopoverIcon size="Large" portal content={renderHandleMenu(item)} />
      )
    });
  }

  return columns;
};

export const filterList = (t, store) => [
  {
    key: 'status',
    conditions: [
      { name: t('Activation'), value: 'active' },
      { name: t('Not activation'), value: 'deleted' }
    ],
    onChangeFilter: store.onChangeStatus,
    selectValue: store.selectStatus
  }
];
