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
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RepoAdd extends Component {
  static async onEnter({ repoStore, appStore, runtimeStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
    await appStore.fetchAll();
    await runtimeStore.fetchRuntimes();
  }
  constructor(props) {
    super(props);
    this.changeCurTag = this.changeCurTag.bind(this);
    this.state = { curTag: 'Apps' };
    this.repoDetail = toJS(this.props.repoStore.repoDetail) || {};
    this.appsData = toJS(this.props.appStore.apps) || [];
    this.runtimesData = toJS(this.props.runtimeStore.runtimes) || [];
  }
  changeCurTag = name => {
    this.setState({
      curTag: name
    });
  };

  render() {
    const repoDetail = this.repoDetail;

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
                <Input className={styles.input} />
                <p className={classNames(styles.rightShow, styles.note)}>The name of the repo</p>
              </div>
              <div>
                <label className={styles.name}>Visibility</label>
                <Radio checked="true" className={styles.radio}>
                  Public
                </Radio>
                <Radio>Private</Radio>
              </div>
              <div>
                <label className={styles.name}>Runtime Provider</label>
                <Checkbox checked="true" className={styles.checkbox}>
                  QingCloud
                </Checkbox>
                <Checkbox>Kubernetes</Checkbox>
              </div>
              <div>
                <label className={styles.name}>Runtime Selector</label>
                <Input className={styles.inputSmall} placeholder="Key" />
                <Input className={styles.inputSmall} placeholder="Value" />
                <Button className={styles.add}>Add</Button>
              </div>
              <div>
                <label className={styles.name}>URL</label>
                <Select className={styles.select} value="S3">
                  <Select.Option value="1">S3</Select.Option>
                  <Select.Option value="2">S8</Select.Option>
                </Select>
                <Input className={styles.input} placeholder="www.example.com/path/point/" />
                <div className={styles.rightShow}>
                  <p>
                    <label className={styles.inputTitle}>Access Key ID</label>
                    <label className={styles.inputTitle}>Secret Access Key</label>
                  </p>
                  <Input className={styles.inputMiddle} placeholder="" />
                  <Input className={styles.inputMiddle} placeholder="" />
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
            </form>
            <div className={styles.submit}>
              <Button type={`primary`} className={`primary`} disabled="true">
                Confirm
              </Button>
              <Link to="/manage/repos">
                <Button>Cancel</Button>
              </Link>
            </div>
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
