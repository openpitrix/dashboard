import React from 'react';
import { I18n } from 'react-i18next';

import routes, { toRoute } from 'routes';
import LessText from 'components/LessText';
import TdName from 'components/TdName';
import TimeShow from 'components/TimeShow';
import VersionType from 'components/VersionType';
import TdUser from 'components/TdUser';
import _ from 'lodash';

// inject
export default ({ users = [], vendors = [], appsDeployTotal = [] }) => [
  {
    title: 'App Name',
    key: 'name',
    width: '150px',
    render: item => (
      <TdName
        name={item.name}
        description={item.app_id}
        image={item.icon}
        linkUrl={toRoute(routes.portal.appDetail, { appId: item.app_id })}
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
    render: item => <VersionType types={item.app_version_types} />
  },
  {
    title: 'Count deploy',
    key: 'cnt_deploy',
    width: '80px',
    render: item => item.deploy_total
  },
  {
    title: 'Developer',
    key: 'owner',
    width: '120px',
    render: item => <TdUser userId={item.owner} users={users} />
  },
  {
    title: 'App service provider',
    key: 'maintainers',
    className: 'boldFont',
    width: '120px',
    render: item => (_.find(vendors, { user_id: item.isv }) || {}).company_name || item.isv
  },
  {
    title: 'Publish time',
    key: 'status_time',
    width: '130px',
    render: item => <TimeShow time={item.status_time} />
  }
];
