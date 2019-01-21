import React from 'react';
import { translate } from 'react-i18next';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import Banner from 'components/Banner';

import { ClusterDetail } from 'pages/Dashboard';

// import styles from './index.scss';

@translate()
export default class UserClusterDetail extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Layout
        banner={
          <Banner
            title={t('我的实例')}
            description={t('基于应用创建出的实例列表')}
          />
        }
      >
        <ClusterDetail {..._.pick(this.props, ['location', 'match'])} />
      </Layout>
    );
  }
}
