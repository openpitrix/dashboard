import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import get from 'lodash/get';
import Radio from 'components/Base/Radio';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Select from 'components/Base/Select';
import TodoList from 'components/TodoList';
import Layout, { BackBtn, CreateResource } from 'components/Layout';

import styles from './index.scss';

@translate()
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
    const { t } = this.props;
    const { runtimeId } = this.store;
    let title = t('Create Runtime');
    if (runtimeId) title = t('Modify Runtime');

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
    const { t } = this.props;
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
            disabled={Boolean(runtimeId)}
          />
          <div className={styles.rightShow}>
            <p>
              <label className={styles.inputTitle}>{t('Access Key ID')}</label>
              <label className={styles.inputTitle}>{t('Secret Access Key')}</label>
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
                {t('Validate')}
              </Button>
            </Fragment>
          </div>
        </div>
        <div className={styles.zoneItem}>
          <label className={styles.name}>{t('Zone')}</label>
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
        </div>
      </Fragment>
    );
  }

  renderCredential() {
    const { t } = this.props;
    const { runtimeId, credential, zone } = this.store;

    return (
      <Fragment>
        <div>
          <label className={classNames(styles.name, styles.textareaName)}>{t('Credential')}</label>
          <textarea
            className={styles.textarea}
            name="runtime_credential"
            onChange={this.store.changeCredential}
            value={credential}
          />
          <p className={styles.credentialTip}>{t('The Credential of provider')}</p>
        </div>
        <div className={classNames({ [styles.showDiv]: !!runtimeId })}>
          <label className={styles.name}>{t('Namespace')}</label>
          <Input
            className={styles.input}
            maxLength="20"
            onChange={this.store.changeInputZone}
            value={zone}
          />
        </div>
      </Fragment>
    );
  }

  renderForm() {
    const { t } = this.props;
    const { runtimeId, name, provider, labels, description, isLoading } = this.store;

    return (
      <form onSubmit={this.store.handleSubmit} className={styles.createForm}>
        <div>
          <label className={styles.name}>{t('Name')}</label>
          <Input
            className={styles.input}
            name="name"
            maxLength="30"
            onChange={this.store.changeName}
            value={name}
          />
          <p className={classNames(styles.rightShow, styles.note)}>
            {t('The name of the runtime')}
          </p>
        </div>
        <div>
          <label className={styles.name}>{t('Provider')}</label>
          <Radio.Group
            value={provider}
            onChange={this.store.changeProvider}
            className={styles.radioGroup}
          >
            <Radio value="qingcloud" disabled={Boolean(runtimeId)}>
              QingCloud
            </Radio>
            <Radio value="aws" disabled={Boolean(runtimeId)}>
              AWS
            </Radio>
            <Radio value="kubernetes" disabled={Boolean(runtimeId)}>
              Kubernetes
            </Radio>
          </Radio.Group>
        </div>
        {provider !== 'kubernetes' ? this.renderUrlAndZone() : this.renderCredential()}
        <div className={styles.textareaItem}>
          <label className={classNames(styles.name, styles.textareaName)}>{t('Description')}</label>
          <textarea
            className={styles.textarea}
            name="description"
            onChange={this.store.changeDescription}
            value={description}
            maxLength="500"
          />
        </div>
        <div>
          <label className={classNames(styles.name, styles.fl)}>{t('Labels')}</label>
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
            {t('Add')}
          </Button>
        </div>
        <div className={styles.submitBtnGroup}>
          <Button type={`primary`} disabled={isLoading} className={`primary`} htmlType="submit">
            {t('Confirm')}
          </Button>
          <Link to="/dashboard/runtimes">
            <Button>{t('Cancel')}</Button>
          </Link>
        </div>
      </form>
    );
  }

  renderAside() {
    const { t } = this.props;

    return (
      <Fragment>
        <p>{t('Create Runtime explain')}</p>
      </Fragment>
    );
  }
}
