import React from 'react';

import TdName from 'components/TdName';
import Status from 'components/Status';
import Configuration from '../Configuration';
import TimeShow from 'components/TimeShow';

/**
 *
 * @param t | i18n trans
 */
export default t => [
  {
    title: t('Name'),
    key: 'name',
    width: '130px',
    render: item => <TdName name={item.name} description={item.node_id} noIcon />
  },
  {
    title: t('Role'),
    key: 'role',
    render: item => item.role || t('None')
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
    title: t('IP'),
    key: 'private_ip',
    width: '100px',
    render: item => (
      <div className="ipShow">
        {item.private_ip}
        <div className="eip"> {item.eip}</div>
      </div>
    )
  },
  {
    title: t('Updated At'),
    key: 'status_time',
    width: '95px',
    render: item => <TimeShow time={item.status_time} />
  }
];
