import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import get from 'lodash/get';

import Checkbox from 'components/Base/Checkbox';
import Radio from 'components/Base/Radio';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import TodoList from 'components/TodoList';
import Page, { BackBtn, CreateResource } from 'containers/Manage/Page';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  store: rootStore.repoCreateStore
}))
@observer
export default class RepoAdd extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.store.reset();
  }

  componentDidUpdate() {
    if (get(this.store, 'repoCreated.repo') && !this.store.isLoading) {
      history.back();
    }
  }

  render() {
    const { notifyMsg, hideMsg } = this.store;

    return (
      <Page msg={notifyMsg} hideMsg={hideMsg}>
        <BackBtn label="repos" link="/manage/repos" />
        <CreateResource title="Create Repo" aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Page>
    );
  }

  renderForm() {
    const {
      providers,
      visibility,
      protocolType,
      labels,
      selectors,
      accessKey,
      secretKey,
      curLabelKey,
      curLabelValue,
      curSelectorKey,
      curSelectorValue,
      isLoading
    } = this.store;

    return (
      <form className={styles.createForm} onSubmit={this.store.handleSubmit}>
        <div>
          <label className={styles.name}>Name</label>
          <Input className={styles.input} name="name" required />
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
          <Checkbox.Group values={providers.slice()} onChange={this.store.changeProviders}>
            <Checkbox value="qingcloud">QingCloud</Checkbox>
            <Checkbox value="kubernetes">Kubernetes</Checkbox>
          </Checkbox.Group>
        </div>

        <div>
          <label className={styles.name}>Runtime Selector</label>
          <Input
            className={styles.inputSmall}
            placeholder="Key"
            value={curSelectorKey}
            onChange={this.store.changeSelectorKey}
          />
          <Input
            className={styles.inputSmall}
            placeholder="Value"
            value={curSelectorValue}
            onChange={this.store.changeSelectorValue}
          />
          <Button className={styles.add} onClick={this.store.addSelector}>
            Add
          </Button>
          <TodoList labels={selectors.slice()} onRemove={this.store.removeSelector} />
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
          <textarea className={styles.textarea} name="description" />
        </div>
        <div>
          <label className={styles.name}>Labels</label>
          <Input
            className={styles.inputSmall}
            placeholder="Key"
            value={curLabelKey}
            onChange={this.store.changeLabelKey}
          />
          <Input
            className={styles.inputSmall}
            placeholder="Value"
            value={curLabelValue}
            onChange={this.store.changeLabelValue}
          />
          <Button className={styles.add} onClick={this.store.addLabel}>
            Add
          </Button>
          <TodoList labels={labels.slice()} onRemove={this.store.removeLabel} />
        </div>
        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} className={`primary`} htmlType="submit" disabled={isLoading}>
            Confirm
          </Button>
          <Link to="/manage/repos">
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
