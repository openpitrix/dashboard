import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import Layout, { Panel } from 'components/Layout';
import { Button, Input } from 'components/Base';
import { getFormData } from 'utils';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  cloudEnvStore: rootStore.cloudEnvStore
}))
@observer
export default class CloudEnvironment extends Component {
  state = {
    hide: false
  };

  componentDidMount() {
    this.props.cloudEnvStore.fetchCloudInfo();
  }

  handleAction = type => {
    const { changeHandleType, saveCloudInfo } = this.props.cloudEnvStore;
    if (type === 'edit') {
      changeHandleType(type);
    } else if (type === 'save') {
      saveCloudInfo(getFormData(this.form));
    }
  };

  renderToolbar() {
    const { t, cloudEnvStore } = this.props;
    const { handleType } = cloudEnvStore;
    if (!handleType) {
      return (
        <Fragment>
          <span />
          <Button onClick={e => this.handleAction('edit', e)}>
            {t('Edit')}
          </Button>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Button type="primary" onClick={e => this.handleAction('save', e)}>
          {t('Save')}
        </Button>
        <Button onClick={this.cancelEdit}>{t('Cancel')}</Button>
      </Fragment>
    );
  }

  cancelEdit = () => {
    this.props.cloudEnvStore.changeHandleType('');
    this.setState(
      {
        hide: true
      },
      () => {
        this.setState({
          hide: false
        });
      }
    );
  };

  renderForm() {
    const { t, cloudEnvStore } = this.props;
    const { handleType, cloudInfo } = cloudEnvStore;
    if (this.state.hide) {
      return null;
    }

    return (
      <form
        className={styles.form}
        ref={node => {
          this.form = node;
        }}
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div>
          <label>{t('Name')}</label>
          <Input
            disabled={!handleType}
            className={styles.normalWidth}
            name="platform_name"
            placeholder="platform_name"
            defaultValue={cloudInfo.platform_name}
          />
        </div>
        <div>
          <label>{t('Visit address')}</label>
          <Input
            disabled={!handleType}
            className={styles.largeWidth}
            name="platform_url"
            placeholder="platform_url"
            defaultValue={cloudInfo.platform_url}
          />
        </div>
      </form>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <Layout pageTitle={t('Basic info')}>
        <Panel className={styles.layout}>
          <div className={styles.header}>
            <strong>{t('Settings')}</strong>
            {this.renderToolbar()}
          </div>
          {this.renderForm()}
        </Panel>
      </Layout>
    );
  }
}
