import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import routes, { toRoute } from 'routes';
import {
  Icon, Button, Input, Select
} from 'components/Base';
import Layout from 'components/Layout';
import UserLayout from 'portals/user/Layout';
import DetailTabs from 'components/DetailTabs';
import { getLoginDate, getFormData } from 'utils';
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

    this.state = {
      language
    };
  }

  async componentDidMount() {
    const { userStore, user } = this.props;
    await userStore.fetchDetail(user.user_id);
  }

  cancleEdit = () => {
    this.setState(
      {
        hide: true
      },
      () => {
        this.setState({ hide: false });
      }
    );
  };

  changeTab = tab => {
    this.props.history.push(toRoute(routes.profile, { type: tab }));
  };

  modifyUser = async e => {
    e.preventDefault();

    const { userStore, rootStore, i18n } = this.props;
    const data = getFormData(e.target);
    const { username } = await userStore.modifyUser(data);

    if (username) {
      const { language } = this.state;
      const newLanguage = data.language;
      if (newLanguage !== language) {
        i18n.changeLanguage(newLanguage);
        this.setState({
          language: newLanguage
        });
      }
      rootStore.updateUser({
        username
      });
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
          <Button onClick={this.cancleEdit}>{t('Cancel')}</Button>
        </div>
      </form>
    );
  }

  renderBasic() {
    const { userStore, t } = this.props;
    const { language } = this.state;
    const { userDetail } = userStore;

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
            defaultValue={userDetail.username}
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
          <Select name="language" defaultValue={language}>
            <Select.Option value="zh">简体中文</Select.Option>
            <Select.Option value="en">English</Select.Option>
          </Select>
        </div>
        <div
          className={classnames(styles.submitBtn, {
            [styles.submitBtnEn]: language === 'en'
          })}
        >
          <Button type="primary" htmlType="submit">
            {t('Save')}
          </Button>
          <Button onClick={this.cancleEdit}>{t('Cancel')}</Button>
        </div>
      </form>
    );
  }

  renderBanner() {
    const { user, i18n, t } = this.props;
    const { type: activeTab } = this.props.match.params;
    const language = i18n.language || 'zh';

    return (
      <div className={styles.banner}>
        <div className={styles.wrapper}>
          <div>
            <div className={styles.userImg}>
              <Icon name="human" type="dark" size={32} />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.name}>{user.username}</div>
              <div className={styles.loginInfo}>
                {t('last login time', {
                  last_login: getLoginDate(user.loginTime, language)
                })}
              </div>
            </div>
          </div>

          <DetailTabs
            className={styles.detailTabs}
            tabs={tabs}
            activeTab={activeTab}
            changeTab={this.changeTab}
            isAccount
          />
        </div>
      </div>
    );
  }

  renderMain() {
    const { user } = this.props;
    const { type: activeTab } = this.props.match.params;
    const { hide } = this.state;

    if (hide) {
      return null;
    }

    return (
      <div
        className={classnames(styles.account, {
          [styles.accountBg]: user.role !== 'user'
        })}
      >
        {activeTab === 'account' && this.renderBasic()}
        {activeTab === 'password' && this.renderPassword()}
        {activeTab === 'ssh' && <SSHKeys />}
      </div>
    );
  }

  render() {
    const { user, t } = this.props;
    const { type: activeTab } = this.props.match.params;
    const filterTabs = tabs.filter(tab => !['payment'].includes(tab.value));

    if (user.defaultPortal === 'user') {
      return (
        <UserLayout
          className={classnames({
            [styles.userAccount]: activeTab !== 'ssh',
            [styles.sshPage]: activeTab === 'ssh'
          })}
          banner={this.renderBanner()}
        >
          {this.renderMain()}
        </UserLayout>
      );
    }

    return (
      <Layout pageTitle={t('Personal Center')} isCenterPage noSubMenu>
        <DetailTabs
          tabs={filterTabs}
          activeTab={activeTab}
          changeTab={this.changeTab}
        />
        {this.renderMain()}
      </Layout>
    );
  }
}
