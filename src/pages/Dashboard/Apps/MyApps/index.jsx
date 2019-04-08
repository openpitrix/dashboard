import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Icon, PopoverIcon, Button, Input
} from 'components/Base';
import Layout, { Dialog } from 'components/Layout';
import Loading from 'components/Loading';
import InfiniteScroll from 'components/InfiniteScroll';
import Card from 'pages/Dashboard/Apps/Card';
import routes, { toRoute } from 'routes';
import Empty from './Empty';

import styles from './index.scss';

@withTranslation()
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
    const { appStore } = this.props;

    appStore.pageSize = 48;
    await appStore.fetchAll();
    this.setState({
      pageLoading: false
    });
    window.scroll({ top: 0 });
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.reset();
  }

  showDeleteApp = (event, item) => {
    event.stopPropagation();
    event.preventDefault();

    const { appStore } = this.props;
    appStore.appId = item.app_id;
    appStore.appTitle = item.name;

    appStore.showModal();
  };

  skipLink = (event, url) => {
    event.stopPropagation();
    event.preventDefault();

    this.props.history.push(url);
  };

  renderHandleMenu = item => {
    const { t } = this.props;
    return (
      <div className="operate-menu">
        <span
          onClick={event => this.skipLink(
            event,
            toRoute(routes.portal._dev.versions, {
              appId: item.app_id
            })
          )
          }
        >
          <Icon name="application" type="dark" /> {t('Version manage')}
        </span>
        <span
          onClick={event => this.skipLink(
            event,
            toRoute(routes.portal.appDetail, {
              appId: item.app_id
            })
          )
          }
        >
          <Icon name="pen" type="dark" /> {t('Edit')}
        </span>
        {item.status !== 'active' && (
          <span onClick={event => this.showDeleteApp(event, item)}>
            <Icon name="trash" type="dark" /> {t('Delete')}
          </span>
        )}
      </div>
    );
  };

  renderDeleteDialog = () => {
    const { appStore, t } = this.props;
    const {
      isModalOpen, remove, hideModal, appTitle
    } = appStore;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isModalOpen}
        onSubmit={remove}
        onCancel={hideModal}
        okText={t('Delete')}
        btnType="delete"
      >
        {t('DELETE_APP_DESCRIPTION', { appName: appTitle })}
      </Dialog>
    );
  };

  renderHeader() {
    const { t, appStore } = this.props;
    const name = t('My Apps');
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
        <Link to={toRoute(routes.portal._dev.appCreate)}>
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
      <div className={styles.searchEmpty}>
        <h4>{t('Search result is empty')}</h4>
        {t('No result for search word', { searchWord })}
      </div>
    );
  }

  render() {
    const { t, appStore } = this.props;
    const { apps, searchWord } = appStore;

    const { pageLoading } = this.state;
    if (!pageLoading && !searchWord && apps.length === 0) {
      return (
        <Layout noSubMenu>
          <Empty />
        </Layout>
      );
    }

    return (
      <Layout className={styles.layout} noSubMenu={true}>
        <Loading className={styles.page} isLoading={pageLoading}>
          {this.renderHeader()}
          <InfiniteScroll
            pageStart={appStore.currentPage}
            loadMore={appStore.loadMore}
            isLoading={appStore.isLoading}
            hasMore={appStore.hasMore}
          >
            <div className={styles.cards}>
              {apps.map(item => (
                <Card key={item.app_id} t={t} data={item}>
                  <PopoverIcon content={this.renderHandleMenu(item)} />
                </Card>
              ))}
            </div>
          </InfiniteScroll>
          {this.renderSearchEmpty()}
        </Loading>
        {this.renderDeleteDialog()}
      </Layout>
    );
  }
}
