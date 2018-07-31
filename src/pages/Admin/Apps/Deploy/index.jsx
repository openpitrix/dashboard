import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';

import { Radio, Button, Input, Select, Slider, Image } from 'components/Base';
import Layout, { BackBtn, CreateResource } from 'components/Layout';
import Cell from './Cell/index.jsx';
import YamlCell from './Cell/YamlCell.jsx';
import { get } from 'lodash';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  repoStore: rootStore.repoStore,
  appDeployStore: rootStore.appDeployStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class AppDeploy extends Component {
  static async onEnter({ appStore, repoStore, appDeployStore }, { appId }) {
    appDeployStore.appId = appId;

    await appStore.fetch(appId);

    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }

    const repoProviders = get(repoStore.repoDetail, 'providers', []);
    appDeployStore.isKubernetes = repoProviders.includes('kubernetes');
    await appDeployStore.fetchVersions({ app_id: [appId] }, true);

    const labels = get(repoStore.repoDetail, 'labels', []);
    const queryLabel = labels
      .filter(label => label.label_key)
      .map(label => [label.label_key, label.label_value].join('='))
      .join('&');

    await appDeployStore.fetchRuntimes({
      status: 'active',
      label: queryLabel,
      provider: repoProviders
    });
  }

  render() {
    const { appDeployStore, appStore } = this.props;
    const appName = appStore.appDetail.name + '';
    const { notifyMsg, notifyType, hideMsg, isKubernetes } = appDeployStore;
    const title = `Deploy ${appName}`;

    return (
      <Layout
        msg={notifyMsg}
        hideMsg={hideMsg}
        noTabs
        backBtn={<BackBtn label="clusters" link="/dashboard/clusters" />}
      >
        <CreateResource title={title} aside={this.renderAside()} asideTitle={''}>
          {isKubernetes ? this.renderYamlForm() : this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }

  renderAside() {
    const { appStore } = this.props;
    const { appDetail } = appStore;

    return (
      <div className={styles.aside}>
        <div className={styles.appIntro}>
          <Image src={appDetail.icon} size={24} className={styles.icon} />
          <span className={styles.name}>{appDetail.name}</span>
        </div>
        <p>
          OpenPitrix deploy application to any cloud provider, it's very simple, selected
          application want to deploy ,and then choose runtime (cloud provider), and press the
          button. it's done.
        </p>
      </div>
    );
  }

  renderForm() {
    const { appDeployStore, runtimeStore } = this.props;
    const {
      config,
      configBasics,
      configNodes,
      configEnvs,
      changeCell,
      handleSubmit,
      isLoading,
      runtimes,
      versions,
      subnets,
      versionId,
      runtimeId,
      subnetId,
      changeRuntime,
      changeVersion,
      changeSubnet
    } = appDeployStore;

    return (
      <form
        className={styles.createForm}
        method="post"
        onSubmit={handleSubmit.bind(appDeployStore)}
      >
        <div className={styles.moduleTitle}>1. Basic settings</div>
        {configBasics.map(
          (basic, index) =>
            basic.key !== 'subnet' && (
              <Cell
                key={basic.key}
                className={styles.cellModule}
                config={basic}
                type={`basic`}
                configIndex1={index}
                configIndex2={-1}
                changeCell={changeCell.bind(appDeployStore)}
              />
            )
        )}
        <div className={styles.cellModule}>
          <label className={styles.name}>Runtime</label>
          <Radio.Group className={styles.showWord} value={runtimeId} onChange={changeRuntime}>
            {runtimes &&
              runtimes.map(({ runtime_id, name }) => (
                <Radio key={runtime_id} value={runtime_id}>
                  {name}
                </Radio>
              ))}
          </Radio.Group>
        </div>
        <div className={styles.cellModule}>
          <label className={classnames(styles.name, styles.selectName)}>Version</label>
          <Select className={styles.select} value={versionId} onChange={changeVersion}>
            {versions.map(({ version_id, name }) => (
              <Select.Option key={version_id} value={version_id} title={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {configNodes &&
          configNodes.map((node, index1) => (
            <Fragment key={node.key}>
              <div className={styles.moduleTitle}>
                {index1 + 2}. Node Settings({node.key})
              </div>
              {node.properties.map((conf, index2) => (
                <Cell
                  key={conf.key}
                  className={styles.cellModule}
                  config={conf}
                  type={`node`}
                  configIndex1={index1}
                  configIndex2={index2}
                  changeCell={changeCell.bind(appDeployStore)}
                />
              ))}
            </Fragment>
          ))}

        <div className={styles.moduleTitle}>{configNodes.length + 2}. Vxnet Settings</div>
        <div className={styles.cellModule}>
          <label className={classnames(styles.name, styles.selectName)}>VxNet to Join</label>
          <Select className={styles.select} value={subnetId} onChange={changeSubnet}>
            {subnets.map(({ subnet_id, name }) => (
              <Select.Option key={subnet_id} value={subnet_id}>
                {subnet_id}
              </Select.Option>
            ))}
          </Select>
        </div>

        {configEnvs &&
          configEnvs.map((env, index1) => (
            <Fragment key={env.key}>
              <div className={styles.moduleTitle}>
                {index1 + configNodes.length + 3}.Environment Settings({env.key})
              </div>
              {env.properties.map((conf, index2) => (
                <Cell
                  key={conf.key}
                  className={styles.cellModule}
                  config={conf}
                  type={`env`}
                  configIndex1={index1}
                  configIndex2={index2}
                  changeCell={changeCell.bind(appDeployStore)}
                />
              ))}
            </Fragment>
          ))}

        <div className={styles.submitBtnGroup}>
          <Button
            type={`primary`}
            className={`primary`}
            htmlType="submit"
            disabled={appDeployStore.isLoading}
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              history.back();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  renderYamlForm() {
    const { appDeployStore, runtimeStore } = this.props;
    const {
      yamlConfig,
      changeYmalCell,
      handleSubmit,
      isLoading,
      runtimes,
      versions,
      versionId,
      runtimeId,
      changeName,
      changeRuntime,
      changeVersion
    } = appDeployStore;

    return (
      <form
        className={styles.createForm}
        method="post"
        onSubmit={handleSubmit.bind(appDeployStore)}
      >
        <div className={styles.moduleTitle}>1. Basic settings</div>
        <div className={styles.cellModule}>
          <label className={styles.name}>Name</label>
          <Input
            className={styles.input}
            name="Name"
            type="text"
            maxLength="50"
            onChange={changeName}
            required
          />
        </div>
        <div className={styles.cellModule}>
          <label className={styles.name}>Runtime</label>
          <Radio.Group className={styles.showWord} value={runtimeId} onChange={changeRuntime}>
            {runtimes &&
              runtimes.map(({ runtime_id, name }) => (
                <Radio key={runtime_id} value={runtime_id}>
                  {name}
                </Radio>
              ))}
          </Radio.Group>
        </div>
        <div className={styles.cellModule}>
          <label className={classnames(styles.name, styles.selectName)}>Version</label>
          <Select className={styles.select} value={versionId} onChange={changeVersion}>
            {versions.map(({ version_id, name }) => (
              <Select.Option key={version_id} value={version_id} title={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className={styles.moduleTitle}>2. Deploy Settings</div>
        {yamlConfig &&
          yamlConfig.map((conf, index) => (
            <YamlCell
              key={conf.name}
              name={conf.name}
              value={conf.value || ''}
              index={index}
              className={styles.cellModule}
              changeCell={changeYmalCell}
            />
          ))}

        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} htmlType="submit">
            Confirm
          </Button>
          <Button
            onClick={() => {
              history.back();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }
}
