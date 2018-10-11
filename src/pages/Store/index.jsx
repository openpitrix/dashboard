import React, { Component } from 'react';
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
  async componentDidMount() {
    const { appStore, categoryStore, match } = this.props;
    const { category, search } = match.params;

    window.scroll({ top: 0, behavior: 'smooth' });

    await categoryStore.fetchAll();

    const params = {
      status: 'active'
    };
    if (category) {
      params.category_id = category;
    }
    if (search) {
      params.search_word = search;
    }
    await appStore.fetchAll(params);

    appStore.storeApps = appStore.apps.slice();

    if (!category && !search) {
      const initLoadNumber = parseInt((document.documentElement.clientHeight - 450) / 250) + 1;
      await this.loadAppData(initLoadNumber);
      window.onscroll = throttle(this.handleScroll, 200);
    }
  }

  componentWillUnmount() {
    const { appStore } = this.props;

    window.onscroll = null;
    appStore.apps = [];
    appStore.loadPageInit();
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

    const { category, search } = match.params;
    const showApps = category || search ? storeApps.slice() : storeApps.slice(0, 3);
    const categoryTitle = get(find(categories, { category_id: category }), 'name', '');

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
              appSearch={search}
              skipLink="store"
            />
            {isLoading &&
              isProgressive && (
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
