import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { get, find } from 'lodash';

import { Notification } from 'components/Base';
import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import { getScrollTop, getScrollBottom } from 'src/utils';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  rootStore: rootStore,
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore
}))
@observer
export default class Home extends Component {
  async componentDidMount() {
    const { rootStore, appStore, categoryStore, match } = this.props;
    const { category, search } = match;

    const filterParams = { status: 'active', noLimit: true, noLogin: true };

    // appStore.loadPageInit();
    await categoryStore.fetchAll({ noLogin: true });

    if (category) {
      filterParams.category_id = category;
    }
    if (search) {
      filterParams.search_word = search;
    }
    await appStore.fetchAll(filterParams);
    appStore.homeApps = appStore.apps;

    window.scroll({ top: 0, behavior: 'smooth' });

    if (category || search) {
      // search or category filter page
      rootStore.setNavFix(true);
    } else {
      // home page
      rootStore.setNavFix(false);
      this.threshold = this.getThreshold();
      window.onscroll = this.handleScroll;
    }
  }

  async componentWillReceiveProps({ match, rootStore }) {
    const { params } = match;
    if (params.category) {
      await rootStore.appStore.fetchAll({
        category_id: params.category,
        status: 'active',
        noLimit: true,
        noLogin: true
      });
      rootStore.appStore.homeApps = rootStore.appStore.apps;
    }
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.apps = [];
    window.onscroll = null;
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

    //judge header fixed
    let fixNav = rootStore.fixNav;
    let scrollTop = getScrollTop();
    let needFixNav = scrollTop > this.threshold;
    if (needFixNav && !fixNav) {
      rootStore.setNavFix(true);
    } else if (!needFixNav && fixNav) {
      rootStore.setNavFix(false);
    }

    //load app data progressive by window scroll
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

    let scrollBottom = getScrollBottom();
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
          status: 'active',
          category_id: categories[i].category_id,
          noLoading: true,
          noLogin: true
        });
        let temp = categoryStore.categories[i];
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
    const { rootStore, appStore, categoryStore, match } = this.props;
    const { fixNav } = rootStore;
    const { homeApps, isLoading, isProgressive } = appStore;
    const categories = categoryStore.categories;
    const categoryId = match.params.category;
    const appSearch = match.params.search;
    const showApps = appSearch || Boolean(categoryId) ? homeApps.slice() : homeApps.slice(0, 3);
    const isHomePage = match.path === '/';
    const categoryTitle = get(find(categories, { category_id: categoryId }), 'name', '');

    return (
      <Fragment>
        {isHomePage && <Banner />}
        <Notification />
        <div className={classnames(styles.content, { [styles.fixNav]: fixNav })}>
          <Nav className={styles.nav} navs={categories.toJSON()} />
          <Loading isLoading={isLoading} className={styles.homeLoad}>
            <AppList
              className={styles.apps}
              apps={showApps}
              categoryApps={categories.toJSON()}
              categoryTitle={categoryTitle}
              appSearch={appSearch}
            />
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
