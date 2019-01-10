import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import Layout from 'components/Layout';
import roles from './roles';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Roles extends Component {
  async componentDidMount() {}

  componentWillUnmount() {
    const { userStore } = this.props;
    userStore.reset();
  }

  renderRoleCard(role) {
    const { t } = this.props;

    return (
      <div className={styles.roleCard}>
        <div className={styles.name}>
          {role.name}
          <Icon
            className={styles.rightIcon}
            name="chevron-right"
            type="dark"
            size={20}
          />
          <Icon
            className={styles.downIcon}
            name="chevron-down"
            type="dark"
            size={20}
          />
        </div>
        <div className={styles.description}>{role.description}</div>
        <div className={styles.auths}>
          {role.authList.map((item, index) => (
            <div key={index} className={styles.auth}>
              <p className={styles.title}>{item.title}</p>
              <ul>{item.auths.map(auth => <li key={auth}>{auth}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <Layout pageTitle={t('Roles')} isCenterPage centerWidth={780}>
        {roles.map(role => (
          <div key={role.value}>{this.renderRoleCard(role)}</div>
        ))}
        <div className={styles.noteWord}>
          <label className={styles.note}>{t('Note')}</label>
          {t('如果以上角色不能满足管理需求，可以')}
          <Link to={'#'}>{t('创建新角色')}</Link>
        </div>
      </Layout>
    );
  }
}
