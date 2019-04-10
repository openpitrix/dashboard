import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import Layout from 'portals/user/Layout';
import { Grid, Section } from 'components/Layout';
import { Icon } from 'components/Base';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import InfiniteScroll from 'components/InfiniteScroll';

import { getScrollTop, qs2Obj } from 'utils';
import { getUrlParam } from 'utils/url';

import styles from './index.scss';

const cateLatest = 'latest';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export default class Home extends Component {
  state = {
    pageLoading: true
  };

  async componentDidMount() {
    const { rootStore, appStore, categoryStore } = this.props;

    if (!(this.category || this.searchWord)) {
      this.threshold = this.getThreshold();
      window.onscroll = _.debounce(this.handleScroll, 100);
    } else {
      rootStore.setNavFix(true);
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

  async componentDidUpdate(prevProps) {
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

      if (!_.get(prevProps, 'location.search', '')) {
        rootStore.setNavFix(this.needFixNav);
      }
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
    const headerNode = document.querySelector('.banner');

    if (headerNode) {
      return headerNode.clientHeight / 2;
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
    const {
      rootStore, categoryStore, user, t
    } = this.props;
    const { categories } = categoryStore;
    const fixNav = rootStore.fixNav || user.isLoggedIn() || this.needFixNav;

    return (
      <div
        className={classnames(styles.nav, {
          [styles.fixNav]: fixNav
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
      appStore, categoryStore, rootStore, user, t
    } = this.props;
    const { pageLoading } = this.state;
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
    const fixNav = rootStore.fixNav || user.isLoggedIn() || this.needFixNav;

    return (
      <Layout
        className={classnames(styles.content, {
          [styles.fixNav]: fixNav
        })}
        banner={
          <Banner
            title="App Store"
            description={t('APP_STORE_DESC', { total: countStoreApps })}
            hasSearch
            shrink={fixNav}
            stretch={!fixNav}
          />
        }
      >
        <Grid>
          <Section size={3}>{this.renderCateMenu()}</Section>
          <Section size={9}>
            <Loading
              isLoading={appStore.isLoading && currentPage === 1}
              className={styles.homeLoad}
            >
              <InfiniteScroll
                pageStart={currentPage}
                loadMore={loadMore}
                isLoading={isLoading}
                hasMore={hasMore}
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
          </Section>
        </Grid>
      </Layout>
    );
  }
}
