import React from 'react';
import { Icon, Popover } from 'components/Base';

import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import LessText from 'components/LessText';

import { roleMap } from 'config/roles';

export default (t, renderHandleMenu) => {
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
    {
      title: t('Group'),
      key: 'group',
      render: item => <LessText txt={item.groupName} limit={10} />
    },
    {
      title: t('Role'),
      key: 'role',
      render: item => t(roleMap[item.role])
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
        <Popover portal content={renderHandleMenu(item)}>
          <Icon name="more" />
        </Popover>
      )
    });
  }

  return columns;
};
