import React from 'react';

import TdName from 'components/TdName';
import Status from 'components/Status';
import Configuration from 'pages/Admin/Clusters/Detail/Configuration';
import { getObjName } from 'utils';

export default (clusters, t) => [
  {
    title: t('Name'),
    key: 'name',
    width: '155px',
    render: item => <TdName name={item.name} description={item.node_id} noIcon />
  },
  {
    title: t('Cluster Name'),
    key: 'cluster_id',
    render: item => (
      <TdName
        name={getObjName(clusters, 'cluster_id', item.cluster_id, 'name')}
        description={item.cluster_id}
        linkUrl={`/dashboard/cluster/${item.cluster_id}`}
        noIcon
      />
    )
  },
  {
    title: t('Status'),
    key: 'status',
    width: '102px',
    // fixme: prop type check case sensitive
    render: item => <Status type={(item.status + '').toLowerCase()} name={item.status} />
  },
  {
    title: t('Role'),
    key: 'role',
    dataIndex: 'role'
  },
  {
    title: t('Private IP'),
    key: 'private_ip',
    dataIndex: 'private_ip',
    width: '100px'
  },
  {
    title: t('Configuration'),
    key: 'configuration',
    width: '100px',
    render: item => <Configuration configuration={item.cluster_role || {}} />
  }
  // {
  //   title: t('Actions'),
  //   key: 'actions',
  //   width: '84px',
  //   render: item => (
  //     <div className={styles.actions}>
  //       <Popover className="actions">
  //         <Icon name="more"/>
  //       </Popover>
  //     </div>
  //   )
  // }
];
