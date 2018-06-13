import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import Button from 'components/Base/Button';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, appVersionStore }, { appId }) {
    await appStore.fetch(appId);
    await appVersionStore.fetchAll(appId);
  }

  render() {
    const { appStore, appVersionStore } = this.props.rootStore;
    const appDetail = toJS(appStore.appDetail);
    const appVersions = toJS(appVersionStore.versions);

    return (
      <div className={styles.app}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Link to="/apps">
              <i className="fa fa-long-arrow-left" /> 返回到Apps
            </Link>
          </div>
          <div className={styles.detail}>
            <div className={styles.intro}>
              <div className={styles.title}>{appDetail.name}</div>
              <div className={styles.carousel}>{appDetail.screenshots}</div>
              <div className={styles.desc}>{appDetail.description}</div>
              <div className={styles.versions}>
                <p>VERSION AVAILABLE</p>
                <ul>
                  {appVersions.map(version => {
                    const { version_id } = version;
                    return <li key={version_id}>{version_id}</li>;
                  })}
                </ul>
              </div>
            </div>
            <div className={styles.meta}>
              <Link to={`/dashboard/app/${appDetail.app_id}/deploy`}>
                <Button className={styles.deployBtn} type="primary">
                  Deploy
                </Button>
              </Link>
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
                <div className={styles.sectionContent}>基础设施</div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>应用 ID</p>
                <div className={`${styles.sectionContent} id`}>{appDetail.app_id}</div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>CLOUD MANUFACTURE</p>
                <div className={styles.sectionContent}>{appDetail.source}</div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>支持平台</p>
                <div className={styles.sectionContent}>Amazon, Microsoft, Google, QingCloud</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
