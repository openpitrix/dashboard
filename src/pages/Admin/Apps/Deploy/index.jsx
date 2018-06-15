import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import Radio from 'components/Base/Radio';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import Layout, { BackBtn, CreateResource } from 'components/Layout/Admin';

import styles from './index.scss';
import classNames from 'classnames';

@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  deployStore: rootStore.appDeployStore
}))
@observer
export default class AppDeploy extends Component {
  static async onEnter({ appStore }, params) {
    await appStore.fetch(params.appId);
  }

  render() {
    const { appStore, deployStore } = this.props;
    const { notifyMsg, hideMsg } = appStore;
    const title = 'Deploy app';

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
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

  handleSubmit = e => {
    e.preventDefault();
    //
  };

  renderForm() {
    return (
      <form className={styles.createForm} method="post" onSubmit={this.handleSubmit}>
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
          <Radio.Group className={styles.showWord}>
            <Radio value="public">Public</Radio>
            <Radio value="private">AWS</Radio>
            <Radio value="Alibaba">Alibaba Cloud Computing</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Version</label>
          <Select className={styles.select}>
            <Select.Option value="a 0.0.1">a 0.0.1</Select.Option>
            <Select.Option value="https">a 0.0.2</Select.Option>
            <Select.Option value="a 0.0.3">a 0.0.3</Select.Option>
          </Select>
        </div>
        <div>
          <label className={styles.name}>Description</label>
          <textarea className={styles.textarea} name="description" />
        </div>

        <div className={styles.moduleTitle}>2. Node Settings</div>
        <div>
          <label className={styles.name}>CPU</label>
          <Radio.Group className={styles.showWord}>
            <Radio value="1-core">1-Core</Radio>
            <Radio value="2-core">2-Core</Radio>
            <Radio value="4-core">1-Core</Radio>
            <Radio value="8-core">1-Core</Radio>
            <Radio value="16-core">16-Core</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Memory</label>
          <Radio.Group className={styles.showWord}>
            <Radio value="32GB">32GB</Radio>
            <Radio value="64GB">64GB</Radio>
            <Radio value="128GB">128GB</Radio>
            <Radio value="256GB">256GB</Radio>
            <Radio value="512GB">512GB</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Type</label>
          <Radio.Group className={styles.showWord}>
            <Radio value="high">High Performance</Radio>
            <Radio value="super-high">Super-high Performance</Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>Count</label>
          <Input className={styles.input} name="count" type="number" />
          <p className={classNames(styles.rightShow, styles.note)}>Range: 1 - 100</p>
        </div>

        <div className={styles.moduleTitle}>3. Vxnet Settings</div>
        <div>
          <label className={styles.name}>VxNet to Join</label>
          <Select className={styles.select}>
            <Select.Option value="vxnet-fjedgh7e">vxnet-fjedgh7e</Select.Option>
            <Select.Option value="vxnet-fjedgh8q">vxnet-fjedgh8q</Select.Option>
            <Select.Option value="vxnet-fjedgh9w">vxnet-fjedgh9w3</Select.Option>
          </Select>
        </div>
        <div>
          <label className={styles.name}>Type</label>
          <Radio.Group className={styles.showWord}>
            <Radio value="high">High Performance</Radio>
            <Radio value="super-high">Super-high Performance</Radio>
          </Radio.Group>
        </div>

        {/*<div className={styles.moduleTitle}>4. Dependent Service Settings</div>*/}
        {/*<div>*/}
        {/*<label className={styles.name}>ZooKeeper</label>*/}
        {/*<Input className={styles.input} name="zookeeper" />*/}
        {/*<p className={classNames(styles.rightShow, styles.note)}>Choose a ZooKeeper to use</p>*/}
        {/*</div>*/}

        <div className={styles.moduleTitle}>5. Environment Settings</div>
        <div>
          <label className={styles.name}>dcs.servers.per.node</label>
          <Select className={styles.select}>
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
          <Input className={styles.input} name="" />
          <p className={classNames(styles.rightShow, styles.note)}>
            Connectivity Port for client connection
          </p>
        </div>
        <div>
          <label className={styles.name}>dcs.master.info.port</label>
          <Input className={styles.input} name="" />
          <p className={classNames(styles.rightShow, styles.note)}>
            The port for the Dcs Master web UI
          </p>
        </div>
        <div>
          <label className={styles.name}>dbmgr.http.port</label>
          <Input className={styles.input} name="" />
          <p className={classNames(styles.rightShow, styles.note)}>EsgynDB Manager HTTP Port</p>
        </div>

        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} htmlType="submit">
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
