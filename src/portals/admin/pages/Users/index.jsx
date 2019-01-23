import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import {
  Input,
  Button,
  Select,
  Table,
  Tree,
  Modal,
  Icon,
  Popover
} from 'components/Base';

import Layout, {
  Grid, Section, Panel, Card, Dialog
} from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TimeShow from 'components/TimeShow';

import { roleMap } from 'config/roles';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
class Users extends Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const { userStore } = this.props;

    await userStore.fetchAll();
    await userStore.fetchRoles();
    await userStore.fetchGroups();
    userStore.getGroupTree(this.renderGroupTitle);
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    const { userStore } = this.props;
    userStore.reset();
  }

  onGroupClick(key, type, e) {
    if (type === 'create') {
      e.stopPropagation();
    }
    e.preventDefault();
  }

  renderTreeTitle = node => {
    const { userStore } = this.props;
    const { selectOrgKeys } = userStore;
    return selectOrgKeys.includes(node.key)
      ? this.renderGroupTitle(node)
      : node.title;
  };

  renderHandleGroupNode = ({ key }) => {
    const { t } = this.props;

    return (
      <div key={`${key}-operates`} className="operate-menu">
        <span
          key={`${key}-rename`}
          onClickCapture={e => this.onGroupClick(key, 'rename', e)}
        >
          {t('Rename')}
        </span>
        <span
          key={`${key}-delete`}
          onClickCapture={e => this.onGroupClick(key, 'delete', e)}
        >
          {t('Delete')}
        </span>
      </div>
    );
  };

  renderGroupTitle = ({ title, key }) => (
    <span key={`${key}-${title}`} className={styles.groupTitleContainer}>
      <span key={`title-${key}-${title}`} className={styles.groupTitle}>
        {title}
      </span>
      <Popover
        portal
        key={`${key}-operate`}
        content={this.renderHandleGroupNode({ key })}
        className={classnames(styles.groupPopver)}
        targetCls={classnames(styles.groupPopverTarget)}
        popperCls={classnames(styles.groupPopverPopper)}
      >
        <Icon type="dark" name="more" />
      </Popover>
      <Icon
        key={`${key}-create`}
        size={20}
        type="dark"
        name="plus-square"
        className={styles.titleEventIcon}
        onClick={e => this.onGroupClick(key, 'create', e)}
      />
      {/* <Tooltip
            placement="top"
            content={t('Add the child node')}
            >
            <Icon
            key={`${key}-create`}
            size={20}
            type="dark"
            name="plus-square"
            className={styles.titleEventIcon}
            onClick={(e) => this.onGroupClick(key, 'create', e)}
            />
            </Tooltip> */}
    </span>
  );

  renderHandleMenu = user => {
    const { userStore, t } = this.props;
    const { showDeleteUser, showModifyUser, showSetRole } = userStore;

    return (
      <div className="operate-menu">
        <span onClick={() => showModifyUser(user)}>{t('Edit info')}</span>
        <span onClick={() => showSetRole(user)}>{t('Set role')}</span>
        <Link to={`/dashboard/user/${user.user_id}`}>{t('View detail')}</Link>
        <span onClick={() => showDeleteUser(user.user_id)}>{t('Delete')}</span>
      </div>
    );
  };

  renderSetRole = () => {
    const { userStore, t } = this.props;
    const { userDetail, changeUserRole, userNames } = userStore;

    return (
      <Modal
        title={t('Set role')}
        visible={userStore.isCreateOpen}
        onCancel={userStore.hideModal}
        hideFooter
      >
        <div className={styles.centerText}>
          请为已选择的 {userNames.join(',')} 等 {userNames.length}{' '}
          个账户设置新角色：
        </div>
        <form
          className="formContent"
          onSubmit={e => userStore.createOrModify(e)}
          method="post"
        >
          <div className="selectItem">
            <label>{t('Role')}</label>
            <Select onChange={changeUserRole} value={userDetail.role}>
              <Select.Option value="user">{t('Normal User')}</Select.Option>
              <Select.Option value="developer">{t('Developer')}</Select.Option>
              <Select.Option value="global_admin">
                {t('Administrator')}
              </Select.Option>
              <Select.Option value="isv">{t('ISV')}</Select.Option>
            </Select>
          </div>
          <div className="operationBtn">
            <Button type="primary" htmlType="submit">
              {t('Confirm')}
            </Button>
            <Button onClick={userStore.hideModal}>{t('Cancel')}</Button>
          </div>
        </form>
      </Modal>
    );
  };

  renderOperateModal = () => {
    const { userStore, t } = this.props;
    const {
      userDetail, operateType, changeUser, changeUserRole
    } = userStore;

    if (operateType === 'set_role') {
      return this.renderSetRole();
    }
    let title = t('Create New User');
    if (operateType === 'modify') {
      title = t('Modify User');
    }
    const emailRegexp = '^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$';

    return (
      <Modal
        title={title}
        visible={userStore.isCreateOpen}
        onCancel={userStore.hideModal}
        hideFooter
      >
        <form
          className="formContent"
          onSubmit={e => userStore.createOrModify(e)}
          method="post"
        >
          {userDetail.user_id && (
            <div className="inputItem">
              <label>{t('Name')}</label>
              <Input
                name="name"
                maxLength="50"
                value={userDetail.username}
                onChange={e => {
                  changeUser(e, 'username');
                }}
                required
              />
            </div>
          )}
          <div className="inputItem">
            <label>{t('Email')}</label>
            <Input
              name="email"
              maxLength={50}
              placeholer="username@example.com"
              value={userDetail.email}
              onChange={e => {
                changeUser(e, 'email');
              }}
              pattern={emailRegexp}
              required
            />
          </div>
          <div className="selectItem">
            <label>{t('Role')}</label>
            <Select onChange={changeUserRole} value={userDetail.role}>
              <Select.Option value="user">{t('Normal User')}</Select.Option>
              <Select.Option value="developer">{t('Developer')}</Select.Option>
              <Select.Option value="global_admin">
                {t('Administrator')}
              </Select.Option>
              <Select.Option value="isv">{t('ISV')}</Select.Option>
            </Select>
          </div>
          <div className="inputItem">
            <label>{t('Password')}</label>
            <Input
              name="password"
              type="password"
              maxLength={50}
              value={userDetail.password}
              onChange={e => {
                changeUser(e, 'password');
              }}
              required={!userDetail.user_id}
            />
          </div>
          <div className="textareaItem">
            <label>{t('Description')}</label>
            <textarea
              name="description"
              maxLength={500}
              value={userDetail.description}
              onChange={e => {
                changeUser(e, 'description');
              }}
            />
          </div>
          <div className="operationBtn">
            <Button type="primary" htmlType="submit">
              {t('Confirm')}
            </Button>
            <Button onClick={userStore.hideModal}>{t('Cancel')}</Button>
          </div>
        </form>
      </Modal>
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
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      userIds,
      showDeleteApp,
      showSetRole,
      setUserDisable,
      showCreateUser
    } = userStore;

    if (userIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button onClick={() => showSetRole()}>{t('Set role')}</Button>
          <Button onClick={() => setUserDisable(userIds[0])}>
            {t('Disable')}
          </Button>
          <Button type="delete" onClick={() => showDeleteApp(userIds)}>
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search users')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={{ name: t('Add'), onClick: showCreateUser }}
      />
    );
  }

  render() {
    const { userStore, t } = this.props;
    const { isLoading } = this.state;
    const {
      selectName, orgName, onSelectOrg, groupTreeData
    } = userStore;

    const data = toJS(userStore.users);

    const columns = [
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('Username'),
        key: 'username',
        render: item => (
          <Link to={`/dashboard/user/${item.user_id}`}>{item.username}</Link>
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
        title: t('Updated At'),
        key: 'update_time',
        render: item => <TimeShow time={item.status_time} />
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
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: userStore.selectedRowKeys,
      onChange: userStore.onChangeSelect
    };

    const pagination = {
      tableType: 'Users',
      onChange: userStore.changePagination,
      total: userStore.totalCount,
      current: userStore.currentPage
    };

    return (
      <Layout className={styles.usersContent} isLoading={isLoading}>
        <h2 className={styles.header}>{t('All Accounts')}</h2>
        <Panel className={classnames(styles.noShadow, styles.noPadding)}>
          <Grid>
            <Section size={3}>
              <Card
                className={classnames(
                  styles.noShadow,
                  styles.noPadding,
                  styles.selectInfo
                )}
              >
                <Tree
                  defaultExpandAll
                  showLine
                  hoverLine
                  renderTreeTitle={this.renderTreeTitle}
                  onSelect={onSelectOrg}
                  treeData={groupTreeData}
                />
              </Card>
            </Section>

            <Section size={9} className={styles.table}>
              <Card className={styles.noShadow}>
                <div className={styles.title}>
                  {t('Selected organization')}:
                  <strong className={styles.groupHeader}>{orgName}</strong>
                </div>

                {Boolean(selectName) && (
                  <div className={styles.selectInfo}>{t(selectName)}</div>
                )}

                {this.renderToolbar()}

                <Table
                  columns={columns}
                  dataSource={data}
                  isLoading={userStore.isLoading}
                  rowSelection={rowSelection}
                  pagination={pagination}
                />
              </Card>
            </Section>
          </Grid>
        </Panel>
        {this.renderOperateModal()}
        {this.renderDeleteDialog()}
      </Layout>
    );
  }
}
export default Users;
