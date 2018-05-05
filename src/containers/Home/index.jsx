import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';

import { getScrollTop } from 'src/utils';

import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class Home extends Component {
  static async onEnter({ appStore }) {
    await appStore.fetchApps();
  }

  componentDidMount() {
    window.onscroll = this.handleScoll;
    this.setState({ threshold: this.getThreshold() });
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
    const { threshold } = this.state;
    const { rootStore } = this.props;

    if (threshold <= 0) {
      return;
    }

    let fixNav = rootStore.fixNav;
    if (!fixNav && getScrollTop() > threshold) {
      fixNav = true;
      rootStore.setNavFix(fixNav);
    } else if (fixNav && getScrollTop() <= threshold) {
      fixNav = false;
      rootStore.setNavFix(fixNav);
    }
  };

  render() {
    const { config, appStore, fixNav } = this.props.rootStore;
    const fold = fixNav;
    const isAdmin = true && fixNav;

    return (
      <div className={styles.home}>
        <Banner />
        <div className={classnames(styles.content, { [styles.fixNav]: fixNav })}>
          <Nav className={styles.nav} navs={config.navs} />
          <AppList className={styles.apps} apps={appStore.apps} fold={fold} />
        </div>
      </div>
    );
  }
}
