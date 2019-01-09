import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Button, Image } from 'components/Base';
import Layout, { BackBtn, CreateResource, BreadCrumb } from 'components/Layout';

import { Group as DeployGroup } from 'components/Deploy';
import VMParser from 'lib/config-parser/vm';
import { getFormData } from 'utils';

import styles from './index.scss';

const validKeyPrefix = ['cluster', 'node', 'env'];
const keysShouldBeNumber = [
  'cpu',
  'memory',
  'storage_size',
  'volume_size',
  'instance_class',
  'count'
];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  repoStore: rootStore.repoStore,
  appDeployStore: rootStore.appDeployStore,
  user: rootStore.user
}))
@observer
export default class AppDeploy extends Component {
  constructor(props) {
    super(props);
    this.vmParser = new VMParser();
  }

  async componentDidMount() {
    const {
      appStore, repoStore, appDeployStore, user, match
    } = this.props;
    const { appId } = match.params;

    await appStore.fetch(appId);
    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }

    const repoProviders = _.get(repoStore.repoDetail, 'providers', []);
    const isK8s = repoProviders.includes('kubernetes');
    appDeployStore.isK8s = isK8s;

    // fetch runtimes
    await appDeployStore.fetchRuntimes({
      status: 'active',
      label: repoStore.getStringFor('selectors'),
      provider: repoProviders,
      owner: user.user_id
    });

    if (!isK8s) {
      appDeployStore.runtimeId = _.get(
        appDeployStore.runtimes.slice(),
        '[0].runtime_id'
      );
      await appDeployStore.fetchSubnetsByRuntime(appDeployStore.runtimeId);
    }

    // fetch versions
    await appDeployStore.fetchVersions({ app_id: [appId] });
    appDeployStore.versionId = _.get(
      appDeployStore.versions.slice(),
      '[0].version_id'
    );
    await appDeployStore.fetchFilesByVersion(appDeployStore.versionId, isK8s);

    if (!isK8s && !_.isEmpty(appDeployStore.configJson)) {
      this.vmParser.setConfig(appDeployStore.configJson);
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.props.appDeployStore.reset();
  }

  handleSubmit = async e => {
    e.preventDefault();

    const {
      appDeployStore, user, history, match, t
    } = this.props;
    const { isK8s, create } = appDeployStore;

    const formData = this.getFormDataByKey();
    const name = _.get(formData, 'cluster.name', '');
    if (!name) {
      return appDeployStore.error(t('Name should not be empty'));
    }

    let conf;
    if (isK8s) {
      const yamlStr = _.get(formData, 'values.yaml', '');
      if (!yamlStr) {
        return appDeployStore.error(t('Invalid yaml'));
      }
      conf = [`Name: ${name}`, yamlStr].join('\n').replace(/#.*/g, '');
    } else {
      conf = JSON.stringify({
        cluster: _.extend(
          {},
          this.getFormDataByKey('cluster'),
          this.getConfByKey()
        ),
        env: this.getConfByKey('env')
      });
    }

    const versionId = formData['cluster.version'] || '';
    const runtimeId = formData['cluster.runtime'] || '';

    if (!versionId) {
      return appDeployStore.info(t('Version should not be empty'));
    }
    if (!runtimeId) {
      return appDeployStore.info(t('Runtime should not be empty'));
    }

    const res = await create({
      app_id: match.params.appId,
      version_id: versionId,
      runtime_id: runtimeId,
      conf: conf.replace(/>>>>>>/g, '.')
    });

    if (res && _.get(res, 'cluster_id')) {
      appDeployStore.success(t('Deploy app successfully'));
      const path = user.isNormal ? '/purchased' : '/dashboard/clusters';
      setTimeout(() => history.push(path), 1000);
    }
  };

  handleCancel = () => {
    this.props.history.go(-1);
  };

  getFormDataByKey = (keyPrefix = '') => {
    const formData = getFormData(this.deployForm);

    if (!keyPrefix) {
      return formData;
    }

    if (validKeyPrefix.indexOf(keyPrefix) < 0) {
      throw Error(`invalid keyPrefix: ${keyPrefix}`);
    }

    if (!keyPrefix.endsWith('.')) {
      keyPrefix += '.';
    }

    const dataByPrefix = _.pickBy(
      formData,
      (val, key) => key.indexOf(keyPrefix) === 0
    );

    return _.mapKeys(dataByPrefix, (val, key) => key.substring(keyPrefix.length));
  };

  /**
   *
   * @param confKey node | env
   * @returns {*}
   */
  getConfByKey = (confKey = 'node') => {
    const conf = this.getFormDataByKey(confKey);

    return _.transform(
      conf,
      (res, val, key) => {
        const [role, meter] = key.split('.');
        res[role] = res[role] || {};
        res[role][meter] = keysShouldBeNumber.indexOf(meter) > -1 ? parseInt(val) : val;
      },
      {}
    );
  };

  renderAside() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    return (
      <div className={styles.aside}>
        <div className={styles.appIntro}>
          <Image
            src={appDetail.icon}
            className={styles.icon}
            iconLetter={appDetail.name}
          />
          <span className={styles.name}>{appDetail.name}</span>
        </div>
        <p>{t('Deploy App explain')}</p>
      </div>
    );
  }

