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
  appVersionStore: rootStore.appVersionStore,
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
    const { appStore, appVersionStore, user } = this.props;
    const { user_id } = user;
    appStore.pageSize = 24;
    appStore.userId = user_id;
    await appStore.fetchAll();
    await appVersionStore.fetchAll();
    this.setState({
      pageLoading: false
    });
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.pageSize = 10;
    appStore.searchWord = '';
    appStore.userId = '';
  }

  renderSearchEmpty() {
    const { t, appStore } = this.props;
    const { apps, searchWord } = appStore;
    if (apps.length > 0 || !searchWord) {
      return null;
    }
    return (
      <div>
        <div>{t('Search result is empty')}</div>
        {t('No result for search word', { searchWord })}
      </div>
    );
  }

  render() {
    const { t, appStore, rootStore } = this.props;
    const { apps, searchWord, onSearch } = appStore;
    const headerProps = {
      name: t('My Apps'),
      store: appStore,
      isFixed: true,
      placeholder: t('Search for app name or ID'),
      onSearch,
      withCreateBtn: {
        linkTo: '/dashboard/app/create'
      }
    };

    const { pageLoading } = this.state;
    if (!pageLoading && !searchWord && apps.length === 0) {
      return <Empty />;
    }

    return (
      <Layout className={styles.layout} noSubMenu={true}>
        <PageLoading isLoading={pageLoading}>
          <Header {...headerProps} />
          <InfiniteScroll store={appStore}>
            <div className={styles.cards}>
              {apps.map(item => (
                <Card
                  apiServer={rootStore.apiServer}
                  key={item.app_id}
                  t={t}
                  data={item}
                />
              ))}
            </div>
          </InfiniteScroll>
          {this.renderSearchEmpty()}
        </PageLoading>
      </Layout>
    );
  }
}
