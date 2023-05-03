import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { throttle } from 'lodash';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import Logo from 'components/Logo';
import { Form, Notification, Swipe } from 'components/Base';
import { getUrlParam } from 'utils';
import routes, { toRoute } from 'routes';
import { itemProps } from 'config/login';
import Item from './Item';

import styles from './index.scss';

const { ButtonField, CheckboxField, TextField } = Form;

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  store: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line
    if (props.rootStore.user.isLoggedIn()) {
      props.history.replace('/');
    }
    props.rootStore.clearSession();
    this.handleSubmit = throttle(this.handleSubmit, 1000);
  }

  state = {
    hasError: false,
    showInputError: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.showInputErro !== this.state.showInputError;
  }

  get slideSetting() {
    return {
      width: '50vw',
      height: '88vh'
    };
  }

  get welcomeTxt() {
    const { t } = this.props;
    if (this.state.hasError) {
      return `${t('Sorry, login failure')}...`;
    }

    return t('Welcome back');
  }

  get title() {
    const { t } = this.props;
    if (this.state.hasError) {
      return t('Information error, please try again');
    }

    return t('Login you account');
  }

  get formInputCls() {
    return classnames(styles.formInput, {
      [styles.error]: this.state.showInputError
    });
  }

  resetInputError = () => {
    if (this.state.showInputError) {
      this.setState({
        showInputError: false
      });
    }
  };

  handleSubmit = async (e, params) => {
    const { store, user } = this.props;
    const res = await store.oauth2Check(params);

    if (res && res.user) {
      await store.fetchDetail(res.user.sub, true);
    }

    const defaultUrl = user.isNormal
      ? toRoute(routes.home)
      : toRoute(routes.portal.apps, user.defaultPortal);

    if (!(res && res.err)) {
      location.href = getUrlParam('redirect_url') || defaultUrl;
    } else {
      this.setState({
        hasError: true,
        showInputError: true
      });
    }
  };

  render() {
    const { t, store } = this.props;
    const { rememberMe, toggleRememberMe } = store;

    return (
      <div className={styles.login}>
        <div className={styles.bgContainer}>
          <Logo className={styles.logo} hasTitle />
          <div>
            <Swipe {...this.slideSetting}>
              {itemProps.map(item => (
                <Item key={item.name} t={t} {...item} />
              ))}
            </Swipe>
          </div>
        </div>
        <div className={styles.loginContent}>
          <div className={styles.loginForm}>
            <div className={styles.welcome}>{this.welcomeTxt}</div>
            <h1>{this.title}</h1>
            <Form onSubmit={this.handleSubmit}>
              <TextField
                className={this.formInputCls}
                icon="human"
                iconType="dark"
                name="email"
                iconSize={24}
                onChange={this.resetInputError}
                placeholder="username@example.com"
              />
              <TextField
                className={this.formInputCls}
                type="password"
                icon="lock"
                iconType="dark"
                name="password"
                iconSize={24}
                onChange={this.resetInputError}
                placeholder={t('Password')}
              />
              <CheckboxField
                checked={rememberMe}
                onChange={toggleRememberMe}
                className={styles.checkbox}
              >
                {t('Remember me')}
              </CheckboxField>
              <ButtonField
                type="primary"
                htmlType="submit"
                className={styles.submitBtn}
              >
                {t('Login')}
              </ButtonField>
            </Form>
          </div>
          <Notification />
        </div>
      </div>
    );
  }
}
