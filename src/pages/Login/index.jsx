import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { throttle } from 'lodash';
import { translate } from 'react-i18next';

import Logo from 'components/Logo';
import { Form, Input, Button, Checkbox, Notification } from 'components/Base';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  store: rootStore.loginStore
}))
@observer
export default class Login extends Component {
  handleSubmit = params => {
    this.props.store.login(params);
  };

  render() {
    const { t } = this.props;

    return (
      <div className={styles.login}>
        <div className={styles.loginContent}>
          <div className={styles.loginTitle}>
            <Logo url="/assets/logo_light.svg" />
          </div>
          <div className={styles.loginForm}>
            <h1>{t('Login OpenPitrix')}</h1>
            <Notification className={styles.notify} itemClass={styles.notifyItem} />
            <Form onSubmit={throttle(this.handleSubmit, 1000)}>
              <Form.Item className={styles.formItem} noLabel>
                <Input
                  className={styles.formInput}
                  icon="human"
                  iconType="dark"
                  name="username"
                  iconSize={24}
                  placeholder={t('Username')}
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
                <Checkbox className={styles.checkbox}>{t('Remember me')}</Checkbox>
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
