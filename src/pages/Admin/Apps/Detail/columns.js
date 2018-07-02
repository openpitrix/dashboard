import React from 'react';
import TdName from 'components/TdName';
import Status from 'components/Status';
import { getParseDate } from 'utils';

export default [
  {
    title: 'Cluster Name',
    key: 'name',
    render: obj => (
      <TdName
        name={obj.name}
        description={obj.cluster_id}
        linkUrl={`/dashboard/cluster/${obj.cluster_id}`}
      />
    )
  },
  {
    title: 'Status',
    key: 'status',
    render: obj => <Status type={obj.status} name={obj.status} />
  },
  {
    title: 'App Version',
    key: 'version_id',
    dataIndex: 'version_id',
    width: '100px'
  },
  {
    title: 'Node Count',
    key: 'cluster_node_set',
    render: ({ cluster_node_set }) => cluster_node_set && cluster_node_set.length
  },
  {
    title: 'Runtime',
    key: 'runtime_id',
    dataIndex: 'runtime_id',
    width: '100px'
  },
  {
    title: 'User',
    key: 'owner',
    dataIndex: 'owner'
  },
  {
    title: 'Date Created',
    key: 'create_time',
    dataIndex: 'create_time',
    render: getParseDate
  }
];
