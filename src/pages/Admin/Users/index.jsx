import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Input, Button, Select, Table, Modal, Icon, Popover } from 'components/Base';
import Layout, { Grid, Row, Section, Panel, Card, Dialog, BreadCrumb } from 'components/Layout';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TimeShow from 'components/TimeShow';
// import OrgTree from './OrgTree';
import GroupCard from './GroupCard';

import roles, { roleMap } from 'config/roles';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Users extends Component {
  async componentDidMount() {
    const { userStore } = this.props;

    // await userStore.fetchAll();
    //await userStore.fetchStatistics();

    // todo: api 404
    // await userStore.fetchOrganizations();
    // await userStore.fetchGroups();
    // await userStore.fetchRoles();
    // await userStore.fetchAuthorities();
  }

  componentWillUnmount() {
    this.props.userStore.loadPageInit();
  }

  changeSelect = value => {
    const { userStore } = this.props;
    userStore.selectValue = value;
  };

  clickCompany = index => {
    const { userStore } = this.props;
    let temp = userStore.organizations;
    temp[index].depShow = !temp[index].depShow;
    userStore.treeFlag = !userStore.treeFlag;
    userStore.organizations = temp;
  };

  clickDep = (index, depIndex) => {
    const { userStore } = this.props;
    let temp = userStore.organizations;
    temp[index].department[depIndex].staffShow = !temp[index].department[depIndex].staffShow;
    userStore.treeFlag = !userStore.treeFlag;
    userStore.treeFlag = temp;
  };

  selectGroup = item => {
    const { userStore } = this.props;

    if (item.value !== userStore.selectGroupId) {
      userStore.selectGroupId = item.value;
      userStore.selectName = item.name;
      userStore.fetchAll();
    }
  };

  selectRole = async item => {
    const { userStore } = this.props;

    userStore.selectRoleId = item.value;
    userStore.selectName = item.name;
    userStore.currentPage = 1;

    await userStore.fetchAll();
  };

  openAuthorityModal = () => {
    const { userStore } = this.props;
    userStore.showAuthorityModal = true;
  };

  closeAuthorityModal = () => {
    const { userStore } = this.props;
    userStore.showAuthorityModal = false;
  };

  renderHandleMenu = user => {
    const { userStore, t } = this.props;
    const { showDeleteUser, showModifyUser } = userStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/user/${user.user_id}`}>{t('View detail')}</Link>
        <span onClick={() => showModifyUser(user)}>{t('Modify User')}</span>
        <span onClick={() => showDeleteUser(user.user_id)}>{t('Delete')}</span>
      </div>
    );
  };

  renderOperateModal = () => {
    const { userStore, t } = this.props;
    const { userDetail, operateType, changeUser, changeUserRole } = userStore;

    let title = t('Create New User');
    if (operateType === 'modify') {
      title = t('Modify User');
    }
    const emailRegexp =
      "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)[\\w](?:[\\w-]*[\\w])?";

    return (
      <Modal
        title={title}
        visible={userStore.isCreateOpen}
        onCancel={userStore.hideModal}
        hideFooter
      >
        <form className="formContent" onSubmit={e => userStore.createOrModify(e)} method="post">
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
              <Select.Option value="global_admin">{t('Administrator')}</Select.Option>
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
              required={!Boolean(userDetail.user_id)}
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
    const { searchWord, onSearch, onClearSearch, onRefresh, showCreateUser } = userStore;

    return (
      <Toolbar
        placeholder={t('Search users')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={{ name: t('Create'), onClick: showCreateUser }}
      />
    );
  }

  render() {
    const { userStore, t } = this.props;
    const {
      treeFlag,
      organizations,
      selectValue,
      selectGroupId,
      selectRoleId,
      selectName
    } = userStore;

    const data = userStore.users.toJSON();

    const columns = [
      {
        title: t('Username'),
        key: 'username',
        render: item => <Link to={`/dashboard/user/${item.user_id}`}>{item.username}</Link>
      },
      {
        title: t('Status'),
        key: 'status',
        render: item => <Status type={item.status} name={item.status} />
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
        key: 'status_time',
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        render: item => (
          <Popover content={this.renderHandleMenu(item)} className="actions">
            <Icon name="more" />
          </Popover>
        )
      }
    ];

    const filterList = [
      {
        key: 'status',
        conditions: [{ name: 'Active', value: 'active' }, { name: 'Deleted', value: 'deleted' }],
        onChangeFilter: userStore.onChangeStatus,
        selectValue: userStore.selectStatus
      }
    ];

    const pagination = {
      tableType: 'Users',
      onChange: userStore.changePagination,
      total: userStore.totalCount,
      current: userStore.currentPage
    };

    return (
      <Layout className={styles.usersContent}>
        <BreadCrumb linkPath="Users>All Users" />

        {/* <Row>
          <Statistics {...summaryInfo} objs={users.toJSON()} />
        </Row>*/}

        <Panel>
          <Grid>
            <Section>
              <Card className={classnames(styles.noShadow, styles.selectInfo)}>
                <Select className={styles.select} value={selectValue} onChange={this.changeSelect}>
                  {/* <Select.Option value="organization">{t('Organization')}</Select.Option>
                  <Select.Option value="group">{t('Group')}</Select.Option>*/}
                  <Select.Option value="roles">{t('Roles')}</Select.Option>
                </Select>
                {/*{selectValue === 'organization' && (*/}
                {/*<OrgTree*/}
                {/*treeFlag={treeFlag}*/}
                {/*organizations={organizations}*/}
                {/*clickCompany={this.clickCompany}*/}
                {/*clickDep={this.clickDep}*/}
                {/*/>*/}
                {/*)}*/}
                {/*{selectValue === 'group' && (*/}
                {/*<GroupCard*/}
                {/*groups={groups}*/}
                {/*selectCard={this.selectGroup}*/}
                {/*selectValue={selectGroupId}*/}
                {/*/>*/}
                {/*)}*/}
                {selectValue === 'roles' && (
                  <GroupCard groups={roles} selectCard={this.selectRole} />
                )}
              </Card>
            </Section>

            <Section size={8} className={styles.table}>
              <Card className={styles.noShadow}>
                <div className={styles.selectInfo}>{t(selectName)}</div>

                {this.renderToolbar()}

                <Table
                  columns={columns}
                  dataSource={data}
                  isLoading={userStore.isLoading}
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
