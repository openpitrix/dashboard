import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { getScrollTop } from 'src/utils';

import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import styles from './index.scss';
import { debounce, throttle } from 'lodash';

let lastTs = Date.now();

@inject('rootStore')
@observer
export default class Home extends Component {
  static async onEnter({ appStore, apiServer }, params, from_server) {
    await appStore.fetchAll({ page: 1 });
  }

  state = {
    lastScroll: 0,
    fixNav: false
  };

  componentDidMount() {
    this.threshold = this.getThreshold();
    if (this.props.rootStore.appStore.apps.length) {
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
    const { config, appStore, fixNav } = this.props.rootStore;

    return (
      <Fragment>
        <Banner />
        <div className={styles.contentOuter}>
          <div className={classnames(styles.content, { [styles.fixNav]: fixNav })}>
            <Nav className={styles.nav} navs={config.navs} />
            <AppList className={styles.apps} apps={appStore.apps} />
          </div>
        </div>
      </Fragment>
    );
  }
}
