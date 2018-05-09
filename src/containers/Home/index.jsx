import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';

import { getScrollTop } from 'src/utils';

import Nav from 'components/Nav';
import Banner from 'components/Banner';
import AppList from 'components/AppList';
import styles from './index.scss';

import preload from 'hoc/preload';

@inject('rootStore')
@observer
@preload()
export default class Home extends Component {
  componentDidMount() {
    window.onscroll = this.handleScoll;
    this.threshold = this.getThreshold();
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
    if (!fixNav && getScrollTop() > this.threshold) {
      fixNav = true;
      rootStore.setNavFix(fixNav);
    } else if (fixNav && getScrollTop() <= this.threshold) {
      fixNav = false;
      rootStore.setNavFix(fixNav);
    }
  };

  render() {
    const { config, appStore, fixNav } = this.props.rootStore;

    return (
      <Fragment>
        <Banner />
        <div className={classnames(styles.content, { [styles.fixNav]: fixNav })}>
          <Nav className={styles.nav} navs={config.navs} />
          <AppList className={styles.apps} apps={appStore.apps} fold={fixNav} />
        </div>
      </Fragment>
    );
  }
}
