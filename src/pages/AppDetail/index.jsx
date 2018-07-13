import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import ReactMarkdown from 'react-markdown';

import Layout, { BackBtn } from 'components/Layout/Admin';
import Button from 'components/Base/Button';
import { getParseDate } from 'utils';
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
    await appStore.fetch(appId);
    await appVersionStore.fetchAll({ app_id: appId });
  }

  render() {
    const { appStore, appVersionStore } = this.props;
    const appDetail = appStore.appDetail;
    const appVersions = appVersionStore.versions.toJSON();

    return (
      <Layout noTabs={true}>
        <div className={styles.wrapper}>
          <BackBtn label="catalog" link="/apps" />
          <div className={styles.detail}>
            <div className={styles.intro}>
              <div className={styles.titleOuter}>
                <img src={appDetail.icon} className={styles.icon} alt="Icon" />
                <div className={styles.title}>{appDetail.name}</div>
                <div className={styles.carousel}>{appDetail.screenshots}</div>
                <div className={styles.desc}>{appDetail.description}</div>
              </div>
              <div className={styles.markdown}>
                <ReactMarkdown source={appDetail.readme} />
              </div>
              <div className={styles.section}>
                <div className={styles.conTitle}>Introduce</div>
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
                    Deploy
                  </Button>
                </Link>
                <div className={styles.versions}>
                  <p>Chart Versions</p>
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
                  <div className={styles.title}>Application Version</div>
                  <div className={styles.value}>
                    {appDetail.latest_app_version && appDetail.latest_app_version.name}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>Home</div>
                  <div className={styles.value}>{appDetail.home}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>Source repository</div>
                  <div className={styles.value}>{appDetail.sources}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>Maintainers</div>
                  <div className={styles.value}>{appDetail.maintainers}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>Related</div>
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
