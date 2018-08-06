import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { get, find, throttle } from 'lodash';

import { getScrollTop } from 'src/utils';
import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import Loading from 'components/Loading';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  rootStore: rootStore,
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore
}))
@observer
export default class Home extends Component {
  static async onEnter({ categoryStore, appStore }, { category, search }) {
    appStore.loadPageInit();
    await categoryStore.fetchAll();
    let params = {};
    if (category) {
      params.category_id = category;
    }
    if (search) {
      params.search_word = search;
    }
    await appStore.fetchApps(params);
  }

  componentDidMount() {
    const { rootStore, match } = this.props;
    window.scroll({ top: 0, behavior: 'smooth' });
    if (match.params.category || match.params.search) {
      rootStore.setNavFix(true);
    } else {
      rootStore.setNavFix(false);
      this.threshold = this.getThreshold();
      window.onscroll = throttle(this.handleScroll, 100);
    }
  }

  /* componentWillReceiveProps({ match, rootStore }) {
    rootStore.appStore.fetchApps({ category_id: match.params.category });
  }*/

  componentWillUnmount() {
    if (window.onscroll) {
      window.onscroll = null;
    }
  }

  getThreshold() {
    const headerNode = document.querySelector('.header');
    const bannerNode = document.querySelector('.banner');
    if (headerNode && bannerNode) {
      return bannerNode.clientHeight - headerNode.clientHeight;
    }
    return 0;
  }

  handleScroll = () => {
    const { rootStore } = this.props;

    if (this.threshold <= 0) {
      return;
    }

    let fixNav = rootStore.fixNav;
    let scrollTop = getScrollTop();
    let needFixNav = scrollTop > this.threshold;

    if (needFixNav && !fixNav) {
      rootStore.setNavFix(true);
    } else if (!needFixNav && fixNav) {
      rootStore.setNavFix(false);
    }
  };

  render() {
    const { rootStore, appStore, categoryStore, match } = this.props;
    const { fixNav } = rootStore;
    const { fetchApps, apps, isLoading } = appStore;
    const { categories, getCategoryApps } = categoryStore;

    const categoryId = match.params.category;
    const appSearch = match.params.search;
    const showApps = appSearch || Boolean(categoryId) ? apps.slice() : apps.slice(0, 3);
    const categoryApps = getCategoryApps(categories, apps);
    const isHomePage = match.path === '/';
    const categoryTitle = get(find(categories, { category_id: categoryId }), 'name', '');

    return (
      <Fragment>
        {isHomePage && <Banner />}
        <div className={styles.contentOuter}>
          <div className={classnames(styles.content, { [styles.fixNav]: fixNav })}>
            <Nav className={styles.nav} navs={categories.toJSON()} />
            <Loading isLoading={isLoading} className={styles.homeLoad}>
              <AppList
                className={styles.apps}
                apps={showApps}
                categoryApps={categoryApps}
                categoryTitle={categoryTitle}
                appSearch={appSearch}
                moreApps={fetchApps}
              />
            </Loading>
          </div>
        </div>
      </Fragment>
    );
  }
}
