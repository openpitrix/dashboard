import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { getScrollTop } from 'src/utils';

import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import styles from './index.scss';
import { throttle } from 'lodash';

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
    const { rootStore, match } = this.props;
    const { appStore } = rootStore;

    if (match.params.category) {
      rootStore.setNavFix(true);

      // fetch apps by category
      appStore.fetchApps({ category_id: match.params.category });
    } else {
      this.threshold = this.getThreshold();
      window.onscroll = throttle(this.handleScroll, 300);
      // window.scroll({top: 1, behavior: 'smooth'});
    }
  }

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
      if (Date.now() - lastTs > 200) {
        rootStore.setNavFix(true);
        lastTs = Date.now();
      }
    } else if (!needFixNav && fixNav) {
      if (Date.now() - lastTs > 200) {
        rootStore.setNavFix(false);
        lastTs = Date.now();
      }
    }
  };

  render() {
    const { rootStore, appStore, categoryStore, match } = this.props;
    const { fixNav } = rootStore;
    const { fetchApps, categoryTitle, appSearch, apps, isLoading } = appStore;
    const showApps = appSearch ? apps.slice() : apps.slice(0, 3);

    const { categories, getCategoryApps } = categoryStore;
    const categoryApps = getCategoryApps(categories, apps);

    const isHomePage = match.path === '/' || match.path === '/apps';
    const categorySearch = !!match.params.category;

    return (
      <Fragment>
        {isHomePage && <Banner onSearch={fetchApps} />}
        <div className={styles.contentOuter}>
          <div className={classnames(styles.content, { [styles.fixNav]: fixNav })}>
            <Nav className={styles.nav} navs={categories.toJSON()} />
            <AppList
              className={styles.apps}
              apps={showApps}
              categoryApps={categoryApps}
              categoryTitle={categoryTitle}
              appSearch={appSearch}
              isCategorySearch={categorySearch}
              moreApps={fetchApps}
            />
            {isLoading && <Loading className={styles.homeLoad} />}
          </div>
        </div>
      </Fragment>
    );
  }
}
