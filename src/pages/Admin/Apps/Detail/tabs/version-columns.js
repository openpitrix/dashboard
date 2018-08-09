import React from 'react';
import { I18n } from 'react-i18next';

import TdName from 'components/TdName';
import Status from 'components/Status';
import TimeShow from 'components/TimeShow';
import { Icon } from 'components/Base';

export default [
  {
    title: <I18n>{t => <span>{t('Version Name')}</span>}</I18n>,
    key: 'name',
    render: obj => <TdName name={obj.name} description={obj.version_id} />
  },
  {
    title: <I18n>{t => <span>{t('Status')}</span>}</I18n>,
    key: 'status',
    render: obj => <Status type={(obj.status + '').toLowerCase()} name={obj.status} />
  },
  {
    title: <I18n>{t => <span>{t('Download')}</span>}</I18n>,
    key: 'package_name',
    render: obj => (
      <a href={obj.package_name}>
        <Icon name="download" />
      </a>
    )
  },
  {
    title: <I18n>{t => <span>{t('Date Created')}</span>}</I18n>,
    key: 'create_time',
    width: '150px',
    render: item => <TimeShow time={item.status_time} type="lineTime" />
  }
];
