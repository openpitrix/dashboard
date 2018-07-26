import React, { Fragment } from 'react';

import TdName from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import { Icon } from 'components/Base';

export default [
  {
    title: 'Version Name',
    key: 'name',
    render: obj => <TdName name={obj.name} description={obj.version_id} />
  },
  {
    title: 'Status',
    key: 'status',
    render: obj => <Status type={(obj.status + '').toLowerCase()} name={obj.status} />
  },
  // {
  //   title: 'Version ID',
  //   key: 'version_id',
  //   dataIndex: 'version_id',
  //   width: '100px'
  // },
  {
    title: 'Package',
    key: 'package_name',
    render: obj => (
      <a href={obj.package_name} target="_blank">
        <Icon name="download" />
      </a>
    )
  },
  {
    title: 'Date Created',
    key: 'create_time',
    dataIndex: 'create_time',
    render: item => <TimeShow time={item.status_time} />
  }
];
