import React from 'react';
import TdName from 'components/TdName';
import Status from 'components/Status';
import Configuration from './Configuration';
import TimeShow from 'components/TimeShow';

export default function GetColumns({ t, provider }) {
  let columns = null;

  if (provider !== 'kubernetes') {
    columns = [
      {
        title: t('Name'),
        key: 'name',
        width: '130px',
        render: item => <TdName name={item.name} description={item.node_id} noIcon />
      },
      {
        title: t('Role'),
        key: 'role',
        dataIndex: 'role'
      },
      {
        title: t('Status'),
        key: 'status',
        render: item => <Status type={item.status} transition={item.transition_status} />
      },
      {
        title: t('Configuration'),
        key: 'configuration',
        width: '130px',
        render: item => <Configuration configuration={item.cluster_role || {}} />
      },
      {
        title: t('Private IP'),
        key: 'private_ip',
        dataIndex: 'private_ip',
        width: '100px'
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
  } else {
    return [
      {
        title: t('Name'),
        key: 'name',
        width: '130px',
        render: item => <TdName name={item.name} description={item.node_id} noIcon />
      }
    ];
  }

  return columns;
}
