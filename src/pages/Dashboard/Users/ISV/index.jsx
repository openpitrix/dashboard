import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import {
  Input, Select, Table, Icon, Popover, Button
} from 'components/Base';
import Layout, { Dialog } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TimeShow from 'components/TimeShow';
import { roleMap } from 'config/roles';
import TableTypes from 'components/TableTypes';

import styles from './index.scss';

const emailRegexp = '^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$';
const types = [
  { name: '按账户', value: 'account' },
  { name: '按组织', value: 'organization' }
];

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Users extends Component {
  async componentDidMount() {
    const { userStore } = this.props;
    // todo
    await userStore.fetchAll();
  }

  componentWillUnmount() {
    const { userStore } = this.props;
    userStore.reset();
  }

  changeType = async type => {
    const { userStore } = this.props;

    // todo
    if (type !== userStore.activeType) {
      userStore.activeType = type;
    }
  };

  renderHandleMenu = user => {
    const { userStore, t } = this.props;
    const { showDeleteUser, showModifyUser } = userStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/user/${user.user_id}`}>
          <Icon name="eye" type="dark" />
          {t('View detail')}
        </Link>
        <span onClick={() => showModifyUser(user)}>
          <Icon name="pen" type="dark" />
          {t('Modify User')}
        </span>
        <span onClick={() => showDeleteUser(user.user_id)}>
          <Icon name="trash" type="dark" />
          {t('Delete')}
        </span>
      </div>
    );
  };

  renderOperateModal = () => {
    const { userStore, t } = this.props;
    const {
      userDetail,
      operateType,
      changeUser,
      changeUserRole,
      createOrModify
    } = userStore;
    const {
      user_id,
      username,
      email,
      role,
      password,
      description
    } = userDetail;

    let title = t('Create New User');
    if (operateType === 'modify') {
      title = t('Modify User');
    }

    return (
      <Dialog
        width={744}
        isDialog={false}
        title={title}
        isOpen={userStore.isCreateOpen}
        onCancel={userStore.hideModal}
        onSubmit={createOrModify}
        wrapCls={styles.createForm}
      >
        {user_id && (
          <div>
            <label>{t('Name')}</label>
            <Input
              name="name"
              maxLength="50"
              value={username}
              onChange={e => {
                changeUser(e, 'username');
              }}
              required
            />
          </div>
        )}
        <div>
          <label>{t('Email')}</label>
          <Input
            name="email"
            maxLength={50}
            placeholer="username@example.com"
            value={email}
            onChange={e => {
              changeUser(e, 'email');
            }}
            pattern={emailRegexp}
            required
          />
        </div>
        <div className="selectItem">
          <label>{t('Role')}</label>
          <Select onChange={changeUserRole} value={role}>
            <Select.Option value="user">{t('Normal User')}</Select.Option>
            <Select.Option value="developer">{t('Developer')}</Select.Option>
            <Select.Option value="global_admin">
              {t('Administrator')}
            </Select.Option>
            <Select.Option value="isv">{t('ISV')}</Select.Option>
          </Select>
        </div>
        <div>
          <label>{t('Password')}</label>
          <Input
            name="password"
            type="password"
            maxLength={50}
            value={password}
            onChange={e => {
              changeUser(e, 'password');
            }}
            required={!user_id}
          />
        </div>
        <div>
          <label>{t('Description')}</label>
          <textarea
            name="description"
            maxLength={500}
            value={description}
            onChange={e => {
              changeUser(e, 'description');
            }}
          />
        </div>
      </Dialog>
    );
  };

  renderDeleteDialog = () => {
    const { userStore, t } = this.props;
    const { isDeleteOpen, hideModal, remove } = userStore;

    return (
      <Dialog
        title={t('Delete User')}
        visible={isDeleteOpen}
        onSubmit={remove}
        onCancel={hideModal}
      >
        {t('delete_user_desc')}
      </Dialog>
    );
  };

  renderToolbar() {
    const { userStore, t } = this.props;
    const {
      searchWord, onSearch, onClearSearch, showCreateUser
    } = userStore;

    return (
      <Toolbar
        placeholder={t('Search users')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
      >
        <Button className="pull-right" type="primary" onClick={showCreateUser}>
          <Icon name="add" type="white" size={16} />
          {t('Add')}
        </Button>
      </Toolbar>
    );
  }

  render() {
    const { userStore, t } = this.props;
    const { activeType } = userStore;

    const data = toJS(userStore.users);

    const columns = [
      {
        title: t('Username'),
        key: 'username',
        render: item => (
          <Link
            className={styles.userName}
            to={`/dashboard/user/${item.user_id}`}
          >
            {item.username}
          </Link>
        )
      },
      {
        title: t('Email'),
        key: 'email',
        render: item => item.email
      },
      {
        title: t('Role'),
        key: 'role',
        render: item => t(roleMap[item.role])
      },
      {
        title: t('Status'),
        key: 'status',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('Updated At'),
        key: 'update_time',
        render: item => <TimeShow time={item.status_time} type="detailTime" />
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        className: 'actions',
        render: item => (
          <Popover content={this.renderHandleMenu(item)} className="actions">
            <Icon name="more" />
          </Popover>
        )
      }
    ];

    const pagination = {
      tableType: 'Users',
      onChange: userStore.changePagination,
      total: userStore.totalCount,
      current: userStore.currentPage
    };

    return (
      <Layout pageTitle={t('全部成员')} isCenterPage centerWidth={780}>
        <div className={styles.topBar}>
          <TableTypes
            className={styles.tableTypes}
            types={types}
            activeType={activeType}
            changeType={this.changeType}
          />

          {this.renderToolbar()}
        </div>

        <Table
          columns={columns}
          dataSource={data}
          isLoading={userStore.isLoading}
          pagination={pagination}
        />

        {this.renderOperateModal()}
        {this.renderDeleteDialog()}
      </Layout>
    );
  }
}
