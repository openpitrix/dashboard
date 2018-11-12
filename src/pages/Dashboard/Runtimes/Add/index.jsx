import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Radio, Button, Input, Select } from 'components/Base';
import Layout, { BackBtn, CreateResource, BreadCrumb } from 'components/Layout';
import TodoList from 'components/TodoList';
import providers from '../providers';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  runtimeCreateStore: rootStore.runtimeCreateStore,
  user: rootStore.user
}))
@observer
export default class RuntimeAdd extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.runtimeCreateStore;
    this.store.runtimeCreated = null;
  }

  async componentDidMount() {
    const { runtimeStore, runtimeCreateStore, match } = this.props;
    const { runtimeId } = match.params;

    if (runtimeId) {
      await runtimeStore.fetch(runtimeId);
      runtimeCreateStore.setRuntime(runtimeStore.runtimeDetail);
    } else {
      //runtimeCreateStore.reset();
    }
  }

  componentDidUpdate() {
    if (_.get(this.store, 'runtimeCreated.runtime_id') && !this.store.isLoading) {
      history.back();
    }
  }

  componentWillUnmount() {
    const { runtimeCreateStore } = this.props;
    runtimeCreateStore.reset();
  }

  handleSubmit = async e => {
    const { runtimeCreateStore } = this.props;
    const result = await runtimeCreateStore.handleSubmit(e);

    if (result && result.runtime_id) {
      setTimeout(() => history.back(), 1000);
    }
  };

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
          <label className={classNames(styles.name, styles.textareaName)}>{t('kubeconfig')}</label>
          <textarea
            className={styles.textarea}
            name="runtime_credential"
            onChange={this.store.changeCredential}
            value={credential}
          />
          <p className={styles.credentialTip}>{t('kubeconfig desc')}</p>
        </div>
        <div className={classNames({ [styles.showDiv]: !!runtimeId })}>
          <label className={styles.name}>{t('Namespace')}</label>
          <Input
            className={styles.input}
            maxLength="20"
            onChange={this.store.changeInputZone}
            value={zone}
            disabled={Boolean(runtimeId)}
          />
        </div>
      </Fragment>
    );
  }

  renderForm() {
    const { t } = this.props;
    const { runtimeId, name, provider, labels, description, isLoading } = this.store;

    return (
      <form onSubmit={this.handleSubmit} className={styles.createForm}>
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
            {_.map(providers, (label, key) => (
              <Radio value={key} disabled={Boolean(runtimeId)} key={key}>
                {label}
              </Radio>
            ))}
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
          <Button onClick={() => history.back()}>{t('Cancel')}</Button>
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

  render() {
    const { user, t } = this.props;
    const { runtimeId } = this.store;
    const title = runtimeId ? t('Modify Runtime') : t('Create Runtime');
    const { isNormal, isDev, isAdmin } = user;
    const linkPath = isDev ? `My Apps>Runtimes>${title}` : `Platform>Runtimes>${title}`;

    return (
      <Layout
        title="My Runtimes"
        backBtn={isNormal && <BackBtn label="runtime" link="/runtimes" />}
      >
        {!isNormal && <BreadCrumb linkPath={linkPath} />}

        <CreateResource title={title} aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }
}
