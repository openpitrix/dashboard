import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { get } from 'lodash';
import classnames from 'classnames';

import Radio from 'components/Base/Radio';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import TodoList from 'components/TodoList';
import Layout, { BackBtn, CreateResource } from 'components/Layout/Admin';

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
  }

  componentDidUpdate() {
    if (get(this.store, 'repoCreated.repo') && !this.store.isLoading) {
      history.back();
    }
  }

  render() {
    const { notifyMsg, hideMsg, repoId } = this.store;
    let title = 'Create Repo';
    if (repoId) title = 'Modify Repo';
    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <BackBtn label="repos" link="/dashboard/repos" />
        <CreateResource title={title} aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }

  renderForm() {
    const {
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
            required
            onChange={this.store.changeName}
            value={name}
          />
          <p className={classNames(styles.rightShow, styles.note)}>The name of the repo</p>
        </div>

        <div>
          <label className={styles.name}>Visibility</label>
          <Radio.Group value={visibility} onChange={this.store.changeVisibility}>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </div>

        <div>
          <label className={styles.name}>Runtime Provider</label>
          <Radio.Group value={providers[0]} onChange={this.store.changeProviders}>
            <Radio value="qingcloud">QingCloud</Radio>
            <Radio value="kubernetes">Kubernetes</Radio>
          </Radio.Group>
        </div>

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
        <div>
          <label className={styles.name}>URL</label>
          <Select
            value={protocolType}
            onChange={this.store.changeProtocolType}
            className={styles.select}
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
        <div>
          <label className={classNames(styles.name, styles.textareaName)}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={description}
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
