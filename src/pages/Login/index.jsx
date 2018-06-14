import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { throttle } from 'lodash';
import Logo from 'components/Logo';
import { Form, Input, Button, Checkbox, Notification } from 'components/Base';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  store: rootStore.loginStore
}))
@observer
export default class Login extends Component {
  handleSubmit = params => {
    this.props.store.login(params);
  };

  renderErrMsg() {
    let { notifyMsg, hideMsg } = this.props.store;

    notifyMsg = toJS(notifyMsg);

    if (notifyMsg) {
      return <Notification message={notifyMsg} onHide={hideMsg} />;
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
        {/*<p className={styles.tip}>*/}
        {/*<span>No openpiotrix account?</span>*/}
        {/*<Link to="/signup">Sign up</Link>*/}
        {/*</p>*/}

        {this.renderErrMsg()}
      </div>
    );
  }
}
