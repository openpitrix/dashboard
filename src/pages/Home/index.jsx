import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { get, find } from 'lodash';

import { Notification } from 'components/Base';
import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import InfiniteScroll from 'components/InfiniteScroll';
import { getScrollTop, getScrollBottom } from 'src/utils';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  rootStore,
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore
}))
@observer
export default class Home extends Component {
  state = {
    pageLoading: true
  };

  async componentWillMount() {
    const { rootStore, match } = this.props;
    const { category, search } = match.params;

    if (category || search) {
      rootStore.setNavFix(true);
    } else {
      rootStore.setNavFix(false);
    }
  }

  async componentDidMount() {
    const { appStore, categoryStore, match } = this.props;
    const { category, search } = match.params;

    window.scroll({ top: 0 });
    await categoryStore.fetchAll();

    if (!(category || search)) {
      this.threshold = this.getThreshold();
      window.onscroll = this.handleScroll;
    }

    Object.assign(appStore, {
      selectStatus: 'active',
      categoryId: category,
      searchWord: search
    });
    await appStore.fetchAll();

    appStore.homeApps = appStore.apps.slice();
    this.setState({
      pageLoading: false
    });
  }

  componentWillUnmount() {
    const { appStore } = this.props;

    window.onscroll = null;
    appStore.reset();
  }

  getThreshold() {
    const headerNode = document.querySelector('.header');
    const bannerNode = document.querySelector('.banner');
    if (headerNode && bannerNode) {
      return bannerNode.clientHeight - headerNode.clientHeight;
    }
    return 0;
  }

  handleScroll = async () => {
    const { rootStore } = this.props;
    if (this.threshold <= 0) {
      return;
    }

    // judge header fixed
    const fixNav = rootStore.fixNav;
    const scrollTop = getScrollTop();
    const needFixNav = scrollTop > this.threshold;
    if (needFixNav && !fixNav) {
      rootStore.setNavFix(true);
    } else if (!needFixNav && fixNav) {
      rootStore.setNavFix(false);
    }

    // load app data progressive by window scroll
    const { appStore, categoryStore } = this.props;
    const { categories } = categoryStore;
    const len = categories.length;
    if (len > 0 && categories[len - 1].appFlag) {
      return;
    }

    const initLoadNumber = parseInt((document.body.clientHeight - 720) / 250);
    if (len > 0 && !categories[0].appFlag && !appStore.isLoading) {
      await this.loadAppData(categories, initLoadNumber);
    }

    const scrollBottom = getScrollBottom();
    if (scrollBottom < 100 && !appStore.isProgressive) {
      await this.loadAppData(categories);
    }
  };

  loadAppData = async (categories, initLoadNumber) => {
    const { categoryStore, appStore } = this.props;

    for (let i = 0; i < categories.length; i++) {
      if (!categories[i].appFlag) {
        categoryStore.categories[i].appFlag = true;
        await appStore.fetchAll({
          limit: 6,
          status: 'active',
          category_id: categories[i].category_id,
          noLoading: true
        });
        const temp = categoryStore.categories[i];
        categoryStore.categories[i] = {
          apps: appStore.apps,
          ...temp
        };
        if (initLoadNumber) {
          if (appStore.apps.length === 0) {
            initLoadNumber++;
          } else if (initLoadNumber === i + 1) {
            break;
          }
        } else if (appStore.apps.length > 0) {
          break;
        }
      }
    }
  };

  render() {
    const {
      rootStore, appStore, categoryStore, match
    } = this.props;
    const { pageLoading } = this.state;
    const { fixNav } = rootStore;
    const {
      homeApps,
      isProgressive,
      isLoading,
      hasMore,
      currentPage,
      loadMoreHomeApps
    } = appStore;
    const categories = categoryStore.categories;

    const { category, search } = match.params;
    const showApps = category || search ? homeApps.slice() : homeApps.slice(0, 3);
    const isHomePage = match.path === '/';
    const categoryTitle = get(
      find(categories, { category_id: category }),
      'name',
      ''
    );

    return (
      <Fragment>
        {isHomePage && <Banner />}
        <Notification />
        <div
          className={classnames(styles.content, { [styles.fixNav]: fixNav })}
        >
          <Nav className={styles.nav} navs={categories.toJSON()} />
          <Loading isLoading={pageLoading} className={styles.homeLoad}>
            <InfiniteScroll
              className={styles.apps}
              pageStart={currentPage}
              loadMore={loadMoreHomeApps}
              isLoading={isLoading}
              hasMore={(category || search) && hasMore}
            >
              <AppList
                apps={showApps}
                categoryApps={categories.toJSON()}
                categoryTitle={categoryTitle}
                appSearch={search}
                isLoading={pageLoading}
              />
            </InfiniteScroll>
            {isProgressive && (
              <div className={styles.loading}>
                <div className={styles.loadOuter}>
                  <div className={styles.loader} />
                </div>
              </div>
            )}
          </Loading>
        </div>
      </Fragment>
    );
  }
}
