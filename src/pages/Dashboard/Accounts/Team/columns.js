import React from 'react';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import { Icon, Popover } from 'components/Base';

import { roleMap } from 'config/roles';

export default (t, renderHandleMenu) => [
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
    render: item => t(roleMap[item.role])
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
  },
  {
    title: t('Actions'),
    key: 'actions',
    width: '84px',
    className: 'actions',
    render: item => (
      <Popover content={renderHandleMenu(item)} className="actions">
        <Icon name="more" />
      </Popover>
    )
  }
];
