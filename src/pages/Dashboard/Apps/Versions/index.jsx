import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Button } from 'components/Base';
import Layout, {
  Grid, Row, Section, Card
} from 'components/Layout';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore
}))
@observer
export default class Versions extends Component {
  async componentDidMount() {
    const { appVersionStore, match } = this.props;
    const { appId } = match.params;

    await appVersionStore.fetchAll({ app_id: appId });
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  render() {
    const { appVersionStore, t } = this.props;
    const { versions } = appVersionStore;
    const addMethods = [
      {
        iconName: 'cloud',
        name: 'VM',
        versions
        /* versions: [
          { name: '0.0.1', status: 'passed' },
          { name: '0.0.2', status: 'suspended' },
          { name: '0.0.3', status: 'active' },
          { name: '0.0.4', status: 'rejected' },
          { name: '0.0.5', status: 'submitted' },
          { name: '0.0.6', status: 'draft' }
        ] */
      },
      {
        iconName: 'bigdata',
        name: '业务',
        versions: [{ name: '0.0.1', status: 'draft' }, { name: '0.0.2', status: 'submitted' }]
      }
    ];
    const otherMethods = [
      {
        iconName: 'container',
        name: 'Helm',
        description:
          '轻量级、可移植、自包含的软件打包技术，使应用可以在几乎任何地方以相同的方式运行。'
      },
      {
        iconName: 'vnc',
        name: '原生',
        description:
          '轻量级、可移植、自包含的软件打包技术，使应用可以在几乎任何地方以相同的方式运行。'
      },
      {
        iconName: 'laptop',
        name: 'SaaS',
        description:
          '云端集中式托管软件及其相关的数据，软件仅需透过互联网，而不须透过安装即可使用。'
      },
      {
        iconName: 'pod',
        name: 'Serverless',
        description: 'Serverless Framework是无服务器应用框架和生态系统。'
      }
    ];

    return (
      <Layout className={styles.versions} detailPage="版本">
        <div>
          <div className={styles.title}>已添加的交付方式(2)</div>
          {addMethods.map(method => (
            <div key={method.name} className={styles.addMethod}>
              <div className={styles.name}>
                <Icon name={method.iconName} size={24} className={styles.icon} type="dark" />
                {method.name}
              </div>
              <div className={styles.versions}>
                <span className={styles.total}>版本：{method.versions.length}</span>
                {method.versions.map(version => (
                  <Link
                    key={version.name}
                    className={classnames(styles.version, [styles[version.status]])}
                    to={version.version_id ? `/dashboard/version/${version.version_id}` : '#'}
                  >
                    <label className={styles.dot} />
                    {version.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className={styles.title}>其他交付方式</div>
          {otherMethods.map(method => (
            <div key={method.name} className={styles.otherMethod}>
              <div className={styles.name}>
                <Icon name={method.iconName} size={20} className={styles.icon} type="dark" />
                {method.name}
              </div>
              <div className={styles.description}>{method.description}</div>
              <Button className={styles.button} type="primary">
                <Icon name="add" type="white" className={styles.addIcon} />
                创建新版本
              </Button>
            </div>
          ))}
        </div>
      </Layout>
    );
  }
}
