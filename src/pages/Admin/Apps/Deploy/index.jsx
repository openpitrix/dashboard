import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { Link } from 'react-router-dom';
import { Radio, Button, Input, Select, Slider } from 'components/Base';
import Layout, { BackBtn, CreateResource } from 'components/Layout/Admin';
import Cell from './Cell/index.jsx';
import { get } from 'lodash';

import styles from './index.scss';
import classNames from 'classnames';

@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  appDeployStore: rootStore.appDeployStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class AppDeploy extends Component {
  static async onEnter({ appStore, appDeployStore, runtimeStore }, params) {
    appDeployStore.appId = params.appId;
    await appDeployStore.fetchVersions({ app_id: [params.appId] }, true);
    await appDeployStore.fetchRuntimes();
  }

  render() {
    const { appDeployStore } = this.props;
    const { notifyMsg, hideMsg } = appDeployStore;
    const title = 'Deploy app';
    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg} isLoading={appDeployStore.isLoading}>
        <BackBtn label="clusters" link="/dashboard/clusters" />
        <CreateResource title={title} aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }

  renderAside() {
    return (
      <Fragment>
        <p>
          Application repos are labelled for GUI to show in category list, and have label selector
          to choose which runtime to run when user deploys any application that belongs to the repo.
        </p>
        <p>Runtime env is labelled. A runtime can have multiple labels.</p>
        <p>
          Repo indexer will scan configured repo list periodically and cache the metadata of the
          repos.
        </p>
        <p>Repo manager is responsible for creating/deleting/updating repos.</p>
      </Fragment>
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
      versions,
      runtimes,
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
        {configBasics &&
          configBasics.map(
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
          <label className={styles.name}>Version</label>
          <Select className={styles.select} value={versionId} onChange={changeVersion}>
            {versions.map(({ version_id, name }) => (
              <Select.Option key={version_id} value={version_id}>
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
          <label className={styles.name}>VxNet to Join</label>
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
                  configIndex={index1}
                  configIndex2={index2}
                  changeCell={changeCell.bind(appDeployStore)}
                />
              ))}
            </Fragment>
          ))}

        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} htmlType="submit" disabled={isLoading}>
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
