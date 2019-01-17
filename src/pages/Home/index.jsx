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
    pageLoading: true,
    cate: ''
  };

  async componentDidMount() {
    const { rootStore, appStore, categoryStore } = this.props;

    rootStore.setNavFix(Boolean(this.category || this.searchWord));

    if (!(this.category || this.searchWord)) {
      this.threshold = this.getThreshold();
      window.onscroll = _.debounce(this.handleScroll, 100);
    }
    window.scroll({ top: 0 });

    await categoryStore.fetchAll({ noLimit: true });
    await appStore.fetchStoreAppsCount();

    // always fetch active apps
    Object.assign(appStore, {
      selectStatus: 'active',
      currentPage: 1,
      showActiveApps: true
    });

    await appStore.fetchActiveApps({
      search_word: this.searchWord,
      category_id: this.category === cateLatest ? '' : this.category
    });

    this.setState({
      pageLoading: false
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    const { appStore, search } = this.props;
    const { cate } = this.state;

    if (prevState.cate !== cate) {
      Object.assign(appStore, {
        currentPage: 1,
        searchWord: ''
      });

      await appStore.fetchActiveApps({
        category_id: cate === cateLatest ? '' : cate
      });
    } else if (prevProps.search !== search) {
      Object.assign(appStore, {
        currentPage: 1,
        searchWord: search,
        category_id: ''
      });

      if (!search) {
        this.setState({ cate: cateLatest });
      }

      await appStore.fetchActiveApps();
    }
  }

  componentWillUnmount() {
    const { appStore, rootStore } = this.props;

    window.onscroll = null;
    appStore.reset();
    rootStore.setSearchWord();
  }

  get searchWord() {
    return this.props.search || getUrlParam('q');
  }

  get category() {
    return this.state.cate || getUrlParam('cate');
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
  };

  handleClickCate = cate => {
    const { rootStore, history } = this.props;

    this.setState({
      cate
    });
    rootStore.setNavFix(true);
    rootStore.setSearchWord();
    history.push(`/?cate=${cate}`);
  };

  renderCateMenu() {
    const { categoryStore, rootStore, t } = this.props;
    const { categories } = categoryStore;

    return (
      <div
        className={classnames(styles.nav, {
          [styles.fixNav]: rootStore.fixNav
        })}
      >
        <div className={styles.navGrp}>
          <p className={styles.caption}>{t('Discoveries')}</p>
          <ul className={styles.menu}>
            <li
              key={cateLatest}
              className={classnames(styles.item, {
                [styles.active]: this.category === cateLatest
              })}
              onClick={() => this.handleClickCate(cateLatest)}
            >
              <Icon name="cart" size={24} type="dark" className={styles.icon} />
              <span className={styles.name}>{t('New Arrival')}</span>
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
                  [styles.active]: this.category === category_id
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
      rootStore, appStore, categoryStore, t
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
    const categoryTitle = _.get(
      _.find(categories, { category_id: this.category }),
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
              hasMore={Boolean(this.category || this.searchWord) && hasMore}
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
