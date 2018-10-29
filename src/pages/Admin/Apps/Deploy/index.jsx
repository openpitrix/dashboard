import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { get } from 'lodash';

import { Radio, Button, Input, Select, CodeMirror, Image } from 'components/Base';
import Layout, { BackBtn, CreateResource, BreadCrumb } from 'components/Layout';
import Cell from './Cell/index.jsx';
import YamlCell from './Cell/YamlCell.jsx';

import styles from './index.scss';

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
  async componentDidMount() {
    const { appStore, repoStore, appDeployStore, user, match } = this.props;
    const { appId } = match.params;

    appDeployStore.appId = appId;
    appStore.isLoading = true;
    await appStore.fetch(appId);

    if (appStore.appDetail.repo_id) {
      await repoStore.fetchRepoDetail(appStore.appDetail.repo_id);
    }

    const repoProviders = get(repoStore.repoDetail, 'providers', []);
    appDeployStore.isKubernetes = repoProviders.includes('kubernetes');
    await appDeployStore.fetchVersions({ app_id: [appId] }, true);

    const querySelector = repoStore.getStringFor('selectors');

    await appDeployStore.fetchRuntimes({
      status: 'active',
      label: querySelector,
      provider: repoProviders,
      owner: user.user_id
    });
    appStore.isLoading = false;
  }

  deploySubmit = async event => {
    const { appDeployStore, user, history } = this.props;
    const result = await appDeployStore.handleSubmit(event);

    if (!(result && result.err)) {
      const path = user.isNormal ? '/purchased' : '/dashboard/clusters';
      setTimeout(() => history.push(path), 1000);
    }
  };

  renderRuntimeItem() {
    const { appDeployStore, t } = this.props;
    const { runtimes, runtimeId, changeRuntime } = appDeployStore;

    if (runtimes.length) {
      return (
        <div className={styles.cellModule}>
          <label className={classnames(styles.name, styles.radioName)}>Runtime</label>
          <Radio.Group className={styles.showWord} value={runtimeId} onChange={changeRuntime}>
            {runtimes.map(({ runtime_id, name }) => (
              <Radio key={runtime_id} value={runtime_id}>
                {name}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      );
    }

    return (
      <div className={styles.cellModule}>
        <label className={classnames(styles.name, styles.radioName)}>Runtime</label>
        <span className={styles.createRuntime}>
          {t('DEPLOY_NO_RUNTIME_NOTE')}
          <Link to={'/dashboard/runtime/create'}>{t('create')}</Link>
        </span>
      </div>
    );
  }

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

  renderForm() {
    const { appDeployStore, t } = this.props;
    const {
      configBasics,
      configNodes,
      configEnvs,
      changeCell,
      isLoading,
      runtimes,
      versions,
      subnets,
      versionId,
      subnetId,
      changeVersion,
      changeSubnet
    } = appDeployStore;
    const btnDisabled = isLoading || !configBasics.length || !runtimes.length;

    return (
      <form className={styles.createForm} method="post" onSubmit={this.deploySubmit}>
        <div className={styles.moduleTitle}>1. {t('Basic Settings')}</div>
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
        {!isLoading && this.renderRuntimeItem()}
        <div className={styles.cellModule}>
          <label className={classnames(styles.name, styles.selectName)}>Version</label>
          <Select
            className={styles.select}
            value={versionId}
            onChange={changeVersion}
            disabled={versions.length === 0}
          >
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
                {index1 + 2}. {t('Node Settings')}({node.key})
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

        <div className={styles.moduleTitle}>
          {configNodes.length + 2}. {t('Vxnet Settings')}
        </div>
        <div className={styles.cellModule}>
          <label className={classnames(styles.name, styles.selectName)}>VxNet to Join</label>
          <Select
            className={styles.select}
            value={subnetId}
            onChange={changeSubnet}
            disabled={subnets.length === 0}
          >
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
                {index1 + configNodes.length + 3}. {t('Environment Settings')}({env.key})
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
          <Button type={`primary`} className={`primary`} htmlType="submit" disabled={btnDisabled}>
            {t('Confirm')}
          </Button>
          <Button
            onClick={() => {
              history.back();
            }}
          >
            {t('Cancel')}
          </Button>
        </div>
      </form>
    );
  }

  renderYamlForm() {
    const { appDeployStore, t } = this.props;
    const {
      yamlConfig,
      yamlStr,
      changeYamlStr,
      isLoading,
      runtimes,
      versions,
      versionId,
      changeName,
      changeVersion
    } = appDeployStore;
    const btnDisabled = isLoading || yamlStr === '' || !yamlConfig.length || !runtimes.length;

    return (
      <form className={styles.createForm} method="post" onSubmit={this.deploySubmit}>
        <div className={styles.moduleTitle}>1. {t('Basic Settings')}</div>
        <div className={styles.cellModule}>
          <label className={styles.name}>Name</label>
          <div className={styles.helmNameWrap}>
            <Input
              className={styles.input}
              name="name"
              type="text"
              maxLength="50"
              onChange={changeName}
              required
            />
            <p className={styles.helmAppNameTip}>{t('HELM_APP_NAME_TIP')}</p>
          </div>
        </div>
        {!isLoading && this.renderRuntimeItem()}
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

        <div className={styles.moduleTitle}>2. {t('Deploy Settings')}</div>

        <div className={styles.editorWrap}>
          <div className={styles.fileName}>values.yaml</div>
          <div className={styles.editor}>
            {yamlStr && <CodeMirror code={yamlStr} onChange={changeYamlStr} />}
          </div>
        </div>

        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} htmlType="submit" disabled={btnDisabled}>
            {t('Confirm')}
          </Button>
          <Button
            onClick={() => {
              history.back();
            }}
          >
            {t('Cancel')}
          </Button>
        </div>
      </form>
    );
  }

  render() {
    const { appDeployStore, appStore, user, t } = this.props;
    const appName = appStore.appDetail.name;
    const { appDetail } = appStore;
    const { isKubernetes } = appDeployStore;
    const { isLoading } = appStore;
    const title = `${t('Deploy')} ${appDetail.name}`;
    const { isNormal, isDev } = user;
    const linkPath = isDev ? 'My Apps>Test>Deploy' : 'Store>All Apps>Deploy';

    return (
      <Layout
        className={classnames({ [styles.deployApp]: !isNormal })}
        title="Store"
        hasSearch
        isLoading={isLoading}
        backBtn={isNormal && <BackBtn label={appDetail.name} link={`/store/${appDetail.app_id}`} />}
      >
        {!isNormal && <BreadCrumb linkPath={linkPath} />}

        <CreateResource title={title} aside={this.renderAside()} asideTitle="">
          {isKubernetes ? this.renderYamlForm() : this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }
}
