import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import {
  Button, Checkbox, Icon, Form
} from 'components/Base';
import Layout, { Panel } from 'components/Layout';
import Loading from 'components/Loading';

import { TEST_STATUS } from 'config/cloud-env';

import styles from './index.scss';

const { TextField, SelectField, FieldGroup } = Form;

@withTranslation()
@inject(({ rootStore }) => ({
  notificationServerStore: rootStore.notificationServerStore
}))
@observer
export default class NotificationServer extends Component {
  componentDidMount() {
    const { notificationServerStore } = this.props;
    notificationServerStore.fetchEmailConfig();
  }

  componentWillUnmount() {
    this.props.notificationServerStore.reset();
  }

  renderConnectStatus() {
    const { t, notificationServerStore } = this.props;
    const { testStatus } = notificationServerStore;
    if (testStatus === '') {
      return null;
    }

    const iconType = {
      [TEST_STATUS.loading]: 'loading',
      [TEST_STATUS.success]: 'checked-circle',
      [TEST_STATUS.failed]: 'close'
    };
    const type = testStatus === TEST_STATUS.loading ? 'light' : testStatus;

    return (
      <div className={styles.testConnect}>
        <Icon
          className={styles[testStatus]}
          name={t(iconType[testStatus])}
          type={type}
        />
        {t(`Connect ${testStatus}`)}
      </div>
    );
  }

  render() {
    const { t, notificationServerStore } = this.props;
    const {
      onChangeSelect,
      onChangeFormItem,
      formData,
      handleType,
      testStatus,
      isLoading,
      testConnect,
      changeTypeEdit,
      save,
      cancleSave
    } = notificationServerStore;
    const disabled = handleType !== 'edit';

    return (
      <Layout pageTitle={t('Notification server')}>
        <div className={styles.flex}>
          <div className={styles.nav}>
            <div className={styles.navHeader}>{t('Server Type')}</div>
            <ul className={styles.navUl}>
              <li className={styles.active}>{t('Mail')}</li>
              <li className={styles.disabled}>{t('SMS')}</li>
              <li className={styles.disabled}>{t('Wechat')}</li>
            </ul>
          </div>

          <Panel className={styles.panel}>
            <h3 className={styles.header}>
              <strong>{t('Mail server config')}</strong>
              {handleType === '' && (
                <Button onClick={changeTypeEdit}>{t('Edit')}</Button>
              )}
              {handleType === 'edit' && (
                <Fragment>
                  <Button
                    type={`primary`}
                    className={`primary`}
                    htmlType="submit"
                    onClick={save}
                  >
                    {t('Save')}
                  </Button>
                  <Button onClick={cancleSave}>{t('Cancel')}</Button>
                </Fragment>
              )}
            </h3>

            <Loading isLoading={isLoading}>
              <form className={styles.form}>
                <FieldGroup>
                  <SelectField
                    label={t('Server protocol')}
                    layout="vertical"
                    disabled={disabled}
                    onChange={onChangeSelect}
                    name="protocol"
                    value={formData.protocol}
                    options={[
                      {
                        value: 'smtp',
                        label: 'SMTP'
                      },
                      {
                        value: 'pop3',
                        label: 'POP3'
                      },
                      {
                        value: 'imap',
                        label: 'IMAP'
                      }
                    ]}
                  />
                </FieldGroup>

                <FieldGroup>
                  <TextField
                    label={`${formData.protocol.toUpperCase()} ${t(
                      'Server host name'
                    )}`}
                    layout="vertical"
                    disabled={disabled}
                    name="email_host"
                    placeholder="server name"
                    onChange={onChangeFormItem}
                    value={formData.email_host}
                  />

                  <TextField
                    label={`${formData.protocol.toUpperCase()} ${t(
                      'Server host port'
                    )}`}
                    disabled={disabled}
                    layout="vertical"
                    name="port"
                    placeholder="1000"
                    type="number"
                    size="small"
                    className={styles.smallInput}
                    onChange={onChangeFormItem}
                    value={formData.port}
                  />

                  <div className={styles.checkbox}>
                    <Checkbox
                      disabled={disabled}
                      name="ssl_enable"
                      checked={formData.ssl_enable}
                      onChange={onChangeFormItem}
                    >
                      {t('SSL 安全连接')}
                    </Checkbox>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <TextField
                    label={t('Sender nickname')}
                    layout="vertical"
                    disabled={disabled}
                    name="display_sender"
                    value={formData.display_sender}
                    onChange={onChangeFormItem}
                  />
                </FieldGroup>

                <FieldGroup>
                  <TextField
                    label={t('Server username')}
                    layout="vertical"
                    disabled={disabled}
                    name="email"
                    placeholder={`${t('for example')}：name@example.com`}
                    value={formData.email}
                    onChange={onChangeFormItem}
                  />

                  <TextField
                    label={t('Server password')}
                    layout="vertical"
                    disabled={disabled}
                    name="password"
                    type="password"
                    placeholder="**********"
                    value={formData.password}
                    onChange={onChangeFormItem}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Button
                    className={classnames({
                      [styles.btnLoading]: testStatus === TEST_STATUS.loading
                    })}
                    onClick={testConnect}
                  >
                    {t('Connect test')}
                  </Button>
                  {this.renderConnectStatus()}
                </FieldGroup>
              </form>
            </Loading>
          </Panel>
        </div>
      </Layout>
    );
  }
}
