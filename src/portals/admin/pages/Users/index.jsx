import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Button, Tree, PopoverIcon } from 'components/Base';
import Layout, {
  Grid, Section, Panel, Card
} from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Can, { withCheckAction } from 'components/Can';
import Toolbar from 'components/Toolbar';
import ACTION, { CONDITION } from 'config/action-id';

import Modals from './Modals';
import columns, { filterList } from './columns';

import styles from './index.scss';

const ButtonWithAction = withCheckAction(Button);
const MenuItem = withCheckAction('span');

@withTranslation()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  userDetailStore: rootStore.userDetailStore,
  checkAction: rootStore.roleStore.checkAction,
  groupStore: rootStore.groupStore,
  modalStore: rootStore.modalStore
}))
@observer
export default class Users extends Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const { userStore, userDetailStore, groupStore } = this.props;

    await groupStore.fetchGroups();
    await userDetailStore.fetchAll();
    await userStore.fetchRoles();
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this.props.userStore.reset();
    this.props.userDetailStore.reset();
    this.props.groupStore.reset();
  }

  get isAdmin() {
    return this.props.groupStore.isAdmin;
  }

  get hasRowSelection() {
    if (this.isAdmin) {
      return this.props.checkAction(ACTION.TableAdminToolbar, CONDITION.or);
    }

    return this.props.checkAction(ACTION.TableAdminUserToolbar, CONDITION.or);
  }

  handleAction(type, e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.modalStore.show(type);
  }

  renderTreeTitle = node => {
    const { userStore, groupStore, t } = this.props;
    const { protectedGroupsIds } = groupStore;
    const { selectedGroupIds } = userStore;
    // prettier-ignore
    const modifiable = !protectedGroupsIds.includes(node.key)
      && selectedGroupIds.includes(node.key);

    return this.renderGroupTitle(node, t, modifiable);
  };

  renderHandleGroupNode = ({ key, t }) => (
    <div key={`${key}-operates`} className="operate-menu">
      <MenuItem
        key={`${key}-rename`}
        action={ACTION.ModifyGroup}
        onClick={e => this.handleAction('renderModalRenameGroup', e)}
      >
        {t('Rename')}
      </MenuItem>
      <MenuItem
        key={`${key}-delete`}
        onClick={e => this.handleAction('renderModalDeleteGroup', e)}
        action={ACTION.DeleteGroup}
      >
        {t('Delete')}
      </MenuItem>
    </div>
  );

  renderGroupTitle = ({ title, key, dataTestID = null }, t, modifiable) => {
    const { groupStore } = this.props;
    const canEidt = key !== _.get(groupStore, 'rootGroup.group_id');
    return (
      <span
        data-cy={dataTestID}
        key={`${key}-${title}`}
        className={styles.groupTitleContainer}
      >
        <span key={`title-${key}-${title}`} className={styles.groupTitle}>
          {t(title)}
        </span>
        {modifiable && (
          <Fragment>
            {canEidt && (
              <Can action={[ACTION.ModifyGroup, ACTION.DeleteGroup]}>
                <PopoverIcon
                  portal
                  trigger="hover"
                  size="Small"
                  key={`${key}-operate`}
                  content={this.renderHandleGroupNode({ key, t })}
                  className={classnames(styles.groupPopver, styles.popIcon)}
                  targetCls={classnames(styles.groupPopverTarget)}
                />
              </Can>
            )}
            <Can action={ACTION.CreateGroup}>
              <PopoverIcon
                portal
                isShowArrow
                trigger="hover"
                icon="add"
                placement="top"
                prefixCls="add"
                key={`${key}-operate-add`}
                iconCls={styles.titleEventIcon}
                targetCls={classnames(styles.tooltip)}
                className={classnames(styles.popIcon)}
                onClick={e => this.handleAction('renderModalCreateGroup', e)}
                content={t('Add the child node')}
              />
            </Can>
          </Fragment>
        )}
      </span>
    );
  };

  renderUserHandleMenu = user => {
    const { groupStore, modalStore, t } = this.props;
    const { group_id } = user;
    const { leaveGroupOnce } = groupStore;

    return (
      <div className="operate-menu">
        <span
          onClick={() => modalStore.show(
            'renderModalCreateUser',
            _.assign({}, user, {
              password: null
            })
          )
          }
        >
          {t('Edit info')}
        </span>
        {this.isAdmin && (
          <Fragment>
            <MenuItem
              action={ACTION.JoinGroup}
              onClick={() => modalStore.show('renderModalSetGroup', user)}
            >
              {t('Set group')}
            </MenuItem>
            <MenuItem
              action={ACTION.SetRole}
              onClick={() => modalStore.show('renderModalSetRole', user)}
            >
              {t('Set role')}
            </MenuItem>
          </Fragment>
        )}
        <span onClick={() => modalStore.show('renderModalResetPassword', user)}>
          {t('Change Password')}
        </span>
        {_.isArray(group_id) && (
          <span onClick={() => leaveGroupOnce(user)}>{t('Leave group')}</span>
        )}
      </div>
    );
  };

  renderToolbar() {
    const { userDetailStore, groupStore, t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      selectedRowKeys,
      selectedGroupIds
    } = userDetailStore;

    if (selectedRowKeys.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          {!_.isEmpty(selectedGroupIds) && (
            <ButtonWithAction
              action={ACTION.JoinGroup}
              onClick={e => this.handleAction('renderModalSetGroup', e)}
            >
              {t('Set group')}
            </ButtonWithAction>
          )}
          <ButtonWithAction
            action={ACTION.SetRole}
            onClick={e => this.handleAction('renderModalSetRole', e)}
          >
            {t('Set role')}
          </ButtonWithAction>
        </Toolbar>
      );
    }

    const withCreateBtn = groupStore.canCreateUser
      ? {
        name: t('Add'),
        action: this.isAdmin ? ACTION.CreateAdminUser : '',
        dataTestID: 'createUser',
        onClick: e => this.handleAction('renderModalCreateUser', e)
      }
      : {};

    return (
      <Toolbar
        placeholder={t('Search users')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={withCreateBtn}
      />
    );
  }

  renderCreateGroupButton() {
    const { t } = this.props;
    return (
      <div>
        <Button
          type="primary"
          onClick={e => this.handleAction('renderModalCreateGroup', e)}
        >
          {t('Create group')}
        </Button>
      </div>
    );
  }

  render() {
    const {
      userDetailStore,
      userStore,
      groupStore,
      modalStore,
      t
    } = this.props;
    const { isLoading } = this.state;
    const { selectName } = userStore;
    const {
      groupTreeData,
      selectGroupName,
      onSelectOrg,
      selectedGroupIds
    } = groupStore;

    return (
      <Layout
        isCenterPage
        className={styles.usersContent}
        isLoading={isLoading}
      >
        <h2 data-test="test" className={styles.header}>
          {t('All Accounts')}
        </h2>
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
                  id="userGroupTree"
                  defaultExpandAll
                  showLine
                  hoverLine
                  selectedKeys={selectedGroupIds}
                  renderTreeTitle={this.renderTreeTitle}
                  onSelect={onSelectOrg}
                  treeData={groupTreeData}
                />
                {groupTreeData.length === 0 && this.renderCreateGroupButton()}
              </Card>
            </Section>

            <Section size={9} className={styles.table}>
              <Card className={styles.noShadow}>
                <div className={styles.title}>
                  {t('Selected organization')}:
                  <strong className={styles.groupHeader}>
                    {t(selectGroupName)}
                  </strong>
                </div>

                {Boolean(selectName) && (
                  <div className={styles.selectInfo}>{t(selectName)}</div>
                )}

                {this.renderToolbar()}

                <EnhanceTable
                  hasRowSelection={this.hasRowSelection}
                  rowKey="user_id"
                  isLoading={userDetailStore.isLoading}
                  store={userDetailStore}
                  data={userDetailStore.users}
                  columns={columns(t, this.renderUserHandleMenu, this.isAdmin)}
                  filterList={filterList(t, userDetailStore)}
                />
              </Card>
            </Section>
          </Grid>
        </Panel>
        <Modals
          t={t}
          modalStore={modalStore}
          userStore={userStore}
          userDetailStore={userDetailStore}
          groupStore={groupStore}
        />
      </Layout>
    );
  }
}
