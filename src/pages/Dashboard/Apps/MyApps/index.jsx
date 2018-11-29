import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import PageLoading from 'components/Loading/Page';
import Card from 'pages/Dashboard/Apps/Card';

import InfiniteScroll from 'components/InfiniteScroll';

import { Link } from 'react-router-dom';
import { Icon, Button, Input } from 'components/Base';
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

  renderHeader() {
    const { t, appStore } = this.props;
    const name = t('My Apps');
    const lintTo = '/dashboard/app/create';
    const { onSearch, onClear, searchWord } = appStore;

    return (
      <div className={classnames(styles.header, styles.fixedHeader)}>
        <div className={styles.name}>{name}</div>
        <Input.Search
          className={styles.search}
          placeholder={t('Search for app name or ID')}
          value={searchWord}
          onSearch={onSearch}
          onClear={onClear}
        />
        <Link to={lintTo}>
          <Button className={styles.btnCreate} type="primary">
            <Icon name="add" size={20} type="white" />
            <span className={styles.btnText}>{t('Create')} </span>
          </Button>
        </Link>
      </div>
    );
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
    const { apps, searchWord } = appStore;

    const { pageLoading } = this.state;
    if (!pageLoading && !searchWord && apps.length === 0) {
      return <Empty />;
    }

    return (
      <Layout className={styles.layout} noSubMenu={true}>
        <PageLoading isLoading={pageLoading}>
          {this.renderHeader()}
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
