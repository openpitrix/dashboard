import React, { Component } from 'react';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
import { get, find, throttle } from 'lodash';
import { translate } from 'react-i18next';

import { getScrollBottom } from 'src/utils';
import Nav from 'components/Nav';
import AppList from 'components/AppList';
import Loading from 'components/Loading';
import Layout from 'components/Layout';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore: rootStore,
  categoryStore: rootStore.categoryStore,
  appStore: rootStore.appStore
}))
@observer
export default class Store extends Component {
  static async onEnter({ categoryStore, appStore }, { category, search }) {
    appStore.loadPageInit();
    await categoryStore.fetchAll();

    const params = { status: 'active' };
    if (category) {
      params.category_id = category;
    }
    if (search) {
      params.search_word = search;
    }
    await appStore.fetchApps(params);

    appStore.storeApps = appStore.apps;
  }

  componentDidMount() {
    window.scroll({ top: 0, behavior: 'smooth' });
    const { match } = this.props;
    const { params } = match;

    window.scroll({ top: 0, behavior: 'smooth' });
    if (!params.category && !params.search) {
      window.onscroll = throttle(this.handleScroll, 200);
      const initLoadNumber = parseInt((document.documentElement.clientHeight - 200) / 250);
      this.loadAppData(0, initLoadNumber);
    }
  }

  async componentWillReceiveProps({ match, rootStore }) {
    const { params } = match;
    if (params.category) {
      await rootStore.appStore.fetchApps({ category_id: params.category });
      rootStore.appStore.storeApps = rootStore.appStore.apps;
    }
  }

  componentWillUnmount() {
    const { appStore } = this.props;
    appStore.apps = [];
    window.onscroll = null;
  }

  //load app data progressive by window scroll
  handleScroll = async () => {
    const { appStore, categoryStore } = this.props;
    const { categories } = categoryStore;
    const len = categories.length;

    if (len > 0 && categories[len - 1].appFlag) {
      return;
    }
    const scrollBottom = getScrollBottom();
    if (scrollBottom < 100 && !appStore.isProgressive) {
      await this.loadAppData();
    }
  };

  loadAppData = async number => {
    const { categoryStore, appStore } = this.props;
    const { categories } = categoryStore;

    for (let i = 0; i < categories.length; i++) {
      if (!categories[i].appFlag) {
        categoryStore.categories[i].appFlag = true;
        await appStore.fetchAll({
          status: 'active',
          category_id: categories[i].category_id,
          noLoading: true
        });
        let temp = categoryStore.categories[i];
        categoryStore.categories[i] = {
          apps: appStore.apps,
          ...temp
        };

        if (number) {
          //when this category no app data, query next category
          if (appStore.apps.length === 0) {
            number++;
          } else if (number === i + 1) {
            break;
          }
        } else if (appStore.apps.length > 0) {
          break;
        }
      }
    }
  };

  render() {
    const { appStore, categoryStore, match, t } = this.props;
    const { storeApps, isLoading, isProgressive } = appStore;
    const categories = categoryStore.categories;
    const categoryId = match.params.category;
    const appSearch = match.params.search;
    const showApps = appSearch || Boolean(categoryId) ? storeApps.slice() : storeApps.slice(0, 3);
    const categoryTitle = get(find(categories, { category_id: categoryId }), 'name', '');

    return (
      <Layout title={t('Store')} hasSearch>
        <div className={styles.storeContent}>
          <Nav className={styles.nav} navs={categories.toJSON()} skipLink="store" />
          <Loading isLoading={isLoading} className={styles.homeLoad}>
            <AppList
              className={styles.apps}
              apps={showApps}
              categoryApps={categories.toJSON()}
              categoryTitle={categoryTitle}
              appSearch={appSearch}
              skipLink="store"
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
      </Layout>
    );
  }
}
