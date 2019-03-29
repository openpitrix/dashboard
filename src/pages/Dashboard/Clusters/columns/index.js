import React from 'react';
import { Link } from 'react-router-dom';

import { PopoverIcon } from 'components/Base';
import Status from 'components/Status';
import TdName, { ProviderName } from 'components/TdName';
import TimeShow from 'components/TimeShow';
import TdUser from 'components/TdUser';
import { getObjName } from 'utils';

import styles from '../index.scss';

const transMap = {
  active: 'normal'
};

export default ({
  getDetailLink,
  renderAppTdShow,
  renderHandleMenu,
  users,
  user,
  runtimes,
  onlyView,
  isAgent,
  isRuntimeDetail,
  t
}) => [
  {
    title: 'Status',
    key: 'status',
    render: cl => (
      <Status
        type={cl.status}
        transition={cl.transition_status}
        transMap={transMap}
      />
    )
  },
  {
    title: isAgent ? 'Agent Name ID' : 'Instance Name ID',
    key: 'name',
    render: cl => (
      <TdName
        name={cl.name}
        description={cl.cluster_id}
        linkUrl={isAgent ? '' : getDetailLink(cl.cluster_id)}
        noIcon
      />
    )
  },
  {
    title:
      user.isUserPortal || isRuntimeDetail
        ? 'App / Delivery type / Version'
        : 'Version',
    key: 'app_id',
    render: cl => renderAppTdShow(cl.app_id, cl.version_id)
  },
  {
    title: user.isUserPortal || onlyView ? 'Deploy Runtime' : 'Test Runtime',
    key: 'runtime_id',
    render: cl => (
      <ProviderName
        className={styles.runtimeName}
        name={getObjName(runtimes, 'runtime_id', cl.runtime_id, 'name')}
        provider={getObjName(runtimes, 'runtime_id', cl.runtime_id, 'provider')}
      />
    )
  },
  {
    title: 'Node Count',
    key: 'node_count',
    className: 'number',
    render: cl => (cl.cluster_node_set && cl.cluster_node_set.length) || 0
  },
  {
    title: 'Creator',
    key: 'owner',
    render: cl => (
      <TdUser className={styles.creator} users={users} userId={cl.owner} />
    )
  },
  {
    title: 'Created At',
    key: 'create_time',
    sorter: true,
    onChangeSort: () => {},
    render: cl => <TimeShow time={cl.create_time} type="detailTime" />
  },
  {
    title: '',
    key: 'actions',
    className: 'actions',
    width: isAgent || onlyView ? '100px' : '80px',
    render: cl => (isAgent || onlyView ? (
        <div>
          <Link to={getDetailLink(cl.cluster_id)}>{t('View detail')} →</Link>
        </div>
    ) : (
        <PopoverIcon content={renderHandleMenu(cl)} />
    ))
  }
];
