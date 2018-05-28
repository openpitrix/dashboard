import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Checkbox from 'components/Base/Checkbox';
import Radio from 'components/Base/Radio';

import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore
}))
@observer
export default class RepoAdd extends Component {
  static async onEnter({ repoStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
  }

  state = {
    providers: ['qingcloud'],
    visibility: 'public',
    protocolType: 'http', // http, https, s3
    accessKey: '',
    secretKey: '',
    curLabelKey: '',
    curLabelValue: '',
    labels: [],
    selectors: [],
    formValidated: false,
    validateMsg: ''
  };

  changeProviders = providers => {
    this.setState({ providers });
  };

  changeVisibility = visibility => {
    this.setState({ visibility });
  };

  changeProtocolType = type => {
    this.setState({ protocolType: type });
  };

  changeAccessKey = e => {
    this.setState({ accessKey: e.target.value });
  };

  changeSecretKey = e => {
    this.setState({ secretKey: e.target.value });
  };

  render() {
    const { repoStore } = this.props;
    // const repoDetail = repoStore.repoDetail;

    const { providers, visibility, protocolType } = this.state;

    return (
      <div className={styles.repoAdd}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/repos">← Back to Repos</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.title}>Create Repo</div>
            <form>
              <div>
                <label className={styles.name}>Name</label>
                <Input className={styles.input} name="name" required />
                <p className={classNames(styles.rightShow, styles.note)}>The name of the repo</p>
              </div>

              <div>
                <label className={styles.name}>Visibility</label>
                <Radio.Group value={visibility} onChange={this.changeVisibility}>
                  <Radio value="public">Public</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>
              </div>

              <div>
                <label className={styles.name}>Runtime Provider</label>
                <Checkbox.Group values={providers} onChange={this.changeProviders}>
                  <Checkbox value="qingcloud">QingCloud</Checkbox>
                  <Checkbox value="k8s">Kubernetes</Checkbox>
                </Checkbox.Group>
              </div>

              <div>
                <label className={styles.name}>Runtime Selector</label>
                <Input className={styles.inputSmall} placeholder="Key" />
                <Input className={styles.inputSmall} placeholder="Value" />
                <Button className={styles.add}>Add</Button>
              </div>
              <div>
                <label className={styles.name}>URL</label>
                <Select
                  value={protocolType}
                  onChange={this.changeProtocolType}
                  className={styles.select}
                >
                  <Select.Option value="http">HTTP</Select.Option>
                  <Select.Option value="https">HTTPS</Select.Option>
                  <Select.Option value="s3">S3</Select.Option>
                </Select>
                <Input className={styles.input} placeholder="www.example.com/path/point/" />

                <div className={styles.rightShow}>
                  <p>
                    <label className={styles.inputTitle}>Access Key ID</label>
                    <label className={styles.inputTitle}>Secret Access Key</label>
                  </p>
                  <Input className={styles.inputMiddle} required onChange={this.changeAccessKey} />
                  <Input className={styles.inputMiddle} required onChange={this.changeSecretKey} />
                  <Button className={styles.add}>Validate</Button>
                </div>
              </div>
              <div>
                <label className={classNames(styles.name, styles.textareaName)}>Description</label>
                <textarea className={styles.textarea} />
              </div>
              <div>
                <label className={styles.name}>Labels</label>
                <Input className={styles.inputSmall} placeholder="Key" />
                <Input className={styles.inputSmall} placeholder="Value" />
                <Button className={styles.add}>Add</Button>
              </div>
              <div className={styles.submit}>
                <Button type={`primary`} className={`primary`} htmlType="submit">
                  Confirm
                </Button>
                <Link to="/manage/repos">
                  <Button>Cancel</Button>
                </Link>
              </div>
            </form>
          </div>

          <div className={styles.rightInfo}>
            <div className={styles.title}>Guide</div>
            <div className={styles.content}>
              <p>
                Application repos are labelled for GUI to show in category list, and have label
                selector to choose which runtime to run when user deploys any application that
                belongs to the repo.
              </p>
              <p>Runtime env is labelled. A runtime can have multiple labels.</p>
              <p>
                Repo indexer will scan configured repo list periodically and cache the metadata of
                the repos.
              </p>
              <p>Repo manager is responsible for creating/deleting/updating repos.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
