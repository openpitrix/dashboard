import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Checkbox, Input, Button, Select, Table, Pagination, Modal } from 'components/Base';
import Layout, {
  BackBtn,
  Grid,
  Row,
  Section,
  Panel,
  Card,
  Dialog,
  NavLink
} from 'components/Layout';
import Statistics from 'components/Statistics';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TimeShow from 'components/TimeShow';
import OrgTree from './OrgTree';
import GroupCard from './GroupCard';
import { formatTime } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) => ({
  userStore: rootStore.userStore,
  sessInfo
}))
@observer
export default class Users extends Component {
  static async onEnter({ userStore }) {
    // todo: api 404
    // await userStore.fetchAll();
    await userStore.fetchStatistics();
  }

  constructor(props) {
    super(props);
  }

  componentWillMount = () => {
    // todo: api 404
    // await userStore.fetchOrganizations();
    // await userStore.fetchGroups();
    // await userStore.fetchRoles();
    // await userStore.fetchAuthorities();
  };

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

  selectCard = (index, name) => {
    const { userStore } = this.props;
    userStore.selectItem = index;
    userStore.selectName = name;
  };

  openAuthorityModal = () => {
    const { userStore } = this.props;
    userStore.showAuthorityModal = true;
  };

  closeAuthorityModal = () => {
    const { userStore } = this.props;
    userStore.showAuthorityModal = false;
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

  renderCreateModal = () => {
    const { userStore, t } = this.props;
    const { isCreateOpen, hideModal } = userStore;

    return (
      <Modal
        title={t('Create New User')}
        visible={isCreateOpen}
        onCancel={hideModal}
        onOk={hideModal}
      >
        <div className="formContent">
          <div className="inputItem">
            <label>{t('Name')}</label>
            <Input name="name" autoFocus maxLength="50" />
          </div>
          <div className="inputItem">
            <label>{t('Email')}</label>
            <Input name="name" autoFocus maxLength="50" />
          </div>
          <div className="inputItem">
            <label>{t('Role')}</label>
            <Input name="name" autoFocus maxLength="50" />
          </div>
          <div className="inputItem textareaItem">
            <label>{t('Description')}</label>
            <textarea name="description" maxLength="2000" />
          </div>
        </div>
      </Modal>
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
    const { userStore } = this.props;
    const {
      summaryInfo,
      users,
      treeFlag,
      organizations,
      selectValue,
      selectItem,
      selectName
    } = userStore;
    const groups = userStore.groups.toJSON();
    //const roles = userStore.roles.toJSON();
    const roles = [
      {
        id: 'd522859-4824-beb9',
        name: 'Administrator',
        description:
          'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
      },
      {
        id: 'd549a285-3859-4824-bds3',
        name: 'Developer',
        description:
          'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
      },
      {
        id: 'd549a285-3859-4824-as21',
        name: 'Normal User',
        description:
          'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
      }
    ];

    const data = userStore.users.toJSON();

    const columns = [
      {
        title: 'UserName',
        key: 'username',
        render: item => item.name
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
        render: item => item.role
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: 'Actions',
        key: 'actions',
        render: item => (
          <div>
            <Icon name="more" />
          </div>
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
        <NavLink>Users / All Users</NavLink>

        <Row>
          <Statistics {...summaryInfo} objs={users.toJSON()} />
        </Row>

        <Panel>
          <Grid>
            <Section>
              <Card className={classnames(styles.noShadow, styles.selectInfo)}>
                <Select className={styles.select} value={selectValue} onChange={this.changeSelect}>
                  <Select.Option value="organization">Organization</Select.Option>
                  <Select.Option value="group">Group</Select.Option>
                  <Select.Option value="roles">Roles</Select.Option>
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
                    selectCard={this.selectCard}
                    selectValue={selectValue}
                    selectItem={selectItem}
                  />
                )}
                {selectValue === 'roles' && (
                  <GroupCard
                    groups={roles}
                    selectCard={this.selectCard}
                    selectValue={selectValue}
                    selectItem={selectItem}
                  />
                )}
              </Card>
            </Section>

            <Section size={8} className={styles.table}>
              <Card className={styles.noShadow}>
                <div className={styles.selectInfo}>{selectName}</div>

                {this.renderToolbar()}

                <Table
                  columns={columns}
                  dataSource={data}
                  isLoading={userStore.isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
            </Section>
          </Grid>
        </Panel>
        {this.renderCreateModal()}
      </Layout>
    );
  }
}
