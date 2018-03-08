import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Logo from 'components/Logo';
import Form from 'components/Base/Form';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';
import Checkbox from 'components/Base/Checkbox';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  login: rootStore.login,
}))
@observer
export default class Login extends Component {
  handleSubmit = (params) => {
    this.props.login(params);
  }

  render() {
    return (
      <div className={styles.login}>
        <div className={styles.loginTitle}>
          <Logo url="../../assets/logo3.svg"/>
        </div>
        <div className={styles.loginForm}>
          <h1>Login OpenPitrix</h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item className={styles.formItem} >
              <Input className={styles.formInput} icon="search" name="username" placeholder="Username" />
            </Form.Item>
            <Form.Item className={styles.formItem} >
              <Input className={styles.formInput} type="password" icon="search" name="password" placeholder="Password" />
            </Form.Item>
            <Form.Item className={styles.formItem} >
              <Checkbox className={styles.checkbox}>Remember me</Checkbox>
            </Form.Item>
            <Form.Item className={styles.formItem} >
              <Button htmlType="submit" className={styles.submitBtn}>Login</Button>
            </Form.Item>
          </Form>
        </div>
        <p className={styles.tip}>
          <span>No openpiotrix account?</span>
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    );
  }
}
