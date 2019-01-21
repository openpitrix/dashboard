import React from 'react';
import { translate } from 'react-i18next';

import Layout from 'portals/user/Layout';
import Banner from 'components/Banner';
import { Clusters } from 'pages/Dashboard';

// import styles from './index.scss';

@translate()
export default class UserClusters extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Layout
        banner={
          <Banner
            title={t('My Instances')}
            description={t('基于应用创建出的实例列表。')}
          />
        }
      >
        <Clusters />
      </Layout>
    );
  }
}
