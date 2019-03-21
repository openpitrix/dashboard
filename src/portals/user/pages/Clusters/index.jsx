import React from 'react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import Banner from 'components/Banner';
import { Clusters } from 'pages/Dashboard';

@withTranslation()
export default class UserClusters extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Layout
        banner={
          <Banner
            title={t('My Instances')}
            description={t('MY_INSTANCES_DESCRIPTION')}
          />
        }
      >
        <Clusters {..._.pick(this.props, ['location', 'match'])} />
      </Layout>
    );
  }
}
