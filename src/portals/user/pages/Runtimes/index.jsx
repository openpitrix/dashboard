import React from 'react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import Layout from 'portals/user/Layout';
import Banner from 'components/Banner';
import { Runtimes } from 'pages/Dashboard';

// import styles from './index.scss';

@withTranslation()
export default class UserRuntimes extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Layout
        banner={
          <Banner
            title={t('My Runtimes')}
            description={t('MY_RUNTIMES_DESC')}
          />
        }
      >
        <Runtimes {..._.pick(this.props, ['location', 'match'])} />
      </Layout>
    );
  }
}
