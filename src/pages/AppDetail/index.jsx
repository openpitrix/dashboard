import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';

import Layout, { BackBtn } from 'components/Layout/Admin';
import Button from 'components/Base/Button';
import { getParseDate, imgPlaceholder } from 'utils';
import trans, { __ } from 'hoc/trans';
import styles from './index.scss';

@trans()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore
}))
@observer
export default class AppDetail extends Component {
  static async onEnter({ appStore, appVersionStore }, { appId }) {
    appStore.currentPic = 1;
    await appStore.fetch(appId);
    await appVersionStore.fetchAll({ app_id: appId });
  }

  changePicture = (type, number) => {
    const { appStore } = this.props;
    const pictures = [1, 2, 3, 4, 5, 6, 7, 8];
    if (type === 'dot') {
      appStore.currentPic = number;
    }
    if (type === 'pre' && appStore.currentPic > 2) {
      appStore.currentPic -= 2;
    }
    if (type === 'next' && appStore.currentPic + 2 < pictures.length) {
      appStore.currentPic += 2;
    }
  };

  render() {
    const { appStore, appVersionStore } = this.props;
    const appDetail = appStore.appDetail;
    const appVersions = appVersionStore.versions.toJSON();
    const imgPhd = imgPlaceholder(64);
    const pictures = [1, 2, 3, 4, 5, 6, 7, 8];
    const picWidth = 276 * pictures.length + 'px';
    const picLeft = (1 - appStore.currentPic) * 276 + 'px';

    return (
      <Layout noTabs>
        <div className={styles.wrapper}>
          <BackBtn label="catalog" link="/apps" />
          <div className={styles.detail}>
            <div className={styles.intro}>
              <div className={styles.titleOuter}>
                <img src={appDetail.icon || imgPhd} className={styles.icon} alt="Icon" />
                <div className={styles.title}>{appDetail.name}</div>
                <div className={styles.carousel}>{appDetail.screenshots}</div>
                <div className={styles.desc}>{appDetail.description}</div>
              </div>
              <div className={styles.markdown}>
                <ReactMarkdown source={appDetail.readme} />
              </div>
              <div className={styles.section}>
                <div className={styles.conTitle}>Introduce</div>
                <div className={styles.description}>
                  is the Apache trafodion (the main contribution of the project hatch). Trafodion is
                  the open source release of Apache 2014 and became a Apache project in May 2015. In
                  the past ten years.
                </div>
                <div className={styles.slider}>
                  <label className={styles.pre} onClick={() => this.changePicture('pre')}>
                    pre
                  </label>
                  <label className={styles.next} onClick={() => this.changePicture('next')}>
                    next
                  </label>
                  <div className={styles.dotList}>
                    {pictures.map(data => {
                      if ((data + 1) % 2 === 0) {
                        return (
                          <label
                            key={data}
                            className={classnames(styles.dot, {
                              [styles.active]: appStore.currentPic === data
                            })}
                            onClick={() => this.changePicture('dot', data)}
                          />
                        );
                      }
                    })}
                  </div>
                  <div className={styles.listOuter}>
                    <ul className={styles.pictureList} style={{ width: picWidth, left: picLeft }}>
                      {pictures.map(data => (
                        <li className={styles.pictureOuter} key={data}>
                          <div className={styles.picture}>{data}</div>
                        </li>
                      ))}
                    </ul>
                    <div />
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <div className={styles.conTitle}>Information</div>
                <div className={styles.information}>
                  <dl>
                    <dt>Catelog</dt>
                    <dd>
                      {get(appDetail, 'category_set', [])
                        .filter(cate => cate.category_id)
                        .map(cate => cate.name)
                        .join(', ')}
                    </dd>
                  </dl>
                  <dl>
                    <dt>Application ID</dt>
                    <dd>{appDetail.app_id}</dd>
                  </dl>
                  <dl>
                    <dt>Repo</dt>
                    <dd>{appDetail.repo_id}</dd>
                  </dl>
                  <dl>
                    <dt>Created At</dt>
                    <dd>{getParseDate(appDetail.create_time)}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className={styles.meta}>
              <div className={styles.detailCard}>
                <Link to={`/dashboard/app/${appDetail.app_id}/deploy`}>
                  <Button className={styles.deployBtn} type="primary">
                    {__('Deploy')}
                  </Button>
                </Link>
                <div className={styles.versions}>
                  <p>{__('Chart Versions')}</p>
                  <ul>
                    {appVersions.map(version => (
                      <li key={version.version_id}>
                        {version.name}
                        <span className={styles.time}>{getParseDate(version.create_time)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div />
              </div>
              <div className={styles.detailCard}>
                <div className={styles.item}>
                  <div className={styles.title}>{__('Application Version')}</div>
                  <div className={styles.value}>
                    {appDetail.latest_app_version && appDetail.latest_app_version.name}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>{__('Home')}</div>
                  <div className={styles.value}>{appDetail.home}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>{__('Source repository')}</div>
                  <div className={styles.value}>{appDetail.sources}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>{__('Maintainers')}</div>
                  <div className={styles.value}>{appDetail.maintainers}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>{__('Related')}</div>
                  <div className={styles.value} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
