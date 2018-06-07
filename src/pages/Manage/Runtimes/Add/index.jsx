import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import get from 'lodash/get';
import Radio from 'components/Base/Radio';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import TodoList from 'components/TodoList';
import Layout, { BackBtn, CreateResource } from 'pages/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  runtimeCreateStore: rootStore.runtimeCreateStore
}))
@observer
export default class RuntimeAdd extends Component {
  static async onEnter({ runtimeStore, runtimeCreateStore }, { runtimeId }) {
    if (runtimeId) {
      await runtimeStore.fetchRuntimeDetail(runtimeId);
      runtimeCreateStore.setRuntime(runtimeStore.runtimeDetail);
    } else {
      runtimeCreateStore.reset();
    }
  }

  constructor(props) {
    super(props);
    this.props.runtimeCreateStore.reset();
  }

  componentDidUpdate() {
    const { runtimeCreateStore } = this.props;
    if (get(runtimeCreateStore, 'runtimeCreated.runtime') && !runtimeCreateStore.isLoading) {
      history.back();
    }
  }

  render() {
    const { notifyMsg, hideMsg } = this.props.runtimeCreateStore;
    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <BackBtn label="runtime" link="/manage/runtimes" />
        <CreateResource title="Create Runtime" aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }

  renderForm() {
    const { runtimeCreateStore } = this.props;
    const {
      name,
      provider,
      zone,
      labels,
      curLabelKey,
      accessKey,
      secretKey,
      description,
      curLabelValue,
      isLoading,
      runtimeUrl
    } = runtimeCreateStore;
    return (
      <form onSubmit={runtimeCreateStore.handleSubmit} className={styles.createForm}>
        <div>
          <label className={styles.name}>Name</label>
          <Input
            className={styles.input}
            name="name"
            required
            onChange={runtimeCreateStore.changeName}
            value={name}
          />
          <p className={classNames(styles.rightShow, styles.note)}>The name of the runtime</p>
        </div>

        <div>
          <label className={styles.name}>Provider</label>
          <Radio.Group value={provider} onChange={runtimeCreateStore.changeProvider}>
            <Radio value="qingcloud">QingCloud</Radio>
            <Radio value="kubernetes">Kubernetes</Radio>
          </Radio.Group>
        </div>

        {provider === 'qingcloud' ? (
          <Fragment>
            <div>
              <label className={styles.name}>URL</label>
              <Input
                value={runtimeUrl}
                onChange={runtimeCreateStore.changeUrl}
                className={styles.inputUrl}
                name="runtime_url"
                placeholder="www.example.com/path/point/"
                required
              />
              <div className={styles.rightShow}>
                <p>
                  <label className={styles.inputTitle}>Access Key ID</label>
                  <label className={styles.inputTitle}>Secret Access Key</label>
                </p>
                <Input
                  value={accessKey}
                  className={styles.inputMiddle}
                  required
                  onChange={runtimeCreateStore.changeAccessKey}
                />
                <Input
                  value={secretKey}
                  className={styles.inputMiddle}
                  required
                  onChange={runtimeCreateStore.changeSecretKey}
                />
                <Button
                  className={styles.add}
                  onClick={runtimeCreateStore.handleValidateCredential}
                >
                  Validate
                </Button>
              </div>
            </div>
            <div>
              <label className={styles.name}>Zone</label>
              <Select
                className={styles.select}
                value={zone}
                onChange={runtimeCreateStore.changeZone}
              >
                <Select.Option value="pek3a">pek3a</Select.Option>
                <Select.Option value="sh1a">sh1a</Select.Option>
                <Select.Option value="gd1">gd1</Select.Option>
              </Select>
            </div>
          </Fragment>
        ) : provider === 'kubernetes' ? (
          <div>
            <label className={classNames(styles.name, styles.textareaName)}>Credential</label>
            <textarea className={styles.textarea} name="credential" required />
            <p className={styles.credentialTip}>Description...</p>
          </div>
        ) : null}

        <div>
          <label className={classNames(styles.name, styles.textareaName)}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            onChange={runtimeCreateStore.changeDescription}
            value={description}
          />
        </div>
        <div>
          <label className={styles.name}>Labels</label>
          <Input
            className={styles.inputSmall}
            placeholder="Key"
            value={curLabelKey}
            onChange={runtimeCreateStore.changeLabelKey}
          />
          <Input
            className={styles.inputSmall}
            placeholder="Value"
            value={curLabelValue}
            onChange={runtimeCreateStore.changeLabelValue}
          />
          <Button className={styles.add} onClick={runtimeCreateStore.addLabel}>
            Add
          </Button>
          <TodoList labels={labels && labels.slice()} onRemove={runtimeCreateStore.removeLabel} />
        </div>
        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} disabled={isLoading} className={`primary`} htmlType="submit">
            Confirm
          </Button>
          <Link to="/manage/runtimes">
            <Button>Cancel</Button>
          </Link>
        </div>
      </form>
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
}
