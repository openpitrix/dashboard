import React from 'react';

import { Icon } from 'components/Base';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import Configuration from '../Configuration';

/**
 *
 * @param t | i18n trans
 */
export default t => [
  {
    title: t('Node ID'),
    key: 'node_id',
    render: item => item.node_id
  },
  {
    title: t('Role'),
    key: 'role',
    render: item => item.role || t('None')
  },
  {
    title: t('Status'),
    key: 'status',
    render: item => (
      <Status type={item.status} transition={item.transition_status} />
    )
  },
  {
    title: t('Configuration'),
    key: 'configuration',
    render: item => <Configuration configuration={item.cluster_role || {}} />
  },
  {
    title: t('IP'),
    key: 'private_ip',
    render: item => (
      <div className="ipShow">
        <div title={t('Private network IP')}>
          <Icon name="ip" type="dark" />
          {item.private_ip}
        </div>
        {!item.eip && (
          <div className="eip" title={t('Public network IP')}>
            <Icon name="eip" type="dark" />
            {item.eip}52.14.14.241
          </div>
        )}
      </div>
    )
  },
  {
    title: t('Updated At'),
    key: 'status_time',
    width: '155px',
    render: item => <TimeShow time={item.status_time} />
  }
];
