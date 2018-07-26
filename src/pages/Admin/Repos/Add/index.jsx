import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { get } from 'lodash';
import classnames from 'classnames';

import { Checkbox, Radio, Button, Input, Select } from 'components/Base';
import TodoList from 'components/TodoList';
import Layout, { BackBtn, CreateResource } from 'components/Layout';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore,
  repoCreateStore: rootStore.repoCreateStore
}))
@observer
export default class RepoAdd extends Component {
  static async onEnter({ repoStore, repoCreateStore }, { repoId }) {
    if (repoId) {
      await repoStore.fetchRepoDetail(repoId);
      repoCreateStore.setRepo(repoStore.repoDetail);
    } else {
      repoCreateStore.reset();
    }
  }

  constructor(props) {
    super(props);
    this.store = this.props.repoCreateStore;
    this.store.repoCreated = null;
  }

  componentDidUpdate() {
    if (get(this.store, 'repoCreated.repo_id') && !this.store.isLoading) {
      history.back();
    }
  }

  render() {
    const { notifyMsg, notifyType, hideMsg, repoId } = this.store;
    let title = 'Create Repo';
    if (repoId) title = 'Modify Repo';
    return (
      <Layout msg={notifyMsg} msgType={notifyType} hideMsg={hideMsg}>
        <BackBtn label="repos" link="/dashboard/repos" />
        <CreateResource title={title} aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }

  renderForm() {
    const {
      repoId,
      name,
      description,
      url,
      visibility,
      protocolType,
      providers,
      labels,
      selectors,
      accessKey,
      secretKey,
      isLoading
    } = this.store;

    return (
      <form className={styles.createForm} onSubmit={this.store.handleSubmit}>
        <div>
          <label className={styles.name}>Name</label>
          <Input
            className={styles.input}
            name="name"
            maxLength="50"
            required
            onChange={this.store.changeName}
            value={name}
          />
          <p className={classNames(styles.rightShow, styles.note)}>The name of the repo</p>
        </div>
        {!repoId && (
          <Fragment>
            <div>
              <label className={styles.name}>Visibility</label>
              <Radio.Group value={visibility} onChange={this.store.changeVisibility}>
                <Radio value="public">Public</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>
            </div>
            <div>
              <label className={styles.name}>Runtime Provider</label>
              <Checkbox.Group values={providers.toJSON()} onChange={this.store.changeProviders}>
                <Checkbox value="qingcloud">QingCloud</Checkbox>
                <Checkbox value="kubernetes">Kubernetes</Checkbox>
                <Checkbox value="aws">AWS</Checkbox>
              </Checkbox.Group>
            </div>
          </Fragment>
        )}
        {!!repoId && (
          <Fragment>
            <div className={styles.showDiv}>
              <label className={styles.name}>Visibility</label>
              <label className={styles.showValue}>{visibility}</label>
            </div>
            <div className={styles.showDiv}>
              <label className={styles.name}>Runtime Provider</label>
              <label className={styles.showValue}>{providers[0]}</label>
            </div>
          </Fragment>
        )}
        <div>
          <label className={classNames(styles.name, styles.fl)}>Runtime Selector</label>
          <TodoList
            labels={selectors && selectors.slice()}
            onRemove={this.store.removeSelector}
            changeLabel={this.store.changeLabel}
            labelType="selector"
          />
          <Button
            className={classNames(styles.add, { [styles.addBottom]: selectors.length })}
            onClick={this.store.addSelector}
          >
            Add Selector
          </Button>
        </div>
        {!repoId && (
          <div>
            <label className={styles.name}>URL</label>
            <Select
              value={protocolType}
              onChange={this.store.changeProtocolType}
              className={styles.smallSelect}
            >
              <Select.Option value="http">HTTP</Select.Option>
              <Select.Option value="https">HTTPS</Select.Option>
              <Select.Option value="s3">S3</Select.Option>
            </Select>
            <Input
              value={url}
              onChange={this.store.changeUrl}
              className={styles.input}
              placeholder="www.example.com/path/point/"
              maxLength="100"
              required
              name="url"
            />

            {protocolType === 's3' ? (
              <div className={styles.rightShow}>
                <p>
                  <label className={styles.inputTitle}>Access Key ID</label>
                  <label className={styles.inputTitle}>Secret Access Key</label>
                </p>
                <Input
                  className={styles.inputMiddle}
                  required
                  value={accessKey}
                  onChange={this.store.changeAccessKey}
                />
                <Input
                  className={styles.inputMiddle}
                  required
                  value={secretKey}
                  onChange={this.store.changeSecretKey}
                />
                <Button className={styles.add} onClick={this.store.handleValidateCredential}>
                  Validate
                </Button>
              </div>
            ) : null}
          </div>
        )}
        <div className={styles.textareaItem}>
          <label className={classNames(styles.name, styles.textareaName)}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={description}
            maxLength="500"
            onChange={this.store.changeDescription}
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
          <Button type={`primary`} className={`primary`} htmlType="submit" disabled={isLoading}>
            Confirm
          </Button>
          <Link to="/dashboard/repos">
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
          In OpenPitrix, Every application deployed is base package repository, on the other words,
          If you want to use OpenPitrix for your multi-cloud application manager, you need create
          repository first. Application manager can store package to http/https server or S3 object
          storage.
        </p>
      </Fragment>
    );
  }
}
