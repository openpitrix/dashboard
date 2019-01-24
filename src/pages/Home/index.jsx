import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { translate } from 'react-i18next';

import Layout from 'portals/user/Layout';
import { Icon } from 'components/Base';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import InfiniteScroll from 'components/InfiniteScroll';

import { getScrollTop, qs2Obj } from 'utils';
import { getUrlParam } from 'utils/url';

import styles from './index.scss';

const cateLatest = 'latest';

@translate()
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

  async componentDidMount() {
    const { rootStore, appStore, categoryStore } = this.props;

    rootStore.setNavFix(this.needFixNav);

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
    const { rootStore, appStore, location } = this.props;

    if (prevProps.location.search !== location.search) {
      const qs = qs2Obj(location.search);

      Object.assign(appStore, {
        currentPage: 1
      });

      await appStore.fetchActiveApps({
        search_word: qs.q || '',
        category_id: !qs.cate || qs.cate === cateLatest ? '' : qs.cate
      });

      rootStore.setNavFix(this.needFixNav);
    }
  }

  componentWillUnmount() {
    const { appStore } = this.props;

    window.onscroll = null;
    appStore.reset();
  }

  get searchWord() {
    return getUrlParam('q');
  }

  get category() {
    return getUrlParam('cate');
  }

  get needFixNav() {
    return Boolean(this.category || this.searchWord);
  }

  getThreshold() {
    const headerNode = document.querySelector('.header');
    if (headerNode) {
      return headerNode.clientHeight;
    }
    return 0;
  }

  handleScroll = async () => {
    const { rootStore } = this.props;
    const { fixNav } = rootStore;
    if (this.threshold <= 0) {
      return;
    }

    const needFixNav = getScrollTop() > this.threshold || this.needFixNav;

    if (needFixNav && !fixNav) {
      rootStore.setNavFix(true);
    } else if (!needFixNav && fixNav) {
      rootStore.setNavFix(false);
    }
  };

  handleClickCate = cate => {
    const { rootStore, history } = this.props;

    rootStore.setNavFix(true);
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
      <Layout
        className={classnames(styles.content, { [styles.fixNav]: fixNav })}
        banner={
          <Banner
            title="App Store"
            description={t('APP_STORE_DESC', { total: countStoreApps })}
            hasSearch
            stretch
          />
        }
      >
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
      </Layout>
    );
  }
}
