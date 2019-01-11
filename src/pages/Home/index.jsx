import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import Layout, { TitleBanner } from 'components/Layout';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import InfiniteScroll from 'components/InfiniteScroll';

import { getScrollTop } from 'utils';
import { getUrlParam } from 'utils/url';

import styles from './index.scss';

const cateLatest = 'latest';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore,
  search: rootStore.searchWord
}))
@observer
export default class Home extends Component {
  static isHome = true;

  state = {
    pageLoading: true
  };

  get searchWord() {
    return this.props.search || getUrlParam('q');
  }

  async componentDidMount() {
    const {
      rootStore, appStore, categoryStore, match
    } = this.props;
    const { category } = match.params;

    rootStore.setNavFix(Boolean(category || this.searchWord));

    if (!(category || this.searchWord)) {
      this.threshold = this.getThreshold();
      window.onscroll = _.debounce(this.handleScroll, 100);
    }
    window.scroll({ top: 0 });

    await categoryStore.fetchAll();
    await appStore.fetchStoreAppsCount();

    // always fetch active apps
    appStore.selectStatus = 'active';

    if (this.searchWord || (category && category !== cateLatest)) {
      await appStore.fetchAll({
        search_word: this.searchWord,
        category_id: category
      });
    } else {
      await appStore.fetchActiveApps();
    }

    this.setState({
      pageLoading: false
    });
  }

  async componentDidUpdate(prevProps) {
    const { match, appStore, search } = this.props;
    const { category } = match.params;

    appStore.showActiveApps = category === cateLatest;

    if (prevProps.match.params.category !== category) {
      appStore.currentPage = 1;

      if (category === cateLatest) {
        await appStore.fetchActiveApps();
      } else {
        // reset search wd
        appStore.searchWord = '';
        await appStore.fetchAll({
          category_id: category
        });
      }
    }

    if (prevProps.search !== search) {
      appStore.searchWord = search;
      appStore.currentPage = 1;

      if (search) {
        await appStore.fetchAll();
      } else {
        await appStore.fetchActiveApps();
      }
    }
  }

  componentWillUnmount() {
    const { appStore, rootStore } = this.props;

    window.onscroll = null;
    appStore.reset();
    rootStore.setSearchWord();
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
    const { fixNav } = rootStore;
    if (this.threshold <= 0) {
      return;
    }

    const needFixNav = getScrollTop() > this.threshold;

    if (needFixNav && !fixNav) {
      rootStore.setNavFix(true);
    } else if (!needFixNav && fixNav) {
      rootStore.setNavFix(false);
    }

    // todo
  };

  handleClickCate = cate_id => {
    this.props.history.push(`/cat/${cate_id}`);
  };

  renderCateMenu() {
    const {
      match, categoryStore, rootStore, t
    } = this.props;
    const { categories } = categoryStore;
    const { category } = match.params;

    return (
      <div
        className={classnames(styles.nav, {
          [styles.fixNav]: rootStore.fixNav
        })}
      >
        <div className={styles.navGrp}>
          <p className={styles.caption}>{t('发现')}</p>
          <ul className={styles.menu}>
            <li
              key={cateLatest}
              className={classnames(styles.item, {
                [styles.active]: category === cateLatest
              })}
              onClick={() => this.handleClickCate(cateLatest)}
            >
              <Icon name="cart" size={24} type="dark" className={styles.icon} />
              <span className={styles.name}>{t('最新上架')}</span>
            </li>
          </ul>
        </div>

        <div className={styles.navGrp}>
          <p className={styles.caption}>{t('Categories')}</p>
          <ul className={styles.menu}>
            {categories.map(({ category_id, name, description }) => (
              <li
                key={category_id}
                className={classnames(styles.item, {
                  [styles.active]: category === category_id
                })}
                onClick={() => this.handleClickCate(category_id)}
              >
                <Icon
                  name={description}
                  size={24}
                  type="dark"
                  className={styles.icon}
                />
                <span className={styles.name}>{t(name)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const {
      rootStore, appStore, categoryStore, match, t
    } = this.props;
    const { pageLoading } = this.state;
    const { fixNav } = rootStore;
    const {
      apps,
      isProgressive,
      isLoading,
      hasMore,
      currentPage,
      loadMore,
      countStoreApps
    } = appStore;
    const { categories } = categoryStore;
    const { category } = match.params;
    const categoryTitle = _.get(
      _.find(categories, { category_id: category }),
      'name',
      ''
    );

    return (
      <Layout isHome>
        <div
          className={classnames(styles.content, { [styles.fixNav]: fixNav })}
        >
          <TitleBanner
            title="App Store"
            description={t('APP_STORE_DESC', { total: countStoreApps })}
            hasSearch
            stretch
          />
          {this.renderCateMenu()}

          <Loading isLoading={appStore.isLoading} className={styles.homeLoad}>
            <InfiniteScroll
              className={styles.apps}
              pageStart={currentPage}
              loadMore={loadMore}
              isLoading={isLoading}
              hasMore={Boolean(category || this.searchWord) && hasMore}
            >
              <AppList
                apps={apps}
                title={categoryTitle}
                search={this.searchWord}
                isLoading={pageLoading}
                fixNav={fixNav}
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
      </Layout>
    );
  }
}
