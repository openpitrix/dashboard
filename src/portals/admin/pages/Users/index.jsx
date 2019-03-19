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
import Toolbar from 'components/Toolbar';
import Modals from './Modals';
import columns, { filterList } from './columns';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  userDetailStore: rootStore.userDetailStore,
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

  handleAction(type, e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.modalStore.show(type);
  }

  renderTreeTitle = node => {
    const { userStore, groupStore, t } = this.props;
    const { protectedGroupsIds } = groupStore;
    const { selectedGroupIds } = userStore;
    const modifiable = !protectedGroupsIds.includes(node.key)
      && selectedGroupIds.includes(node.key);
    return this.renderGroupTitle(node, t, modifiable);
  };

  renderHandleGroupNode = ({ key, t }) => (
    <div key={`${key}-operates`} className="operate-menu">
      <span
        key={`${key}-rename`}
        onClick={e => this.handleAction('renderModalRenameGroup', e)}
      >
        {t('Rename')}
      </span>
      <span
        key={`${key}-delete`}
        onClick={e => this.handleAction('renderModalDeleteGroup', e)}
      >
        {t('Delete')}
      </span>
    </div>
  );

  renderGroupTitle = ({ title, key }, t, modifiable) => {
    const { groupStore } = this.props;
    const canEidt = key !== _.get(groupStore, 'rootGroup.group_id');
    return (
      <span key={`${key}-${title}`} className={styles.groupTitleContainer}>
        <span key={`title-${key}-${title}`} className={styles.groupTitle}>
          {t(title)}
        </span>
        {modifiable && (
          <Fragment>
            {canEidt && (
              <PopoverIcon
                portal
                trigger="hover"
                size="Small"
                key={`${key}-operate`}
                content={this.renderHandleGroupNode({ key, t })}
                className={classnames(styles.groupPopver, styles.iconMore)}
                targetCls={classnames(styles.groupPopverTarget)}
              />
            )}
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
              className={classnames(styles.iconCreate)}
              onClick={e => this.handleAction('renderModalCreateGroup', e)}
              content={t('Add the child node')}
            />
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
        <span onClick={() => modalStore.show('renderModalSetGroup', user)}>
          {t('Set group')}
        </span>
        <span onClick={() => modalStore.show('renderModalSetRole', user)}>
          {t('Set role')}
        </span>
        <span onClick={() => modalStore.show('renderModalResetPassword', user)}>
          {t('Change Password')}
        </span>
        {_.isArray(group_id) && (
          <span onClick={() => leaveGroupOnce(user)}>{t('Leave group')}</span>
        )}
        <span
          onClick={() => modalStore.show(
            'renderModalDeleteUser',
            _.assign({}, user, { type: 'one' })
          )
          }
        >
          {t('Delete')}
        </span>
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
            <Button onClick={e => this.handleAction('renderModalSetGroup', e)}>
              {t('Set group')}
            </Button>
          )}
          <Button onClick={e => this.handleAction('renderModalSetRole', e)}>
            {t('Set role')}
          </Button>
          <Button
            type="delete"
            onClick={e => this.handleAction('renderModalDeleteUser', e)}
          >
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    const withCreateBtn = groupStore.canCreateUser
      ? {
        name: t('Add'),
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
      groupName,
      onSelectOrg,
      selectedGroupIds
    } = groupStore;

    return (
      <Layout
        isCenterPage
        className={styles.usersContent}
        isLoading={isLoading}
      >
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
                  <strong className={styles.groupHeader}>{t(groupName)}</strong>
                </div>

                {Boolean(selectName) && (
                  <div className={styles.selectInfo}>{t(selectName)}</div>
                )}

                {this.renderToolbar()}

                <EnhanceTable
                  hasRowSelection
                  rowKey="user_id"
                  isLoading={userDetailStore.isLoading}
                  store={userDetailStore}
                  data={userDetailStore.users}
                  columns={columns(t, this.renderUserHandleMenu)}
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
