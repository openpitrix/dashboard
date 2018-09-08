import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import { Button, Input } from 'components/Base';
import Layout, { Grid, Section, Card } from 'components/Layout';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Profile extends Component {
  static async onEnter({ userStore }) {
    // todo: api 404
    // await userStore.fetchUser();
  }

  constructor(props) {
    super(props);
    this.state = {
      currentForm: 'basic'
    };
  }

  changeForm = (name, flag) => {
    if (!flag) {
      this.setState({
        currentForm: name
      });
    }
  };

  renderBasic() {
    const { t } = this.props;

    return (
      <form className={styles.form}>
        <div>
          <label className={styles.name}>{t('ID')}</label>
          <Input className={styles.input} name="id" disabled />
        </div>
        <div>
          <label className={styles.name}>{t('User Name')}</label>
          <Input className={styles.input} name="name" />
        </div>
        <div>
          <label className={styles.name}>{t('Email')}</label>
          <Input className={styles.input} name="email" />
        </div>
        <div className={styles.submitBtn}>
          <Button type={`primary`} htmlType="submit">
            {t('Modify')}
          </Button>
        </div>
      </form>
    );
  }

  renderPassword() {
    const { t } = this.props;

    return (
      <form className={styles.form}>
        <div>
          <label className={styles.name}>{t('Current Password')}</label>
          <Input className={styles.input} name="current" type="password" />
        </div>
        <div>
          <label className={styles.name}>{t('New Password')}</label>
          <Input className={styles.input} name="new" type="password" />
        </div>
        <div>
          <label className={styles.name}>{t('Confirm New Password')}</label>
          <Input className={styles.input} name="confirm" type="password" />
        </div>
        <div className={styles.submitBtn}>
          <Button type={`primary`} htmlType="submit">
            {t('Modify')}
          </Button>
        </div>
      </form>
    );
  }

  render() {
    const { currentForm } = this.state;

    return (
      <Layout title="Profile">
        <Grid>
          <Section size={3}>
            <div className={styles.title}>Settings</div>
            <div className={styles.items}>
              <p
                className={classNames({ [styles.active]: currentForm === 'basic' })}
                onClick={() => this.changeForm('basic', currentForm === 'basic')}
              >
                Basic
              </p>
              <p
                className={classNames({ [styles.active]: currentForm === 'password' })}
                onClick={() => this.changeForm('password', currentForm === 'password')}
              >
                Change Password
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
