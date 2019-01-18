import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import {
  Button, Input, Select, Checkbox
} from 'components/Base';

import Layout, { Grid, Section, Panel } from 'components/Layout';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore
}))
@observer
export default class NotificationServer extends Component {
  state = {
    activeTab: 'Mail'
  };

  render() {
    const { t } = this.props;
    return (
      <Layout pageTitle={t('Notification server')}>
        <Grid>
          <Section size={3}>
            <div className={styles.nav}>
              <div className={styles.navHeader}>{t('Server Type')}</div>
              <ul className={styles.navUl}>
                <li className={styles.active}>{t('Mail')}</li>
                <li className={styles.disabled}>{t('SMS')}</li>
                <li className={styles.disabled}>{t('Wechat')}</li>
              </ul>
            </div>
          </Section>

          <Section size={9}>
            <Panel>
              <h3 className={styles.header}>
                <strong>{t('Mail server config')}</strong>
                <Button
                  type={`primary`}
                  className={`primary`}
                  htmlType="submit"
                >
                  {t('Save')}
                </Button>
                <Button>{t('Cancel')}</Button>
              </h3>
              <form className={styles.form}>
                <div>
                  <div>
                    <label>{t('Server protocol')}</label>
                    <Select name="type" value={'smtp'}>
                      <Select.Option value="smtp">SMTP</Select.Option>
                      <Select.Option disabled value="pop3">
                        POP3
                      </Select.Option>
                      <Select.Option disabled value="imap">
                        IMAP
                      </Select.Option>
                    </Select>
                  </div>
                </div>

                <div>
                  <div>
                    <label>SMTP {t('Server host name')}</label>
                    <Input name="server_name" />
                  </div>

                  <div>
                    <label>SMTP {t('Server host port')}</label>
                    <Input name="server_port" className={styles.smallInput} />
                  </div>
                  <div className={styles.paddingTop}>
                    <Checkbox name="ssl_connect">{t('SSL 安全连接')}</Checkbox>
                  </div>
                </div>

                <div>
                  <div>
                    <label>{t('Sender address')}</label>
                    <Input
                      name="email"
                      placeholder={`${t(
                        'for example'
                      )}：cn=admin,dc=example,dc=org`}
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <label>{t('Server username')}</label>
                    <Input
                      name="username"
                      placeholder={`${t('for example')}：name@example.com`}
                    />
                  </div>

                  <div>
                    <label>{t('Server password')}</label>
                    <Input name="password" placeholder="**********" />
                  </div>
                </div>
                <div>
                  <Button>{t('Connect test')}</Button>
                </div>
              </form>
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
