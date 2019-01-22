import React from 'react';
import { translate } from 'react-i18next';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import Banner from 'components/Banner';
import { Runtimes } from 'pages/Dashboard';

// import styles from './index.scss';

@translate()
export default class UserRuntimes extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Layout
        banner={
          <Banner
            title={t('我的环境')}
            description={t('平台同时支持多种云环境，可以在这里进行统一管理。')}
          />
        }
      >
        <Runtimes {..._.pick(this.props, ['location', 'match'])} />
      </Layout>
    );
  }
}
