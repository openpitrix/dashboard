import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Header } from 'components/Dashboard';
import PageLoading from 'components/Loading/Page';
import Card from 'pages/Dashboard/Apps/Card';

import InfiniteScroll from 'components/InfiniteScroll';

import Layout from 'components/Layout';
import Empty from './Empty';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export default class Apps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoading: true
    };
  }

  async componentDidMount() {
    const { appStore, user } = this.props;
    const { user_id } = user;
    appStore.pageSize = 48;
    appStore.userId = user_id;
    await appStore.fetchAll();
    this.setState({
      pageLoading: false
    });
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.pageSize = 10;
    appStore.userId = '';
  }

  render() {
    const { t, appStore } = this.props;
    const { apps } = appStore;
    const headerProps = {
      name: t('My Apps'),
      store: appStore,
      isFixed: true,
      placeholder: t('Search for app name or ID'),
      withCreateBtn: {
        linkTo: '/dashboard/app/create'
      }
    };

    const { pageLoading } = this.state;
    if (!pageLoading && apps.length === 0) {
      return <Empty />;
    }

    return (
      <Layout className={styles.layout} noSubMenu={true}>
        <PageLoading isLoading={pageLoading}>
          <Header {...headerProps} />
          <InfiniteScroll store={appStore}>
            <div className={styles.cards}>
              {apps.map(item => <Card key={item.app_id} t={t} data={item} />)}
            </div>
          </InfiniteScroll>
        </PageLoading>
      </Layout>
    );
  }
}
