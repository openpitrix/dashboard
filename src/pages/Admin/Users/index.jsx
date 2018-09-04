import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { formatTime } from 'utils';

import { Checkbox, Button, Select, Table, Pagination, Modal } from 'components/Base';

import Statistics from 'components/Statistics';
import Status from 'components/Status';
import TdName from 'components/TdName';
import OrgTree from 'components/OrgTree';
import GroupCard from './GroupCard';
import Layout, { BackBtn, Grid, Section, Panel, Card, Dialog } from 'components/Layout';
import Toolbar from 'components/Toolbar';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Users extends Component {
  static async onEnter({ userStore }) {
    // todo: api 404
    // await userStore.fetchAll();
    // await userStore.fetchOrganizations();
    // await userStore.fetchGroups();
    // await userStore.fetchRoles();
    // await userStore.fetchAuthorities();
  }

  constructor(props) {
    super(props);
    this.state = {
      showAuthorityModal: false,
      treeFlag: false,
      selectValue: 'Organization',
      selectItem: 0,
      organizations: []
    };
  }

  componentWillMount = () => {
    this.setState({
      organizations: this.props.userStore.organizations.toJSON()
    });
  };

  changeSelect = value => {
    this.setState({
      selectValue: value,
      selectItem: 0
    });
  };

  clickCompany = index => {
    let temp = this.state.organizations;
    temp[index].depShow = !temp[index].depShow;
    this.setState({
      treeFlag: !this.state.treeFlag,
      organizations: temp
    });
  };

  clickDep = (index, depIndex) => {
    let temp = this.state.organizations;
    temp[index].department[depIndex].staffShow = !temp[index].department[depIndex].staffShow;
    this.setState({
      treeFlag: !this.state.treeFlag,
      organizations: temp
    });
  };

  selectCard = value => {
    this.setState({
      selectItem: value
    });
  };

  openAuthorityModal = () => {
    this.setState({
      showAuthorityModal: true
    });
  };

  closeAuthorityModal = () => {
    this.setState({
      showAuthorityModal: false
    });
  };

  renderAuthorityModal = () => (
    <Modal
      width={744}
      title="Edit Administrator Policies"
      visible={this.state.showAuthorityModal}
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
                <li />
              </ul>
            </li>
            <li>
              <div>
                <Checkbox>Write</Checkbox>
              </div>
              <ul>
                <li />
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

  renderToolbar() {
    const { searchWord, onSearch, onClearSearch, onRefresh } = this.props.userStore;

    return (
      <Toolbar
        placeholder="Search users"
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      />
    );
  }

  render() {
    const { userStore } = this.props;
    const { image, name, total, centerName, progressTotal, progress, lastedTotal, histograms } = {
      image: 'http://via.placeholder.com/24x24',
      name: 'Users',
      total: 192,
      centerName: 'Roles',
      progressTotal: 5,
      progress: {},
      lastedTotal: 40,
      histograms: {}
    };

    const { treeFlag, organizations, selectValue, selectItem } = this.state;
    const groups = userStore.groups.toJSON();
    const roles = userStore.roles.toJSON();
    let selectContent;
    switch (selectValue) {
      case 'Organization':
        selectContent = (
          <OrgTree
            treeFlag={treeFlag}
            organizations={organizations}
            clickCompany={this.clickCompany}
            clickDep={this.clickDep}
          />
        );
        break;
      case 'Group':
        selectContent = (
          <GroupCard
            groups={groups}
            selectCard={this.selectCard}
            selectValue={selectValue}
            selectItem={selectItem}
          />
        );
        break;
      case 'Role':
        selectContent = (
          <GroupCard
            groups={roles}
            selectCard={this.selectCard}
            selectValue={selectValue}
            selectItem={selectItem}
          />
        );
        break;
    }

    const data = userStore.users.toJSON();
    const columns = [
      {
        title: 'UserName',
        dataIndex: 'username',
        key: 'username',
        width: '10%',
        render: text => <TdName name={text} description={text} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '8%'
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        width: '6%'
      },
      {
        title: 'Updated At',
        dataIndex: 'last_modified',
        key: 'last_modified',
        width: '10%',
        render: formatTime
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '84px'
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
      <Layout>
        <Statistics
          image={image}
          name={name}
          total={total}
          centerName={centerName}
          progressTotal={progressTotal}
          progress={progress}
          lastedTotal={lastedTotal}
          histograms={histograms}
        />

        <Grid>
          <Section size={3}>
            <Select className={styles.select} value={selectValue} onChange={this.changeSelect}>
              <Select.Option value="Organization">Organization</Select.Option>
              <Select.Option value="Group">Group</Select.Option>
              <Select.Option value="Role">Role</Select.Option>
            </Select>
            {selectValue === 'Organization' && (
              <OrgTree
                treeFlag={treeFlag}
                organizations={organizations}
                clickCompany={this.clickCompany}
                clickDep={this.clickDep}
              />
            )}
            {selectValue === 'Group' && (
              <GroupCard
                groups={groups}
                selectCard={this.selectCard}
                selectValue={selectValue}
                selectItem={selectItem}
              />
            )}
            {selectValue === 'Role' && (
              <GroupCard
                groups={roles}
                selectCard={this.selectCard}
                selectValue={selectValue}
                selectItem={selectItem}
              />
            )}
          </Section>

          <Section size={9}>
            <Card>
              {/* <div className={styles.selectedInfo}>
                <div className={styles.selected}>Selected: Developer</div>
                <div className={styles.action} onClick={this.openAuthorityModal}>
                  action
                </div>
              </div>*/}
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
        {this.renderAuthorityModal()}
      </Layout>
    );
  }
}
