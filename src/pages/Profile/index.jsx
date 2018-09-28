import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import { Button, Input } from 'components/Base';
import Layout, { Grid, Section, Card } from 'components/Layout';
import { getCookie } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: 'basic'
    };
  }

  componentDidMount() {
    const { fetchDetail } = this.props.userStore;
    const userId = getCookie('userId');
    fetchDetail(userId);
  }

  changeForm = (name, flag) => {
    if (!flag) {
      this.setState({
        currentForm: name
      });
    }
  };

  renderBasic() {
    const { userStore, t } = this.props;
    const { userDetail, changeUser, modifyUser } = userStore;
    const emailRegexp = '^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$';

    return (
      <form className={styles.form} onSubmit={e => modifyUser(e)} method="post">
        <div>
          <label className={styles.name}>{t('ID')}</label>
          <Input
            className={styles.input}
            name="user_id"
            value={userDetail.user_id}
            disabled
            readOnly
          />
        </div>
        <div>
          <label className={styles.name}>{t('User Name')}</label>
          <Input
            className={styles.input}
            name="username"
            maxLength={50}
            value={userDetail.username}
            onChange={e => {
              changeUser(e, 'username');
            }}
            required
          />
        </div>
        <div>
          <label className={styles.name}>{t('Email')}</label>
          <Input
            className={styles.input}
            name="email"
            maxLength={50}
            value={userDetail.email}
            onChange={e => {
              changeUser(e, 'email');
            }}
            pattern={emailRegexp}
            required
          />
        </div>
        <div className={styles.submitBtn}>
          <Button type={`primary`} htmlType="submit">
            {t('Modify')}
          </Button>
          <Button onClick={() => history.back()}>{t('Cancel')}</Button>
        </div>
      </form>
    );
  }

  renderPassword() {
    const { userStore, t } = this.props;
    const { modifyPassword, changeUser } = userStore;

    return (
      <form className={styles.form} onSubmit={e => modifyPassword(e)} method="post">
        <div>
          <label className={styles.name}>{t('Current Password')}</label>
          <Input
            className={styles.input}
            name="password"
            type="password"
            maxLength={50}
            required
            ref={input => (this.input = input)}
          />
        </div>
        <div>
          <label className={styles.name}>{t('New Password')}</label>
          <Input
            className={styles.input}
            name="new_password"
            type="password"
            maxLength={50}
            required
            ref={input => (this.input = input)}
          />
        </div>
        <div>
          <label className={styles.name}>{t('Confirm New Password')}</label>
          <Input
            className={styles.input}
            name="confirm_password"
            type="password"
            maxLength={50}
            required
            ref={input => (this.input = input)}
          />
        </div>
        <div className={styles.submitBtn}>
          <Button type={`primary`} htmlType="submit">
            {t('Modify')}
          </Button>
          <Button onClick={() => history.back()}>{t('Cancel')}</Button>
        </div>
      </form>
    );
  }

  render() {
    const { t } = this.props;
    const { currentForm } = this.state;

    return (
      <Layout title="Profile">
        <Grid>
          <Section size={3}>
            <div className={styles.title}>{t('Settings')}</div>
            <div className={styles.items}>
              <p
                className={classNames({ [styles.active]: currentForm === 'basic' })}
                onClick={() => this.changeForm('basic', currentForm === 'basic')}
              >
                {t('Basic setting')}
              </p>
              <p
                className={classNames({ [styles.active]: currentForm === 'password' })}
                onClick={() => this.changeForm('password', currentForm === 'password')}
              >
                {t('Change Password')}
              </p>
            </div>
          </Section>

          <Section size={9}>
            <Card>
              {currentForm === 'basic' && this.renderBasic()}
              {currentForm === 'password' && this.renderPassword()}
            </Card>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
