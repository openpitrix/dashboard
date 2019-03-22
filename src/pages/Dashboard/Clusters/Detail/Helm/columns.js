import React from 'react';

import TdName from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';

/**
 *
 * @param t
 * @param onChangeExtend
 * @param extendedRowKeys
 */
export default (t, onChangeExtend, extendedRowKeys) => [
  {
    title: t('Name'),
    key: 'name',
    width: '220px',
    render: (item, row, index) => (
      <TdName
        isFold
        noIcon
        noCopy
        noDescription
        name={item.name}
        onExtendedChange={onChangeExtend}
        rowKey={index.toString()}
        fold={extendedRowKeys.includes(index.toString())}
      />
    )
  },
  {
    title: t('Status'),
    key: 'status',
    width: '400px',
    render: item => (
      <Status
        type={item.status.toLowerCase()}
        name={`${t(item.status)} ${item.statusText}`}
      />
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
