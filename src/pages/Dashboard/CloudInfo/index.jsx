import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import Layout, { Panel } from 'components/Layout';
import { Button, Form } from 'components/Base';

import styles from './index.scss';

const { TextField } = Form;

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

  componentWillUnmount() {
    this.props.cloudEnvStore.reset();
  }

  handleEdit = e => {
    e.preventDefault();
    this.props.cloudEnvStore.changeHandleType('edit');
  };

  handleCancelEdit = e => {
    e.preventDefault();
    this.props.cloudEnvStore.changeHandleType('');
    this.setState({ hide: true }, () => {
      this.setState({
        hide: false
      });
    });
  };

  handleSubmit = (e, data) => {
    e.preventDefault();
    this.props.cloudEnvStore.saveCloudInfo(data);
  };

  renderToolbar() {
    const { t, cloudEnvStore } = this.props;
    const { handleType } = cloudEnvStore;
    if (!handleType) {
      return (
        <Fragment>
          <Button onClick={this.handleEdit}>{t('Edit')}</Button>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Button htmlType="submit" type="primary" form="cloudInfoForm">
          {t('Save')}
        </Button>
        <Button onClick={this.handleCancelEdit}>{t('Cancel')}</Button>
      </Fragment>
    );
  }

  renderForm() {
    const { t, cloudEnvStore } = this.props;
    const { handleType, cloudInfo } = cloudEnvStore;
    if (this.state.hide) {
      return null;
    }

    return (
      <Form
        className={styles.form}
        id="cloudInfoForm"
        layout="vertical"
        onSubmit={this.handleSubmit}
      >
        <TextField
          label={t('Name')}
          disabled={!handleType}
          name="platform_name"
          layout="vertical"
          placeholder={t('Platform Name')}
          defaultValue={cloudInfo.platform_name}
        />

        <TextField
          label={t('Visit address')}
          disabled={!handleType}
          className={styles.largeWidth}
          size="large"
          name="platform_url"
          placeholder="https://lab.openpitrix.io"
          defaultValue={cloudInfo.platform_url}
        />
      </Form>
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
