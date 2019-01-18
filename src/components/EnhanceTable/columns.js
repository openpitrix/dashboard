import React from 'react';
import { I18n } from 'react-i18next';

import LessText from 'components/LessText';
import TdName from 'components/TdName';
import TimeShow from 'components/TimeShow';
import { getObjName } from 'utils';
import _ from 'lodash';

// inject
export default ({ users = [], urlPrefix = '' }) => [
  {
    title: 'App Name',
    key: 'name',
    width: '150px',
    render: item => (
      <TdName
        name={item.name}
        description={item.app_id}
        image={item.icon}
        linkUrl={urlPrefix + item.app_id}
      />
    )
  },
  {
    title: 'App intro',
    key: 'intro',
    width: '150px',
    render: item => (
      <LessText txt={item.abstraction || item.description} limit={40} />
    )
  },
  {
    title: 'Categories',
    key: 'category',
    width: '100px',
    render: item => (
      <I18n>
        {t => {
          const cateName = _.get(item, 'category_set', [])
            .filter(cate => cate.category_id && cate.status === 'enabled')
            .map(cate => cate.name)
            .join(', ');

          return t(cateName);
        }}
      </I18n>
    )
  },
  {
    title: 'Delivery type',
    key: 'delivery_type',
    width: '80px',
    render: item => <I18n>{t => item.app_version_types || t('unknown')}</I18n>
  },
  {
    title: 'Count deploy',
    key: 'cnt_deploy',
    width: '80px',
    // todo
    render: () => <I18n>{t => t('unknown')}</I18n>
  },
  {
    title: 'Developer',
    key: 'owner',
    width: '80px',
    render: item => getObjName(users, 'user_id', item.owner, 'username') || item.owner
  },
  {
    title: 'App service provider',
    key: 'maintainers',
    width: '80px',
    render: item => {
      let { maintainers } = item;
      if (maintainers && _.isString(maintainers)) {
        try {
          maintainers = _.map(JSON.parse(maintainers), 'name').join(', ');
        } catch (e) {}
      }

      return maintainers;
    }
  },
  {
    title: 'Publish time',
    key: 'status_time',
    width: '130px',
    render: item => <TimeShow time={item.status_time} />
  }
];
