import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

import { Button } from 'components/Base';
import Layout, { CreateResource } from 'components/Layout';
import { Group as DeployGroup } from 'components/Deploy';

import { getFormData } from 'utils';
import VMParser from 'lib/config-parser/vm';
// import mockData from 'lib/config-parser/mock/wp.json';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  repoStore: rootStore.repoStore,
  appDeployStore: rootStore.appDeployStore,
  runtimeStore: rootStore.runtimeStore
  // user: rootStore.user
}))
@observer
export default class TestDeploy extends React.Component {
  async componentDidMount() {
    const { appStore, repoStore, appDeployStore, user, match } = this.props;

    // todo: mock appId
    const appId = 'app-6Nxq0pnQ3VXy';

    appDeployStore.loading = true;

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
      // vm based
      await appDeployStore.fetchSubnets(_.get(appDeployStore.runtimes[0], 'runtime_id'));

      // fetch versions
      await appDeployStore.fetchVersions({ app_id: [appId] });
      await appDeployStore.fetchFilesByVersion(
        _.get(appDeployStore.versions[0], 'version_id'),
        isK8s
      );

      if (!_.isEmpty(appDeployStore.configJson)) {
        console.log('config.json: ', appDeployStore.configJson);

        this.parser = new VMParser(appDeployStore.configJson);
        this.parser.setRuntimes(appDeployStore.normalizeRuntime());
        this.parser.setVersions(appDeployStore.normalizeVersions());
        this.parser.setSubnets(appDeployStore.normalizeSubnets());
      } else {
        appDeployStore.error('Invalid config.json');
      }
    }

    appDeployStore.loading = false;
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(getFormData(this.refs.deployForm));
  };

  handleCancel = e => {};

  renderBody() {
    if (!this.parser) {
      return null;
    }

    const { onChangeFormField } = this.props.appDeployStore;

    const basicSetting = this.parser.getBasicSetting();
    const nodeSetting = this.parser.getNodeSetting();
    const envSetting = this.parser.getEnvSetting();
    const vxnetSetting = this.parser.getVxnetSetting();

    const groups = [].concat(
      { title: 'Basic settings', items: basicSetting },
      nodeSetting,
      { title: 'Vxnet settings', items: vxnetSetting },
      envSetting
    );

    // console.log('render data: ', groups);

    return (
      <form method="post" onSubmit={this.handleSubmit} ref="deployForm">
        {groups.map((group, idx) => {
          return <DeployGroup detail={group} seq={idx} key={idx} onChange={onChangeFormField} />;
        })}
      </form>
    );
  }

  renderFooter() {
    if (!this.parser) {
      return null;
    }

    // const {versionId, runtimeId, subnetId}=this.props.appDeployStore;
    // const canSubmit = Boolean(versionId && runtimeId && subnetId);

    return (
      <div className={styles.actionBtnGroup}>
        <Button type="primary" onClick={this.handleSubmit} className={styles.btn}>
          Confirm
        </Button>
        <Button onClick={this.handleCancel} className={styles.btn}>
          Cancel
        </Button>
      </div>
    );
  }

  render() {
    const { loading } = this.props.appDeployStore;

    return (
      <Layout isLoading={loading}>
        <CreateResource title="Deploy App" footer={this.renderFooter()}>
          {this.renderBody()}
        </CreateResource>
      </Layout>
    );
  }
}
