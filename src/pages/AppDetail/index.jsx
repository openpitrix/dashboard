import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import Button from 'components/Base/Button';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore }, params) {
    await appStore.fetchApp(params.appId);
  }

  render() {
    const { appStore } = this.props.rootStore;

    return (
      <div className={styles.app}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Link to="/apps">
              <i className="fa fa-long-arrow-left" /> 返回到目录
            </Link>
          </div>
          <div className={styles.detail}>
            <div className={styles.intro}>
              <div className={styles.title} />
              <div className={styles.carousel} />
              <div className={styles.desc}>
                Esgyn是Apache™trafodion（孵化）项目的主要贡献者。trafodion是Apache
                2014开源发布，在2015年5月成为一个Apache项目。从过去的十年中，它拥有100多个专利和3亿美元的投资，它的代码基础已经在从业务处理到大数据的各种企业工作负载中得到了验证。Apache
                trafodion基础上的可扩展性，弹性，和Apache
                Hadoop®数据结构的灵活性和带来操作SQL功能，包括保证事务完整性的Hadoop。Esgyn总理提供esgyndb，硬化，安全，对Hadoop的解决方案，是由Apache
                trafodion供电企业级SQL。
              </div>
              <div className={styles.versions}>
                <p>VERSION AVAILABLE</p>
                <ul>
                  <li />
                  <li />
                </ul>
              </div>
            </div>
            <div className={styles.meta}>
              <Link to={`/dashboard/app/${appStore.appDetail.app_id}/deploy`}>
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
                <div className={`${styles.sectionContent} id`}>app-m05yzy0f</div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>CLOUD MANUFACTURE</p>
                <div className={styles.sectionContent}>EsgynDB</div>
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
