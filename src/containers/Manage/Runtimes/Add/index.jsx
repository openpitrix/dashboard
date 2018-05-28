import React, { Component, Fragment } from 'react';
import _ from 'lodash';
// import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Radio from 'components/Base/Radio';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import LabelList from 'components/CreateResource/LabelList';
import Notification from 'components/Base/Notification';
import { toQueryString } from 'src/utils';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RuntimeAdd extends Component {
  static async onEnter({ runtimeStore }, { runtimeId }) {
    await runtimeStore.fetchRuntimeDetail(runtimeId);
  }

  state = {
    provider: 'qingcloud',
    zone: 'pek3a',
    accessKey: '',
    secretKey: '',
    curLabelKey: '',
    curLabelValue: '',
    labels: [],
    notifyMsg: ''
  };

  runtimeCreated = false;

  handleSubmit = async e => {
    e.preventDefault();
    const { provider, zone, labels } = this.state;
    const { runtimeStore } = this.props;

    let fd = new FormData(e.target);
    let data = {};
    for (let p of fd.entries()) {
      data[p[0]] = p[1];
    }

    if (_.isEmpty(labels)) {
      return this.showNotify('missing labels');
    }

    if (provider === 'qingcloud') {
      data.runtime_credential = toQueryString(_.pick(this.state, ['accessKey', 'secretKey']));
    } else if (provider === 'k8s') {
      let credential = data.credential;
      delete data.credential;
      data.runtime_credential = credential;
    }

    data.labels = labels
      .map(label => {
        return [label.key, label.value].join('=');
      })
      .join('&');

    _.extend(data, { provider, zone });
    await runtimeStore.create(data);

    // todol
    if (!runtimeStore.lastCreatedRuntime.runtime) {
      this.runtimeCreated = true;
      this.showNotify('create runtime successfully');
    } else {
      let { errDetail } = runtimeStore.lastCreatedRuntime;
      this.showNotify(errDetail);
    }
  };

  changeProvider = provider => {
    this.setState({ provider });
  };

  changeZone = zone => {
    this.setState({ zone });
  };

  changeAccessKey = e => {
    this.setState({ accessKey: e.target.value });
  };

  changeSecretKey = e => {
    this.setState({ secretKey: e.target.value });
  };

  handleValidateCredential = () => {
    let { accessKey, secretKey } = this.state;
    this.showNotify(accessKey && secretKey ? 'valid credential' : 'invalid credential');
  };

  addLabel = () => {
    const { curLabelKey, curLabelValue } = this.state;
    if (!(curLabelKey && curLabelValue)) {
      return this.showNotify('please input label key and value');
    }
    if (_.find(this.state.labels, { key: curLabelKey })) {
      return this.showNotify('label key already exists');
    }

    this.setState({
      labels: [...this.state.labels, { key: curLabelKey, value: curLabelValue }],
      curLabelKey: '',
      curLabelValue: ''
    });
  };

  showNotify = msg => {
    this.setState({ notifyMsg: msg });
  };

  hideNotify = () => {
    this.setState({ notifyMsg: '' });
  };

  onClosedNotify = () => {
    if (this.runtimeCreated) {
      history.back();
    }
  };

  renderNotification = () => {
    const { notifyMsg } = this.state;
    if (notifyMsg) {
      return (
        <Notification message={notifyMsg} onHide={this.hideNotify} onClosed={this.onClosedNotify} />
      );
    }
    return null;
  };

  changeLabelKey = e => {
    this.setState({ curLabelKey: e.target.value });
  };

  changeLabelValue = e => {
    this.setState({ curLabelValue: e.target.value });
  };

  removeLabel = key => {
    this.setState({
      labels: this.state.labels.filter(label => {
        return label.key !== key;
      })
    });
  };

  // componentDidUpdate(){
  //   if(this.runtimeCreated){
  //     history.back();
  //   }
  // }

  render() {
    // const { runtimeStore } = this.props;
    // const runtimeDetail = runtimeStore.runtimeDetail;
    const { provider, zone, curLabelKey, curLabelValue } = this.state;

    return (
      <div className={styles.addPage}>
        <ManageTabs />
        {this.renderNotification()}
        <div className={styles.backTo}>
          <Link to="/manage/runtimes">← Back to Runtimes</Link>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.title}>Create Runtime</div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <label className={styles.name}>Name</label>
                <Input className={styles.input} name="name" required />
                <p className={classNames(styles.rightShow, styles.note)}>The name of the runtime</p>
              </div>

              <div>
                <label className={styles.name}>Runtime Provider</label>
                <Radio.Group value={provider} onChange={this.changeProvider}>
                  <Radio value="qingcloud">QingCloud</Radio>
                  <Radio value="k8s">Kubernetes</Radio>
                </Radio.Group>
              </div>

              {provider === 'qingcloud' ? (
                <Fragment>
                  <div>
                    <label className={styles.name}>URL</label>
                    <Input
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
                        className={styles.inputMiddle}
                        required
                        onChange={this.changeAccessKey}
                      />
                      <Input
                        className={styles.inputMiddle}
                        required
                        onChange={this.changeSecretKey}
                      />
                      <Button className={styles.add} onClick={this.handleValidateCredential}>
                        Validate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className={styles.name}>Zone</label>
                    <Select className={styles.select} value={zone} onChange={this.changeZone}>
                      <Select.Option value="pek3a">pek3a</Select.Option>
                      <Select.Option value="sh1a">sh1a</Select.Option>
                      <Select.Option value="gd1">gd1</Select.Option>
                    </Select>
                  </div>
                </Fragment>
              ) : (
                <div>
                  <label className={classNames(styles.name, styles.textareaName)}>Credential</label>
                  <textarea className={styles.textarea} name="credential" required />
                  <p className={styles.credentialTip}>Description...</p>
                </div>
              )}

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
                  onChange={this.changeLabelKey}
                />
                <Input
                  className={styles.inputSmall}
                  placeholder="Value"
                  value={curLabelValue}
                  onChange={this.changeLabelValue}
                />
                <Button className={styles.add} onClick={this.addLabel}>
                  Add
                </Button>
                <LabelList labels={this.state.labels} onRemove={this.removeLabel} />
              </div>
              <div className={styles.submit}>
                <Button type={`primary`} className={`primary`} htmlType="submit">
                  Confirm
                </Button>
                <Link to="/manage/runtimes">
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
