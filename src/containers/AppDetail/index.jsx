import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import Button from 'components/Base/Button';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore }, { appId }) {
    await appStore.fetchApp(appId);
  }

  render() {
    const { appStore } = this.props.rootStore;

    return (
      <div className={styles.app}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Link to="/apps"><i className="fa fa-long-arrow-left"/> 返回到目录</Link>
          </div>
          <div className={styles.detail}>
            <div className={styles.intro}>
              Intro
            </div>
            <div className={styles.meta}>
              <Button className={styles.deployBtn} type="primary">Deploy</Button>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>快速链接</p>
                <div className={styles.sectionContent}>
                  <Link to="#">开发者网站</Link>
                  <Link to="#">服务条款</Link>
                  <Link to="#">应用说明</Link>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>应用分类</p>
                <div className={styles.sectionContent}>
                基础设施
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>应用 ID</p>
                <div className={styles.sectionContent}>
                app-m05yzy0f
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>CLOUD MANUFACTURE</p>
                <div className={styles.sectionContent}>
                EsgynDB
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>支持平台</p>
                <div className={styles.sectionContent}>
                Amazon, Microsoft, Google, QingCloud
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
