import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { throttle } from 'lodash';
import { withTranslation } from 'react-i18next';

import Logo from 'components/Logo';
import {
  Form, Button, Checkbox, Notification
} from 'components/Base';
import { getUrlParam } from 'utils';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

const { TextField } = Form;

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
    sessionStorage.removeItem('module_elem_set');
  }

  handleSubmit = async (e, params) => {
    const { store, user } = this.props;
    const res = await store.oauth2Check(params);

    if (res && res.user) {
      await store.fetchDetail(res.user.sub, true);
    }

    const defaultUrl = toRoute(routes.portal.apps, user.defaultPortal);

    if (!(res && res.err)) {
      localStorage.removeItem('menuApps'); // clear newest visited menu apps
      location.href = getUrlParam('redirect_url') || defaultUrl;
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
            <Form noPadding onSubmit={throttle(this.handleSubmit, 1000)}>
              <TextField
                className={styles.formInput}
                icon="human"
                iconType="dark"
                name="email"
                iconSize={24}
                placeholder="username@example.com"
              />
              <TextField
                className={styles.formInput}
                type="password"
                icon="lock"
                iconType="dark"
                name="password"
                iconSize={24}
                placeholder={t('Password')}
              />
              <Checkbox
                checked={rememberMe}
                onChange={toggleRememberMe}
                className={styles.checkbox}
              >
                {t('Remember me')}
              </Checkbox>
              <Button htmlType="submit" className={styles.submitBtn}>
                {t('Login')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
