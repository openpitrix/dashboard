import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { getScrollTop } from 'src/utils';

import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import styles from './index.scss';
import _, { debounce, throttle } from 'lodash';

let lastTs = Date.now();

@inject(({ rootStore }) => ({
  rootStore: rootStore,
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore
}))
@observer
export default class Home extends Component {
  static async onEnter({ categoryStore, appStore }) {
    await categoryStore.fetchAll();
    await appStore.fetchApps();
  }

  state = {
    lastScroll: 0,
    fixNav: false
  };

  componentDidMount() {
    const { appStore } = this.props.rootStore;
    this.threshold = this.getThreshold();
    if (appStore.apps.length) {
      window.onscroll = throttle(this.handleScoll, 200);
    }
  }

  componentWillUnmount() {
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

  handleScoll = () => {
    const { rootStore } = this.props;

    if (this.threshold <= 0) {
      return;
    }

    let fixNav = rootStore.fixNav;
    let scrollTop = getScrollTop();
    let needFixNav = scrollTop > this.threshold;

    if (needFixNav && !fixNav) {
      if (Date.now() - lastTs > 500) {
        rootStore.setNavFix(true);
        lastTs = Date.now();
      }
    } else if (!needFixNav && fixNav) {
      if (Date.now() - lastTs > 500) {
        rootStore.setNavFix(false);
        lastTs = Date.now();
      }
    }
  };

  render() {
    const { rootStore, appStore, categoryStore } = this.props;
    const { fixNav } = rootStore;
    const { fetchApps, categoryTitle, appCategoryId, appSearch, apps, isLoading } = appStore;
    const navs = categoryStore.categories.slice();
    const showApps = appCategoryId || appSearch ? apps.slice() : apps.slice(0, 3);
    const { categories, getCategoryApps } = categoryStore;
    const categoryApps = getCategoryApps(categories, apps);

    return (
      <Fragment>
        <Banner onSearch={fetchApps} />
        <div className={styles.contentOuter}>
          <div className={classnames(styles.content, { [styles.fixNav]: fixNav })}>
            <Nav
              className={styles.nav}
              navs={navs}
              curCategory={appCategoryId}
              onChange={fetchApps}
            />
            <AppList
              className={styles.apps}
              apps={showApps}
              categoryApps={categoryApps}
              categoryTitle={categoryTitle}
              appSearch={appSearch}
              moreApps={fetchApps}
            />
            {isLoading && <Loading className={styles.homeLoad} />}
          </div>
        </div>
      </Fragment>
    );
  }
}
