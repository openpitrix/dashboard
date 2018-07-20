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
  static async onEnter({ categoryStore, appStore }, { category }) {
    await categoryStore.fetchAll();
    await appStore.fetchApps(category ? { category_id: category } : {});
    appStore.appSearch = '';
  }

  componentDidMount() {
    const { rootStore, match } = this.props;

    if (match.params.category) {
      rootStore.setNavFix(true);
    } else {
      this.threshold = this.getThreshold();
      window.onscroll = throttle(this.handleScroll, 100);
      window.scroll({ top: 1, behavior: 'smooth' });
    }
  }

  componentWillReceiveProps({ match, rootStore }) {
    rootStore.appStore.fetchApps({ category_id: match.params.category });
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
      rootStore.setNavFix(true);
    } else if (!needFixNav && fixNav) {
      rootStore.setNavFix(false);
    }
  };

  setScroll = () => {
    const { rootStore } = this.props;
    rootStore.setNavFix(true);
    window.scroll({ top: 360, behavior: 'smooth' });
  };

  render() {
    const { rootStore, appStore, categoryStore, match } = this.props;
    const { fixNav } = rootStore;
    const { fetchApps, appSearch, apps, isLoading } = appStore;
    const { categories, getCategoryApps } = categoryStore;

    const categoryId = match.params.category;
    const showApps = appSearch || Boolean(categoryId) ? apps.slice() : apps.slice(0, 3);
    const categoryApps = getCategoryApps(categories, apps);
    const isHomePage = match.path === '/';
    const categoryTitle = get(find(categories, { category_id: categoryId }), 'name', '');

    return (
      <Fragment>
        {isHomePage && (
          <Banner onSearch={fetchApps} appSearch={appSearch} setScroll={this.setScroll} />
        )}
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
                isCategorySearch={Boolean(categoryId)}
                moreApps={fetchApps}
              />
            </Loading>
          </div>
        </div>
      </Fragment>
    );
  }
}
