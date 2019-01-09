import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import {
  Icon, Button, Input, Select
} from 'components/Base';
import Layout from 'components/Layout';
import DetailTabs from 'components/DetailTabs';
import { getLoginDate, getUrlParam } from 'utils';
import SSHKeys from './SSHKeys';

import styles from './index.scss';

const tabs = [
  { name: 'Account Info', value: 'account' },
  { name: 'Change Password', value: 'password' },
  { name: 'Payment', value: 'payment', disabled: true },
  { name: 'Notice settings', value: 'notice', disabled: true },
  { name: 'SSH Keys', value: 'ssh' }
];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class Account extends Component {
  constructor(props) {
    super(props);

    const language = props.i18n.language || 'zh';
    const { type } = props.match.params;

    this.state = {
      language,
      activeTab: type || 'account'
    };
  }

  async componentDidMount() {
    const { userStore, user } = this.props;

    await userStore.fetchDetail(user.user_id);
  }

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  changeTab = tab => {
    this.setState({
      activeTab: tab
    });
  };

  modifyUser = async e => {
    const { userStore, rootStore, i18n } = this.props;
    const result = await userStore.modifyUser(e);

    if (result && result.username) {
      const { language } = this.state;
      const newLanguage = userStore.language;
      if (newLanguage !== language) {
        i18n.changeLanguage(newLanguage);
        this.setState({
          language: newLanguage
        });
      }

      rootStore.updateUser({
        username: result.username
      });

      rootStore.user.username = result.username;
    }
  };

  renderPassword() {
    const { userStore, t } = this.props;
    const { language } = this.state;
    const { modifyPassword } = userStore;

    return (
      <form
        className={classnames(styles.form, {
          [styles.fromEN]: language === 'en'
        })}
        onSubmit={modifyPassword}
        method="post"
      >
        <div>
          <label className={styles.name}>{t('Current Password')}</label>
          <Input
            className={styles.input}
            name="password"
            type="password"
            maxLength={50}
            required
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
          />
        </div>
        <div>
          <label className={styles.name}>{t('Confirm Password')}</label>
          <Input
            className={styles.input}
            name="confirm_password"
            type="password"
            maxLength={50}
            required
          />
        </div>
        <div className={styles.submitBtn}>
          <Button type={`primary`} htmlType="submit">
            {t('Save')}
          </Button>
          <Button onClick={this.goBack}>{t('Cancel')}</Button>
        </div>
      </form>
    );
  }

  renderBasic() {
    const { userStore, t } = this.props;
    const { language } = this.state;
    const { userDetail, changeUser, changeLanguage } = userStore;

    return (
      <form
        className={classnames(styles.form, {
          [styles.fromEN]: language === 'en'
        })}
        onSubmit={this.modifyUser}
        method="post"
      >
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
            value={userDetail.email}
            disabled
            readOnly
          />
        </div>
        <div>
          <label className={styles.name}>{t('Language setting')}</label>
          <Select onChange={changeLanguage} value={userStore.language}>
            <Select.Option value="zh">简体中文</Select.Option>
            <Select.Option value="en">English</Select.Option>
          </Select>
        </div>
        <div className={styles.submitBtn}>
          <Button type="primary" htmlType="submit">
            {t('Save')}
          </Button>
          <Button onClick={this.goBack}>{t('Cancel')}</Button>
        </div>
      </form>
    );
  }

  renderBanner() {
    const { user, i18n, t } = this.props;
    const { activeTab } = this.state;
    const { username, loginTime } = user;
    const language = i18n.language || 'zh';

    return (
      <div className={styles.banner}>
        <div className={styles.wrapper}>
          <div>
            <div className={styles.userImg}>
              <Icon name="human" type="dark" size={48} />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.name}>{username}</div>
              <div className={styles.loginInfo}>
                {t('last login time', {
                  last_login: getLoginDate(loginTime, language)
                })}
              </div>
            </div>
          </div>

          <DetailTabs
            className={styles.detailTabs}
            tabs={tabs}
            defaultTab={activeTab}
            changeTab={this.changeTab}
            isAccount
          />
        </div>
      </div>
    );
  }

  render() {
    const { user, t } = this.props;
    const { activeTab } = this.state;
    const { isNormal } = user;
    const filterTabs = tabs.filter(
      tab => !['payment', 'ssh'].includes(tab.value)
    );

    return (
      <Layout
        pageTitle={isNormal ? '' : t('Personal Center')}
        isCenterPage
        noSubMenu
      >
        {isNormal && this.renderBanner()}

        {!isNormal && (
          <DetailTabs
            tabs={filterTabs}
            defaultTab={activeTab}
            changeTab={this.changeTab}
          />
        )}
        <div
          className={classnames(styles.account, {
            [styles.accountBg]: !isNormal,
            [styles.accountNormal]: isNormal
          })}
        >
          {activeTab === 'account' && this.renderBasic()}
          {activeTab === 'password' && this.renderPassword()}
          {activeTab === 'ssh' && <SSHKeys />}
        </div>
      </Layout>
    );
  }
}
