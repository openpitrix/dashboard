import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { get } from 'lodash';
import { translate } from 'react-i18next';

import { Checkbox, Radio, Button, Input, Select } from 'components/Base';
import Layout, { BackBtn, CreateResource, NavLink } from 'components/Layout';
import TodoList from 'components/TodoList';
import { getSessInfo } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) => ({
  repoStore: rootStore.repoStore,
  repoCreateStore: rootStore.repoCreateStore,
  sessInfo
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

  renderForm() {
    const { t } = this.props;
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
          <label className={styles.name}>{t('Name')}</label>
          <Input
            className={styles.input}
            name="name"
            maxLength="50"
            required
            onChange={this.store.changeName}
            value={name}
          />
          <p className={classNames(styles.rightShow, styles.note)}>{t('The name of the repo')}</p>
        </div>
        <div>
          <label className={styles.name}>{t('Visibility')}</label>
          <Radio.Group value={visibility} onChange={this.store.changeVisibility}>
            <Radio value="public" disabled={Boolean(repoId)}>
              {t('Public')}
            </Radio>
            <Radio value="private" disabled={Boolean(repoId)}>
              {t('Private')}
            </Radio>
          </Radio.Group>
        </div>
        <div>
          <label className={styles.name}>{t('Runtime Provider')}</label>
          <Checkbox.Group values={providers.toJSON()} onChange={this.store.changeProviders}>
            <Checkbox value="qingcloud" disabled={Boolean(repoId)}>
              QingCloud
            </Checkbox>
            <Checkbox value="aws" disabled={Boolean(repoId)}>
              AWS
            </Checkbox>
            <Checkbox value="kubernetes" disabled={Boolean(repoId)}>
              Kubernetes
            </Checkbox>
          </Checkbox.Group>
        </div>
        <div>
          <label className={classNames(styles.name, styles.fl)}>{t('Runtime Selectors')}</label>
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
            {t('Add')}
          </Button>
        </div>
        <div className={styles.urlItem}>
          <label className={styles.name}>URL</label>
          <Select
            value={protocolType}
            onChange={this.store.changeProtocolType}
            className={styles.smallSelect}
            disabled={Boolean(repoId)}
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
            title={url}
            disabled={Boolean(repoId)}
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
        <div className={styles.textareaItem}>
          <label className={classNames(styles.name, styles.textareaName)}>{t('Description')}</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={description}
            maxLength="500"
            onChange={this.store.changeDescription}
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
          <Button type={`primary`} className={`primary`} htmlType="submit" disabled={isLoading}>
            {t('Confirm')}
          </Button>
          <Link to="/dashboard/repos">
            <Button>{t('Cancel')}</Button>
          </Link>
        </div>
      </form>
    );
  }

  renderAside() {
    const { t } = this.props;

    return <p>{t('Create Repo explain')}</p>;
  }

  render() {
    const { sessInfo } = this.props;
    const { t } = this.props;
    const { repoId } = this.store;
    const title = Boolean(repoId) ? t('Modify Repo') : t('Create Repo');
    const role = getSessInfo('role', sessInfo);
    const isNormal = role === 'user';

    return (
      <Layout backBtn={isNormal && <BackBtn label="repos" link="/dashboard/repos" />}>
        {!isNormal && (
          <NavLink>
            {role === 'developer' && <Link to="/dashboard/apps">{t('My Apps')}</Link>}
            {role === 'global_admin' && <label>{t('Platform')}</label>}
            &nbsp;/ <Link to="/dashboard/repos">{t('Repos')}</Link> / {title}
          </NavLink>
        )}

        <CreateResource title={title} aside={this.renderAside()}>
          {this.renderForm()}
        </CreateResource>
      </Layout>
    );
  }
}
