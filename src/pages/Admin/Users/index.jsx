import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import {
  Checkbox,
  Input,
  Button,
  Select,
  Table,
  Pagination,
  Modal,
  Icon,
  Popover
} from 'components/Base';
import Layout, { Grid, Row, Section, Panel, Card, Dialog, NavLink } from 'components/Layout';
import Statistics from 'components/Statistics';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TimeShow from 'components/TimeShow';
import OrgTree from './OrgTree';
import GroupCard from './GroupCard';
import { formatTime } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Users extends Component {
  constructor(props) {
    super(props);
    props.userStore.loadPageInit();
  }

  async componentWillMount() {
    const { userStore } = this.props;

    await userStore.fetchAll();
    //await userStore.fetchStatistics();

    // todo: api 404
    // await userStore.fetchOrganizations();
    // await userStore.fetchGroups();
    // await userStore.fetchRoles();
    // await userStore.fetchAuthorities();
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

  selectRole = item => {
    const { userStore } = this.props;

    if (item.value !== userStore.selectRoleId) {
      userStore.selectRoleId = item.value;
      userStore.selectName = item.name;
      userStore.currentPage = 1;
      userStore.fetchAll();
    }
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

  /*renderAuthorityModal = () => {
    const { userStore } = this.props;

    return (
      <Modal
        width={744}
        title="Edit Administrator Policies"
        visible={userStore.showAuthorityModal}
        hideFooter
        onCancel={this.closeAuthorityModal}
      >
        <div className={styles.authorityModal}>
          <section className={styles.category}>
            <div className={styles.title}>
              <Checkbox>Repos</Checkbox>
            </div>
            <p className={styles.description}>
              Provides full access to Openpitrix services and resources.
            </p>
            <ul className={styles.authorityList}>
              <li>
                <Checkbox>All Operations</Checkbox>
              </li>
              <li>
                <div>
                  <Checkbox>List</Checkbox>
                </div>
                <ul className={styles.innerList}>
                  <li>
                    <Checkbox>GetConsoleOutput</Checkbox>
                  </li>
                  <li>
                    <Checkbox>DescribeElasticGpus</Checkbox>
                  </li>
                  <li>
                    <Checkbox>GetConsoleScreenshot</Checkbox>
                  </li>
                  <li>
                    <Checkbox>DescribeScheduledInstanceAvailability</Checkbox>
                  </li>
                  <li>
                    <Checkbox>GetConsoleOutput</Checkbox>
                  </li>
                  <li>
                    <Checkbox>DescribeElasticGpus</Checkbox>
                  </li>
                  <li>
                    <Checkbox>GetConsoleScreenshot</Checkbox>
                  </li>
                  <li>
                    <Checkbox>DescribeScheduledInstanceAvailability</Checkbox>
                  </li>
                </ul>
              </li>
              <li>
                <div>
                  <Checkbox>Read</Checkbox>
                </div>
                <ul>
                  <li/>
                </ul>
              </li>
              <li>
                <div>
                  <Checkbox>Write</Checkbox>
                </div>
                <ul>
                  <li/>
                </ul>
              </li>
            </ul>
          </section>
          <section className={styles.category}>
            <div className={styles.title}>
              <Checkbox>Runtimes</Checkbox>
            </div>
            <p className={styles.description}>
              Grants full access to AlexaForBusiness resources and access to related AWS Services.
            </p>
          </section>
          <section className={styles.category}>
            <div className={styles.title}>
              <Checkbox>Apps</Checkbox>
            </div>
            <p className={styles.description}>
              Provide gateway execution access to AlexaForBusiness services
            </p>
          </section>
          <section className={styles.category}>
            <div className={styles.title}>
              <Checkbox>Clusters</Checkbox>
            </div>
            <p className={styles.description}>Allows API Gateway to push logs to user's account.</p>
          </section>
          <div className={styles.operation}>
            <Button type="primary">Confirm</Button>
            <Button type="default" onClick={this.closeAuthorityModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  };*/

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
      summaryInfo,
      users,
      treeFlag,
      organizations,
      selectValue,
      selectGroupId,
      selectRoleId,
      selectName
    } = userStore;
    const groups = userStore.groups.toJSON();

    const roles = [
      {
        name: 'Administrator',
        value: 'global_admin',
        description:
          'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
      },
      {
        name: 'Developer',
        value: 'developer',
        description:
          'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
      },
      {
        name: 'Normal User',
        value: 'user',
        description:
          'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
      }
    ];

    const roleMap = {
      global_admin: 'Administrator',
      developer: 'Developer',
      user: 'Normal User'
    };

    const data = userStore.users.toJSON();

    const columns = [
      {
        title: 'UserName',
        key: 'username',
        render: item => <Link to={`/dashboard/user/${item.user_id}`}>{item.username}</Link>
      },
      {
        title: 'Status',
        key: 'status',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: 'Email',
        key: 'email',
        render: item => item.email
      },
      {
        title: 'Role',
        key: 'role',
        render: item => t(roleMap[item.role])
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: 'Actions',
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
        <NavLink>
          {t('Users')} / {t('All Users')}
        </NavLink>

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
                {selectValue === 'organization' && (
                  <OrgTree
                    treeFlag={treeFlag}
                    organizations={organizations}
                    clickCompany={this.clickCompany}
                    clickDep={this.clickDep}
                  />
                )}
                {selectValue === 'group' && (
                  <GroupCard
                    groups={groups}
                    selectCard={this.selectGroup}
                    selectValue={selectGroupId}
                  />
                )}
                {selectValue === 'roles' && (
                  <GroupCard
                    groups={roles}
                    selectCard={this.selectRole}
                    selectValue={selectRoleId}
                  />
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
