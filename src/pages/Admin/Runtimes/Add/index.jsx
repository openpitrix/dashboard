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
import Layout, { BackBtn, CreateResource } from 'components/Layout';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  runtimeCreateStore: rootStore.runtimeCreateStore
}))
@observer
export default class RuntimeAdd extends Component {
  static async onEnter({ runtimeStore, runtimeCreateStore }, { runtimeId }) {
    if (runtimeId) {
      await runtimeStore.fetch(runtimeId);
      runtimeCreateStore.setRuntime(runtimeStore.runtimeDetail);
    } else {
      runtimeCreateStore.reset();
    }
  }

  constructor(props) {
    super(props);
    this.store = this.props.runtimeCreateStore;
    this.store.runtimeCreated = null;
  }

  componentDidUpdate() {
    if (get(this.store, 'runtimeCreated.runtime_id') && !this.store.isLoading) {
      history.back();
    }
  }

  render() {
    const { runtimeId } = this.store;
    let title = 'Create Runtime';
    if (runtimeId) title = 'Modify Runtime';

    return (
      <Layout>
        <BackBtn label="runtime" link="/dashboard/runtimes" />
        <CreateResource title={title} aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }

  renderUrlAndZone() {
    const {
      runtimeId,
      runtimeUrl,
      accessKey,
      secretKey,
      zone,
      getRuntimeZone,
      runtimeZones
    } = this.store;

    return (
      <Fragment>
        {!runtimeId && (
          <div>
            <label className={styles.name}>URL</label>
            <Input
              value={runtimeUrl}
              onChange={this.store.changeUrl}
              className={styles.input}
              name="runtime_url"
              placeholder="www.example.com/path/point/"
              maxLength="100"
              onBlur={getRuntimeZone}
            />
            <div className={styles.rightShow}>
              <p>
                <label className={styles.inputTitle}>Access Key ID</label>
                <label className={styles.inputTitle}>Secret Access Key</label>
              </p>
              <Fragment>
                <Input
                  value={accessKey}
                  className={styles.inputMiddle}
                  onChange={this.store.changeAccessKey}
                  onBlur={getRuntimeZone}
                />
                <Input
                  value={secretKey}
                  className={styles.inputMiddle}
                  onChange={this.store.changeSecretKey}
                  onBlur={getRuntimeZone}
                />
                <Button className={styles.add} onClick={this.store.handleValidateCredential}>
                  Validate
                </Button>
              </Fragment>
            </div>
          </div>
        )}
        <div
          className={classNames(
            { [styles.zoneItem]: !runtimeId },
            { [styles.showDiv]: !!runtimeId }
          )}
        >
          <label className={styles.name}>Zone</label>
          {!runtimeId && (
            <Select
              className={styles.select}
              value={zone}
              onChange={this.store.changeZone}
              disabled={runtimeZones.length === 0}
            >
              {runtimeZones.map(data => (
                <Select.Option key={data} value={data}>
                  {data}
                </Select.Option>
              ))}
            </Select>
          )}
          {!!runtimeId && <label className={styles.showValue}>{zone}</label>}
        </div>
      </Fragment>
    );
  }

  renderCredential() {
    const { runtimeId, credential, zone } = this.store;

    return (
      <Fragment>
        {!runtimeId && (
          <div>
            <label className={classNames(styles.name, styles.textareaName)}>Credential</label>
            <textarea
              className={styles.textarea}
              name="runtime_credential"
              onChange={this.store.changeCredential}
              value={credential}
            />
            <p className={styles.credentialTip}>The Credential of provider</p>
          </div>
        )}
        <div className={classNames({ [styles.showDiv]: !!runtimeId })}>
          <label className={styles.name}>Namespace</label>
          {!runtimeId && (
            <Input
              className={styles.input}
              maxLength="20"
              onChange={this.store.changeInputZone}
              value={zone}
            />
          )}
          {!!runtimeId && <label className={styles.showValue}>{zone}</label>}
        </div>
      </Fragment>
    );
  }

  renderForm() {
    const { runtimeId, name, provider, labels, description, isLoading } = this.store;

    return (
      <form onSubmit={this.store.handleSubmit} className={styles.createForm}>
        <div>
          <label className={styles.name}>Name</label>
          <Input
            className={styles.input}
            name="name"
            maxLength="30"
            onChange={this.store.changeName}
            value={name}
          />
          <p className={classNames(styles.rightShow, styles.note)}>The name of the runtime</p>
        </div>
        {!runtimeId && (
          <div>
            <label className={styles.name}>Provider</label>
            <Radio.Group
              value={provider}
              onChange={this.store.changeProvider}
              className={styles.radioGroup}
            >
              <Radio value="qingcloud">QingCloud</Radio>
              <Radio value="aws">AWS</Radio>
              <Radio value="kubernetes">Kubernetes</Radio>
            </Radio.Group>
          </div>
        )}
        {!!runtimeId && (
          <div className={styles.showDiv}>
            <label className={styles.name}>Provider</label>
            <label className={styles.showValue}>{provider}</label>
          </div>
        )}
        {provider !== 'kubernetes' ? this.renderUrlAndZone() : this.renderCredential()}
        <div className={styles.textareaItem}>
          <label className={classNames(styles.name, styles.textareaName)}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            onChange={this.store.changeDescription}
            value={description}
            maxLength="500"
          />
        </div>
        <div>
          <label className={classNames(styles.name, styles.fl)}>Labels</label>
          <TodoList
            labels={labels && labels.slice()}
            onRemove={this.store.removeLabel}
            changeLabel={this.store.changeLabel}
            labelType="label"
          />
          <Button
            className={classNames(styles.add, { [styles.addBottom]: labels.length })}
            onClick={this.store.addLabel}
          >
            Add Label
          </Button>
        </div>
        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} disabled={isLoading} className={`primary`} htmlType="submit">
            Confirm
          </Button>
          <Link to="/dashboard/runtimes">
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
          Runtime is Cloud provider, It can be AWS，GCE, QingCloud,Kubernetes,OpenStack,VMware
          VSphere etc. give OpenPitrix permisson to access those cloud provider, OpenPitrix will
          manage all of them applications.
        </p>
      </Fragment>
    );
  }
}
