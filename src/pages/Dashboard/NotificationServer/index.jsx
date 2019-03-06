import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import {
  Button, Input, Select, Checkbox, Icon
} from 'components/Base';

import Layout, { Panel } from 'components/Layout';
import Loading from 'components/Loading';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  notificationServerStore: rootStore.notificationServerStore
}))
@observer
export default class NotificationServer extends Component {
  componentDidMount() {
    const { notificationServerStore } = this.props;
    notificationServerStore.fetchEmailConfig();
  }

  renderConnectStatus() {
    const { t, notificationServerStore } = this.props;
    const { testStatus } = notificationServerStore;
    if (testStatus === '') {
      return null;
    }

    const iconType = {
      loading: 'loading',
      success: 'checked-circle',
      failed: 'close'
    };
    const type = testStatus === 'loading' ? 'light' : testStatus;

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
      testStatus,
      isLoading,
      testConnect,
      save,
      cancleSave
    } = notificationServerStore;

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
              <Button
                type={`primary`}
                className={`primary`}
                htmlType="submit"
                onClick={save}
              >
                {t('Save')}
              </Button>
              <Button onClick={cancleSave}>{t('Cancel')}</Button>
            </h3>

            <Loading isLoading={isLoading}>
              <form className={styles.form}>
                <div>
                  <div>
                    <label>{t('Server protocol')}</label>
                    <Select
                      onChange={onChangeSelect}
                      name="protocol"
                      value={formData.protocol}
                    >
                      <Select.Option value="smtp">SMTP</Select.Option>
                      <Select.Option value="pop3">POP3</Select.Option>
                      <Select.Option value="imap">IMAP</Select.Option>
                    </Select>
                  </div>
                </div>

                <div>
                  <div>
                    <label>
                      {`${formData.protocol.toUpperCase()} ${t(
                        'Server host name'
                      )}`}
                    </label>
                    <Input
                      name="email_host"
                      placeholder="server name"
                      onChange={onChangeFormItem}
                      value={formData.email_host}
                    />
                  </div>

                  <div>
                    <label>
                      {`${formData.protocol.toUpperCase()} ${t(
                        'Server host port'
                      )}`}
                    </label>
                    <Input
                      name="port"
                      placeholder="1000"
                      type="number"
                      className={styles.smallInput}
                      onChange={onChangeFormItem}
                      value={formData.port}
                    />
                  </div>
                  <div className={styles.paddingTop}>
                    <Checkbox
                      name="ssl_enable"
                      checked={formData.ssl_enable}
                      onChange={onChangeFormItem}
                    >
                      {t('SSL 安全连接')}
                    </Checkbox>
                  </div>
                </div>

                <div>
                  <div>
                    <label>{t('Sender nickname')}</label>
                    <Input
                      name="display_email"
                      value={formData.display_sender}
                      onChange={onChangeFormItem}
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <label>{t('Server username')}</label>
                    <Input
                      name="email"
                      placeholder={`${t('for example')}：name@example.com`}
                      value={formData.email}
                      onChange={onChangeFormItem}
                    />
                  </div>

                  <div>
                    <label>{t('Server password')}</label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="**********"
                      value={formData.password}
                      onChange={onChangeFormItem}
                    />
                  </div>
                </div>
                <div>
                  <Button
                    className={classnames({
                      [styles.btnLoading]: testStatus === 'loading'
                    })}
                    onClick={testConnect}
                  >
                    {t('Connect test')}
                  </Button>
                  {this.renderConnectStatus()}
                </div>
              </form>
            </Loading>
          </Panel>
        </div>
      </Layout>
    );
  }
}
