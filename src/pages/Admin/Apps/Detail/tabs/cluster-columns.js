import React, { Fragment } from 'react';
import { I18n } from 'react-i18next';

import TdName from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';

export default [
  {
    title: <I18n>{t => <span>{t('Cluster Name')}</span>}</I18n>,
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
    title: <I18n>{t => <span>{t('Status')}</span>}</I18n>,
    key: 'status',
    width: '80px',
    render: obj => <Status type={(obj.status + '').toLowerCase()} name={obj.status} />
  },
  {
    title: <I18n>{t => <span>{t('App Version')}</span>}</I18n>,
    key: 'version_id',
    dataIndex: 'version_id',
    width: '100px'
  },
  {
    title: <I18n>{t => <span>{t('Node Count')}</span>}</I18n>,
    key: 'cluster_node_set',
    render: ({ cluster_node_set }) => cluster_node_set && cluster_node_set.length
  },
  {
    title: <I18n>{t => <span>{t('Runtime')}</span>}</I18n>,
    key: 'runtime_id',
    dataIndex: 'runtime_id',
    width: '100px'
  },
  {
    title: <I18n>{t => <span>{t('User')}</span>}</I18n>,
    key: 'owner',
    dataIndex: 'owner'
  },
  {
    title: <I18n>{t => <span>{t('Date Created')}</span>}</I18n>,
    key: 'create_time',
    width: '90px',
    render: item => <TimeShow time={item.status_time} />
  }
];
