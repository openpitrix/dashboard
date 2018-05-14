import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { throttle } from 'lodash';

import Logo from 'components/Logo';
import Form from 'components/Base/Form';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';
import Checkbox from 'components/Base/Checkbox';
import Notification from 'components/Base/Notification';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  store: rootStore.loginStore
}))
@observer
export default class Login extends Component {
  handleSubmit = params => {
    this.props.store.login(params);
  };

  resetErrMsg = () => {
    this.props.store.errMsg = '';
  };

  renderErrMsg() {
    let { errMsg } = this.props.store;

    if (errMsg) {
      return <Notification message={errMsg} onHide={this.resetErrMsg} />;
    }
    return null;
  }

  render() {
    return (
      <div className={styles.login}>
        <div className={styles.loginTitle}>
          <Logo url="/assets/logo3.svg" />
        </div>
        <div className={styles.loginForm}>
          <h1>Login OpenPitrix</h1>
          <Form onSubmit={throttle(this.handleSubmit, 1000)}>
            <Form.Item className={styles.formItem}>
              <Input
                className={styles.formInput}
                icon="search"
                name="username"
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item className={styles.formItem}>
              <Input
                className={styles.formInput}
                type="password"
                icon="search"
                name="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item className={styles.formItem}>
              <Checkbox className={styles.checkbox}>Remember me</Checkbox>
            </Form.Item>
            <Form.Item className={styles.formItem}>
              <Button htmlType="submit" className={styles.submitBtn}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
        <p className={styles.tip}>
          <span>No openpiotrix account?</span>
          <Link to="/signup">Sign up</Link>
        </p>

        {this.renderErrMsg()}
      </div>
    );
  }
}
