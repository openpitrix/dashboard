import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { throttle } from 'lodash';
import { translate } from 'react-i18next';

import Logo from 'components/Logo';
import {
  Form, Input, Button, Checkbox, Notification
} from 'components/Base';
import { getUrlParam } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  store: rootStore.userStore
}))
@observer
export default class Login extends Component {
  handleSubmit = async params => {
    const { store, history } = this.props;
    const res = await store.oauth2Check(params);

    if (res && res.user) {
      await store.fetchDetail(res.user.sub, true);
    }

    if (!(res && res.err)) {
      history.push(getUrlParam('url') || '/dashboard');
      // location.href = getUrlParam('url') || '/dashboard';
    }
  };

  render() {
    const { t, store } = this.props;
    const { rememberMe, toggleRememberMe } = store;

    return (
      <div className={styles.login}>
        <div className={styles.loginContent}>
          <div className={styles.loginTitle}>
            <Logo url="/logo_light.svg" />
          </div>
          <div className={styles.loginForm}>
            <h1>{t('Login OpenPitrix')}</h1>
            <Notification
              className={styles.notify}
              itemClass={styles.notifyItem}
            />
            <Form onSubmit={throttle(this.handleSubmit, 1000)}>
              <Form.Item className={styles.formItem} noLabel>
                <Input
                  className={styles.formInput}
                  icon="human"
                  iconType="dark"
                  name="email"
                  iconSize={24}
                  placeholder="username@example.com"
                />
              </Form.Item>
              <Form.Item className={styles.formItem} noLabel>
                <Input
                  className={styles.formInput}
                  type="password"
                  icon="lock"
                  iconType="dark"
                  name="password"
                  iconSize={24}
                  placeholder={t('Password')}
                />
              </Form.Item>
              <Form.Item className={styles.formItem} noLabel>
                <Checkbox
                  checked={rememberMe}
                  onChange={toggleRememberMe}
                  className={styles.checkbox}
                >
                  {t('Remember me')}
                </Checkbox>
              </Form.Item>
              <Form.Item className={styles.formItem} noLabel>
                <Button htmlType="submit" className={styles.submitBtn}>
                  {t('Login')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
