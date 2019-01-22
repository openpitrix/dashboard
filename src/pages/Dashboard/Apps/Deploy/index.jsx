import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Select, Image, Notification } from 'components/Base';
import {
  Section, Grid, Card, Stepper
} from 'components/Layout';
import { Group as DeployGroup } from 'components/Deploy';
import Loading from 'components/Loading';
import VMParser from 'lib/config-parser/vm';
import { getFormData } from 'utils';
import { getVersionTypesName } from 'config/version-types';
import routes, { toRoute, getPortalFromPath } from 'routes';

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
const providerMap = {
  vmbased: ['qingcloud', 'aws', 'aliyun'],
  helm: ['kubernetes']
};

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  appDeployStore: rootStore.appDeployStore,
  user: rootStore.user
}))
@observer
export default class AppDeploy extends Component {
  constructor(props) {
    super(props);
    this.vmParser = new VMParser();

    this.state = {
      activeType: '',
      activeVersion: ''
    };
  }

  async componentDidMount() {
    const {
      appStore, appVersionStore, appDeployStore, match
    } = this.props;
    const { appId } = match.params;

    await appStore.fetch(appId);

    // get typeversions
    await appVersionStore.fetchTypeVersions(appId);

    const { typeVersions } = appVersionStore;
    const defaultId = _.get(typeVersions, '[0].versions[0].version_id', '');
    const versionId = _.get(match, 'params.versionId', defaultId);

    // get version detail for default type and version number
    await appVersionStore.fetch(versionId);
    const { version } = appVersionStore;
    this.setState({
      activeType: version.type,
      activeVersion: versionId
    });

    // fetch config files for deploy form
    appDeployStore.versionId = versionId;
    await appDeployStore.fetchFilesByVersion(versionId);

    if (version.type === 'helm' || appDeployStore.yamlStr) {
      appDeployStore.isK8s = true;
      version.type = 'helm'; // for compatible old data
    } else {
      version.type = 'vmbased'; // for compatible old data
    }

    // fetch runtimes
    await appDeployStore.fetchRuntimes({
      provider: providerMap[version.type] || ''
    });

    if (!_.isEmpty(appDeployStore.configJson)) {
      this.vmParser.setConfig(appDeployStore.configJson);
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.props.appDeployStore.reset();
  }

  changeType = async (value, type) => {
    if (value !== this.state[type]) {
      const { appDeployStore, appVersionStore } = this.props;
      this.setState({ [type]: value });

      let versonId = '';
      if (type === 'activeType') {
        const { typeVersions } = appVersionStore;
        const selectItem = _.find(typeVersions, { type: value }) || {};

        appDeployStore.isK8s = value === 'helm';
        versonId = _.get(selectItem, 'versions[0].version_id', '');
        this.setState({ activeVersion: versonId });

        await appDeployStore.fetchRuntimes({
          provider: providerMap[value] || ''
        });
      } else {
        versonId = value;
      }

      await appDeployStore.changeVersion(versonId);
    }
  };

  isDeployReady() {
    const { configJson, yamlStr } = this.props.appDeployStore;
    return !_.isEmpty(configJson) || `${yamlStr}`;
  }

  handleSubmit = async () => {
    const {
      appDeployStore, user, history, match, t
    } = this.props;
    const {
      isK8s, runtimeId, versionId, create
    } = appDeployStore;
    const { appId } = match.params;

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
      conf = [`Name: ${name}`, yamlStr].join('\n').replace(/#.*|\r/g, '');
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

    const res = await create({
      app_id: appId,
      version_id: versionId,
      runtime_id: runtimeId,
      conf: conf.replace(/>>>>>>/g, '.')
    });

    if (res && _.get(res, 'cluster_id')) {
      appDeployStore.success(t('Deploy app successfully'));
      const path = getPortalFromPath() === 'user'
        ? toRoute(routes.portal._dev.sandboxInstances, { appId })
        : toRoute(routes.portal._user.clusters);
      setTimeout(() => history.push(path), 1000);
    }
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

  renderForEmptyItem = () => {
    if (!this.isDeployReady()) {
      return null;
    }
  };

  renderDeployForm() {
    if (!this.isDeployReady()) {
      return null;
    }

    const { appDeployStore, t } = this.props;
    const { isK8s, yamlStr, normalizeSubnets } = appDeployStore;

    let groups = [];

    if (isK8s) {
      groups = [].concat(
        {
          title: t('Basic info'),
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
      if (!this.vmParser.isReady()) {
        return null;
      }
      this.vmParser.setSubnets(normalizeSubnets());

      const basicSetting = this.vmParser.getBasicSetting();
      const nodeSetting = this.vmParser.getNodeSetting();
      const envSetting = this.vmParser.getEnvSetting();
      const vxnetSetting = this.vmParser.getVxnetSetting();

      groups = [].concat(
        { title: t('Basic info'), items: basicSetting },
        nodeSetting,
        { title: t('Vxnet settings'), items: vxnetSetting },
        envSetting
      );
    }

    return (
      <form
        method="post"
        onSubmit={this.handleSubmit}
        ref={node => {
          this.deployForm = node;
        }}
      >
        {groups.map((group, idx) => (
          <DeployGroup
            detail={group}
            seq={idx}
            key={idx}
            onEmpty={this.renderForEmptyItem}
          />
        ))}
      </form>
    );
  }

  renderRuntimes() {
    const { appDeployStore, t } = this.props;
    const { runtimes, changeRuntime, isK8s } = appDeployStore;
    const createK8S = isK8s ? '?provider=kubernetes' : '';

    return (
      <Card className={styles.selectRuntime}>
        <label className={styles.name}>{t('My Runtimes')}</label>
        <Select
          className={styles.select}
          value={appDeployStore.runtimeId}
          onChange={changeRuntime}
          disabled={runtimes.length === 0}
        >
          {runtimes.map(item => (
            <Select.Option key={item.runtime_id} value={item.runtime_id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
        <Link to={`${toRoute(routes.portal.runtimeCreate)}${createK8S}`}>
          {t('Create Runtime')}
        </Link>
      </Card>
    );
  }

  renderTypeVersions() {
    const { appVersionStore, t } = this.props;
    const { typeVersions } = appVersionStore;
    const { activeType, activeVersion } = this.state;

    const types = typeVersions.map(item => item.type);
    const versions = (_.find(typeVersions, { type: activeType }) || {}).versions || [];

    return (
      <div className={styles.typeVersions}>
        <dl>
          <dt>{t('Delivery type')}:</dt>
          <dd className={styles.types}>
            {types.map(type => (
              <label
                key={type}
                onClick={() => this.changeType(type, 'activeType')}
                className={classnames({
                  [styles.active]: (activeType || types[0]) === type
                })}
              >
                {getVersionTypesName(type) || t('None')}
              </label>
            ))}
          </dd>
        </dl>
        <dl>
          <dt>{t('Version No')}:</dt>
          <dd className={styles.types}>
            {versions.map(item => (
              <label
                key={item.version_id}
                onClick={() => this.changeType(item.version_id, 'activeVersion')
                }
                className={classnames({
                  [styles.active]: activeVersion === item.version_id
                })}
              >
                {item.name}
              </label>
            ))}
          </dd>
        </dl>
      </div>
    );
  }

  renderAppBaseInfo() {
    const { appStore } = this.props;
    const { appDetail } = appStore;

    return (
      <div className={styles.appBaseInfo}>
        <div
          className={classnames({
            [styles.title]: Boolean(appDetail.abstraction)
          })}
        >
          <span className={styles.icon}>
            <Image
              src={appDetail.icon}
              iconSize={48}
              iconLetter={appDetail.name}
            />
          </span>
          <div className={styles.name}>{appDetail.name}</div>
        </div>
        <div className={styles.abstraction}>{appDetail.abstraction}</div>
      </div>
    );
  }

  renderContent() {
    const { appDeployStore, t } = this.props;
    const { isLoading, errMsg } = appDeployStore;

    return (
      <Grid>
        <Section size={4}>
          <Card>
            {this.renderAppBaseInfo()}
            {this.renderTypeVersions()}
          </Card>
        </Section>
        <Section size={8}>
          {this.renderRuntimes()}
          <Loading isLoading={isLoading}>
            <Card className={styles.deployForm}>
              {errMsg && <p className={styles.errMsg}>{t(errMsg)}</p>}
              {this.renderDeployForm()}
            </Card>
          </Loading>
        </Section>
      </Grid>
    );
  }

  render() {
    const { appDeployStore, t } = this.props;
    const {
      activeStep, versionId, runtimeId, subnets, isK8s
    } = appDeployStore;
    const disableNextStep = !versionId || !runtimeId || (!isK8s && subnets.length === 0);

    return (
      <Stepper
        name="APP_DEPLOY"
        stepOption={{
          activeStep,
          disableNextStep,
          steps: 1,
          btnText: t('Deploy'),
          nextStep: this.handleSubmit
        }}
      >
        {activeStep === 1 && this.renderContent()}
        <Notification />
      </Stepper>
    );
  }
}
