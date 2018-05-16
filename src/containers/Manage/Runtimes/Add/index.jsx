import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Checkbox from 'components/Base/Checkbox';
import Radio from 'components/Base/Radio';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RuntimeAdd extends Component {
  static async onEnter({ runtimeStore }, { runtimeId }) {
    await runtimeStore.fetchRuntimeDetail(runtimeId);
  }

  render() {
    const { runtimeStore } = this.props;
    const runtimeDetail = runtimeStore.runtimeDetail;

    return (
      <div className={styles.addPage}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/runtimes">← Back to Runtimes</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.title}>Create Runtime</div>
            <form>
              <div>
                <label className={styles.name}>Name</label>
                <Input className={styles.input} />
                <p className={classNames(styles.rightShow, styles.note)}>The name of the runtime</p>
              </div>
              <div>
                <label className={styles.name}>Runtime Provider</label>
                <Checkbox checked="true" className={styles.checkbox}>
                  QingCloud
                </Checkbox>
                <Checkbox>Kubernetes</Checkbox>
              </div>
              <div>
                <label className={styles.name}>URL</label>
                <Input className={styles.inputUrl} placeholder="www.example.com/path/point/" />
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
                <label className={styles.name}>Zone</label>
                <Select className={styles.select} value="pek3a">
                  <Select.Option value="1">pek1a</Select.Option>
                  <Select.Option value="2">pek2a</Select.Option>
                  <Select.Option value="3">pek3a</Select.Option>
                </Select>
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
              <Link to="/manage/runtimes">
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
