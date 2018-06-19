import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Radio, Button, Input, Select, Slider } from 'components/Base';
import Layout, { BackBtn, CreateResource } from 'components/Layout/Admin';

import styles from './index.scss';
import classNames from 'classnames';

@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  appDeployStore: rootStore.appDeployStore
}))
@observer
export default class AppDeploy extends Component {
  static async onEnter({ appStore, appDeployStore }, params) {
    await appStore.fetch(params.appId);
    await appDeployStore.fetchVersions(params.appId);
    await appDeployStore.fetchSubnets();
  }

  render() {
    const { appStore, appDeployStore } = this.props;
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
    const {
      versions,
      subnets,
      handleSubmit,
      isLoading,
      version,
      vxNet,
      perNode,
      volume,
      deploy,
      changeRuntime,
      changeVersion,
      changeDescription,
      changeCpu,
      changeMemory,
      changeType,
      changeVolume,
      changeVolumeInput,
      changeIp,
      changeVxNet,
      changePerNode
    } = this.props.appDeployStore;
    return (
      <form className={styles.createForm} method="post" onSubmit={handleSubmit}>
        <div className={styles.moduleTitle}>1. Basic settings</div>
        {/*<div>*/}
        {/*<label className={styles.name}>ID</label>*/}
        {/*<span className={styles.showWord}>52712219520354767</span>*/}
        {/*<p className={classNames(styles.rightShow, styles.note)}>*/}
        {/*A unique ID of the application instance, used as the identifier before created*/}
        {/*</p>*/}
        {/*</div>*/}

        <div>
          <label className={styles.name}>Name</label>
          <Input className={styles.input} name="name" />
          <p className={classNames(styles.rightShow, styles.note)}>
            The name of the EsgynDB service
          </p>
        </div>
        <div>
          <label className={styles.name}>Runtime</label>
          <Radio.Group className={styles.showWord} value={deploy.runtime} onChange={changeRuntime}>
            <Radio value="public">Public</Radio>
            <Radio value="aws">AWS</Radio>
            <Radio value="alibaba">Alibaba Cloud Computing</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Version</label>
          <Select className={styles.select} value={version} onChange={changeVersion}>
            {versions.map(({ version_id, name }) => (
              <Select.Option key={version_id} value={version_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div>
          <label className={styles.name}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={deploy.description}
            onChange={changeDescription}
          />
        </div>

        <div className={styles.moduleTitle}>2. Node Settings</div>
        <div>
          <label className={styles.name}>CPU</label>
          <Radio.Group className={styles.showWord} value={deploy.cpu} onChange={changeCpu}>
            <Radio value="1">1-Core</Radio>
            <Radio value="2">2-Core</Radio>
            <Radio value="4">4-Core</Radio>
            <Radio value="8">8-Core</Radio>
            <Radio value="16">16-Core</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Memory</label>
          <Radio.Group className={styles.showWord} value={deploy.memory} onChange={changeMemory}>
            <Radio value="32GB">32GB</Radio>
            <Radio value="64GB">64GB</Radio>
            <Radio value="128GB">128GB</Radio>
            <Radio value="256GB">256GB</Radio>
            <Radio value="512GB">512GB</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Type</label>
          <Radio.Group className={styles.showWord} value={deploy.type} onChange={changeType}>
            <Radio value="high">High Performance</Radio>
            <Radio value="super-high">Super-high Performance</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Volume Size</label>
          <Slider min={10} max={1000} step={1} value={volume} onChange={changeVolume} />
          <span>
            <Input
              className={styles.inputSmall}
              name="volume"
              value={volume}
              onChange={changeVolumeInput}
            />{' '}
            GB
          </span>
          <p className={classNames(styles.rightShow, styles.note)}>
            10GB - 1000GB, The volume size for each instance
          </p>
        </div>
        <div>
          <label className={styles.name}>Count</label>
          <Input className={styles.input} name="count" type="number" data-min={1} data-max={100} />
          <p className={classNames(styles.rightShow, styles.note)}>Range: 1 - 100</p>
        </div>

        <div className={styles.moduleTitle}>3. Vxnet Settings</div>
        <div>
          <label className={styles.name}>VxNet to Join</label>
          <Select className={styles.select} value={vxNet} onChange={changeVxNet}>
            {subnets.map(({ subnet_id, name }) => (
              <Select.Option key={subnet_id} value={subnet_id}>
                {subnet_id} {name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div>
          <label className={styles.name}>IP</label>
          <Radio.Group className={styles.showWord} value={deploy.ip} onChange={changeIp}>
            <Radio value="auto">Auto assigned</Radio>
            <Radio value="assign">Assign manually</Radio>
          </Radio.Group>
        </div>

        {/*<div className={styles.moduleTitle}>4. Dependent Service Settings</div>*/}
        {/*<div>*/}
        {/*<label className={styles.name}>ZooKeeper</label>*/}
        {/*<Input className={styles.input} name="zookeeper" />*/}
        {/*<p className={classNames(styles.rightShow, styles.note)}>Choose a ZooKeeper to use</p>*/}
        {/*</div>*/}

        <div className={styles.moduleTitle}>4. Environment Settings</div>
        <div>
          <label className={styles.name}>dcs.servers.per.node</label>
          <Select className={styles.select} value={perNode} onChange={changePerNode}>
            <Select.Option value="8">8</Select.Option>
            <Select.Option value="7">7</Select.Option>
            <Select.Option value="6">6</Select.Option>
          </Select>
          <p className={classNames(styles.rightShow, styles.note)}>
            Client Connection Servers per Node
          </p>
        </div>
        <div>
          <label className={styles.name}>dcs.master.port</label>
          <Input className={styles.input} name="masterPort" type="number" />
          <p className={classNames(styles.rightShow, styles.note)}>
            Connectivity Port for client connection
          </p>
        </div>
        <div>
          <label className={styles.name}>dcs.master.info.port</label>
          <Input className={styles.input} name="infoPort" type="number" />
          <p className={classNames(styles.rightShow, styles.note)}>
            The port for the Dcs Master web UI
          </p>
        </div>
        <div>
          <label className={styles.name}>dbmgr.http.port</label>
          <Input className={styles.input} name="httpPort" type="number" />
          <p className={classNames(styles.rightShow, styles.note)}>EsgynDB Manager HTTP Port</p>
        </div>

        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} htmlType="submit" disabled={isLoading}>
            Confirm
          </Button>
          <Link to="/dashboard/apps">
            <Button>Cancel</Button>
          </Link>
        </div>
      </form>
    );
  }
}
