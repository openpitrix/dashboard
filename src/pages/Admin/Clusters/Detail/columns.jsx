import React from 'react';

import { Icon, Popover } from 'components/Base';
import TdName from 'components/TdName';
import Status from 'components/Status';
import Configuration from './Configuration';
import TimeShow from 'components/TimeShow';

/* import styles from 'index.scss'; */

export default function GetColumns({ t, clusterStore, clusterDetailStore, isKubernetes }) {
  let columns = null;

  if (!isKubernetes) {
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
    const { onChangeExtend, extendedRowKeys } = clusterDetailStore;
    return [
      {
        title: t('Name'),
        key: 'name',
        width: '220px',
        render: (item, row, index) => (
          <TdName
            name={item.name}
            noIcon={true}
            noCopy={true}
            noDescription={true}
            onExtendedChange={onChangeExtend}
            rowKey={index.toString()}
            isFold={true}
            fold={extendedRowKeys.includes(index.toString())}
            linkUrl={`/dashboard/app/${item.app_id}`}
          />
        )
      },
      {
        title: t('Status'),
        key: 'status',
        width: '400px',
        render: item => (
          <Status type={item.status.toLowerCase()} name={`${t(item.status)} ${item.statusText}`} />
        )
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '400px',
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: t(''),
        key: 'action',
        width: '0px',
        render: null
      }
    ];
  }

  return columns;
}