  renderForEmptyItem = itemKey => {
    const { t } = this.props;

    if (!this.isDeployReady()) {
      return null;
    }

    if (itemKey === 'cluster.runtime') {
      return (
        <span>
          {t('DEPLOY_NO_RUNTIME_NOTE')}
          <Link to={'/dashboard/runtime/create'}>{t('create')}</Link>
        </span>
      );
    }
  };

  renderBody() {
    if (!this.isDeployReady()) {
      return null;
    }

    const { appDeployStore, t } = this.props;
    const {
      isK8s,
      yamlStr,
      normalizeRuntime,
      normalizeVersions,
      normalizeSubnets,
      onChangeFormField,
      runtimeId,
      versionId
    } = appDeployStore;

    let groups = [];

    if (!isK8s) {
      if (!this.vmParser.isReady()) {
        return null;
      }

      this.vmParser.setSubnets(normalizeSubnets());
    }

    // always set runtimes and versions
    this.vmParser.setRuntimes(normalizeRuntime(), { default: runtimeId });
    this.vmParser.setVersions(normalizeVersions(), { default: versionId });

    if (isK8s) {
      groups = [].concat(
        {
          title: t('Basic settings'),
          items: this.vmParser.getDefaultBasicSetting({
            key: 'name',
            description: t('HELM_APP_NAME_TIP')
          })
        },
        {
          title: t('Deploy settings'),
          items: [
            {
              type: 'string',
              renderType: 'yaml',
              keyName: 'values.yaml',
              yaml: yamlStr
            }
          ]
        }
      );
    } else {
      const basicSetting = this.vmParser.getBasicSetting();
      const nodeSetting = this.vmParser.getNodeSetting();
      const envSetting = this.vmParser.getEnvSetting();
      const vxnetSetting = this.vmParser.getVxnetSetting();

      groups = [].concat(
        { title: t('Basic settings'), items: basicSetting },
        nodeSetting,
        { title: t('Vxnet settings'), items: vxnetSetting },
        envSetting
      );
    }

    return groups.map((group, idx) => (
      <DeployGroup
        detail={group}
        seq={idx}
        key={idx}
        onChange={onChangeFormField}
        onEmpty={this.renderForEmptyItem}
      />
    ));
  }

  isDeployReady() {
    const { configJson, yamlStr } = this.props.appDeployStore;
    return !_.isEmpty(configJson) || `${yamlStr}`;
  }

  renderFooter() {
    const { t } = this.props;
    const {
      isLoading,
      isK8s,
      runtimes,
      versions,
      subnets
    } = this.props.appDeployStore;

    if (!this.isDeployReady()) {
      return null;
    }

    let canSubmit = runtimes.length && versions.length;

    if (!isK8s) {
      canSubmit = canSubmit && subnets.length;
    }

    return (
      <div className={styles.actionBtnGroup}>
        <Button
          type="primary"
          onClick={this.handleSubmit}
          className={styles.btn}
          disabled={isLoading || !canSubmit}
        >
          {t('Confirm')}
        </Button>
        <Button onClick={this.handleCancel} className={styles.btn}>
          {t('Cancel')}
        </Button>
      </div>
    );
  }

  render() {
    const {
      appDeployStore, appStore, user, t
    } = this.props;
    const { appDetail } = appStore;
    const { isLoading, errMsg } = appDeployStore;

    const title = `${t('Deploy')} ${appDetail.name}`;
    const { isNormal, isDev } = user;
    const linkPath = isDev ? 'My Apps>Test>Deploy' : 'Store>All Apps>Deploy';

    return (
      <Layout
        className={classnames({ [styles.deployApp]: !isNormal })}
        title="Store"
        hasSearch
        isLoading={isLoading}
        backBtn={
          isNormal && (
            <BackBtn
              label={appDetail.name}
              link={`/apps/${appDetail.app_id}`}
            />
          )
        }
      >
        {!isNormal && <BreadCrumb linkPath={linkPath} />}

        <CreateResource
          title={title}
          aside={this.renderAside()}
          asideTitle=""
          footer={this.renderFooter()}
        >
          {errMsg && <p className={styles.errMsg}>{t(errMsg)}</p>}
          <form
            className={styles.createForm}
            method="post"
            onSubmit={this.handleSubmit}
            ref={node => {
              this.deployForm = node;
            }}
          >
            {this.renderBody()}
          </form>
        </CreateResource>
      </Layout>
    );
  }
}
