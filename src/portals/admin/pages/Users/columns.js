import React from 'react';
import _ from 'lodash';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import LessText from 'components/LessText';
import { PopoverIcon } from 'components/Base';
import { getRoleName } from 'config/roles';

export default (t, renderHandleMenu, isAdmin) => {
  const columns = [
    {
      title: t('Status'),
      key: 'status',
      width: '90px',
      render: item => <Status type={item.status} name={item.status} />
    },
    {
      title: t('Username'),
      key: 'username',
      render: item => item.username
    },
    {
      title: t('Email'),
      key: 'email',
      render: item => item.email
    },
    isAdmin
      ? {
        title: t('Group'),
        key: 'group',
        render: item => <LessText txt={t(item.groupName)} limit={10} />
      }
      : null,
    isAdmin
      ? {
        title: t('Role'),
        key: 'role',
        render: item => t(getRoleName(_.get(item, 'role', {})))
      }
      : null,
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
      render: item => <PopoverIcon size="Large" portal content={renderHandleMenu(item)} />
    });
  }

  return _.without(columns, null);
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
