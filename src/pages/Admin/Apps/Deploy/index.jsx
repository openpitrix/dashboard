import React, { Component, Fragment } from 'react';
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
  runtimeStore: rootStore.runtimeStore,
  user: rootStore.user
}))
@observer
export default class AppDeploy extends Component {
  constructor(props) {
    super(props);
    this.vmParser = new VMParser();
  }

  async componentDidMount() {
    const { appStore, repoStore, appDeployStore, user, match } = this.props;
    const { appId } = match.params;

    appDeployStore.loading = true;

    await appStore.fetch(appId);
    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }

    const repoProviders = _.get(repoStore.repoDetail, 'providers', []);
    const isK8s = (appDeployStore.isK8s = repoProviders.includes('kubernetes'));

    // fetch runtimes
    await appDeployStore.fetchRuntimes({
      status: 'active',
      label: repoStore.getStringFor('selectors'),
      provider: repoProviders,
      owner: user.user_id
    });

    if (!isK8s) {
      await appDeployStore.fetchSubnets(_.get(appDeployStore.runtimes[0], 'runtime_id'));
    }

    // fetch versions
    await appDeployStore.fetchVersions({ app_id: [appId] });
    await appDeployStore.fetchFilesByVersion(
      _.get(appDeployStore.versions[0], 'version_id'),
      isK8s
    );

    if (!isK8s) {
      console.log('config.json: ', appDeployStore.configJson);

      if (!_.isEmpty(appDeployStore.configJson)) {
        this.vmParser.setConfig(appDeployStore.configJson);
        this.vmParser.setSubnets(appDeployStore.normalizeSubnets());
      }
    }

    // always set runtimes and versions
    this.vmParser.setRuntimes(appDeployStore.normalizeRuntime());
    this.vmParser.setVersions(appDeployStore.normalizeVersions());

    appDeployStore.loading = false;
  }

  componentWillUnmount() {
    this.props.appDeployStore.reset();
  }

  handleSubmit = async e => {
    e.preventDefault();

    const { appDeployStore, user, history } = this.props;

    if (appDeployStore.isK8s) {
    } else {
      const clusterConf = _.extend({}, this.getFormDataByKey('cluster'), this.getNodesConf());
      const envConf = this.getFormDataByKey('env');
    }

    // const result = await appDeployStore.handleSubmit(event);
    //
    // if (!(result && result.err)) {
    //   const path = user.isNormal ? '/purchased' : '/dashboard/clusters';
    //   setTimeout(() => history.push(path), 1000);
    // }

    const formData = this.getFormDataByKey();
    console.log('submit form: ', formData);
  };

  handleCancel = () => {
    this.props.history.go(-1);
  };

  getFormDataByKey = (keyPrefix = '') => {
    const formData = getFormData(this.refs.deployForm);

    if (!keyPrefix) {
      return formData;
    }

    if (validKeyPrefix.indexOf(keyPrefix) < 0) {
      throw Error(`invalid keyPrefix: ${keyPrefix}`);
    }

    if (!keyPrefix.endsWith('.')) {
      keyPrefix += '.';
    }

    const dataByPrefix = _.pickBy(formData, (val, key) => {
      return key.indexOf(keyPrefix) === 0;
    });

    return _.mapKeys(dataByPrefix, (val, key) => {
      return key.substring(keyPrefix.length);
    });
  };

  getNodesConf = () => {
    const nodesConf = this.getFormDataByKey('node');

    return _.transform(
      nodesConf,
      (res, val, key) => {
        const [role, meter] = key.split('.');
        (res[role] || (res[role] = {}))[meter] =
          keysShouldBeNumber.indexOf(meter) > -1 ? parseInt(val) : val;
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
          <Image src={appDetail.icon} className={styles.icon} />
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
    const { appDeployStore, t } = this.props;
    const { isK8s, onChangeFormField, yamlStr } = appDeployStore;
    let groups = [];

    if (isK8s) {
      groups = [].concat(
        {
          title: 'Basic settings',
          items: this.vmParser.getDefaultBasicSetting({
            key: 'name',
            description: t('HELM_APP_NAME_TIP')
          })
        },
        {
          title: 'Deploy settings',
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
      if (_.isEmpty(this.vmParser.config)) {
        return null;
      }

      const basicSetting = this.vmParser.getBasicSetting();
      const nodeSetting = this.vmParser.getNodeSetting();
      const envSetting = this.vmParser.getEnvSetting();
      const vxnetSetting = this.vmParser.getVxnetSetting();

      groups = [].concat(
        { title: 'Basic settings', items: basicSetting },
        nodeSetting,
        { title: 'Vxnet settings', items: vxnetSetting },
        envSetting
      );
    }

    return groups.map((group, idx) => {
      return (
        <DeployGroup
          detail={group}
          seq={idx}
          key={idx}
          onChange={onChangeFormField}
          onEmpty={this.renderForEmptyItem}
        />
      );
    });
  }

  isDeployReady() {
    const { configJson, yamlStr } = this.props.appDeployStore;

    return !_.isEmpty(configJson) || yamlStr + '';
  }

  renderFooter() {
    const { runtimes, versions, subnets } = this.props.appDeployStore;

    if (!this.isDeployReady()) {
      return null;
    }

    // const canSubmit = runtimes.length && versions.length && subnets.length;
    // fixme
    const canSubmit = true;

    return (
      <div className={styles.actionBtnGroup}>
        <Button
          type="primary"
          onClick={this.handleSubmit}
          className={styles.btn}
          disabled={!canSubmit}
        >
          Confirm
        </Button>
        <Button onClick={this.handleCancel} className={styles.btn}>
          Cancel
        </Button>
      </div>
    );
  }

  render() {
    const { appDeployStore, appStore, user, t } = this.props;
    const { appDetail } = appStore;
    const { loading, errMsg } = appDeployStore;

    const title = `${t('Deploy')} ${appDetail.name}`;
    const { isNormal, isDev } = user;
    const linkPath = isDev ? 'My Apps>Test>Deploy' : 'Store>All Apps>Deploy';

    return (
      <Layout
        className={classnames({ [styles.deployApp]: !isNormal })}
        title="Store"
        hasSearch
        isLoading={loading}
        backBtn={isNormal && <BackBtn label={appDetail.name} link={`/store/${appDetail.app_id}`} />}
      >
        {!isNormal && <BreadCrumb linkPath={linkPath} />}

        <CreateResource
          title={title}
          aside={this.renderAside()}
          asideTitle=""
          footer={this.renderFooter()}
        >
          {errMsg && <p className={styles.errMsg}>{errMsg}</p>}
          <form
            className={styles.createForm}
            method="post"
            onSubmit={this.handleSubmit}
            ref="deployForm"
          >
            {this.renderBody()}
          </form>
        </CreateResource>
      </Layout>
    );
  }
}
