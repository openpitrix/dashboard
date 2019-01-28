import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { setPage } from 'mixins';

import {
  Button, Tree, Icon, Popover, Tooltip
} from 'components/Base';
import Layout, {
  Grid, Section, Panel, Card
} from 'components/Layout';
import EnhanceTable from 'components/EnhanceTable';
import Toolbar from 'components/Toolbar';
import ModalActions from './ModalActions';
import columns from './columns';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  userStore: rootStore.userStore,
  modalStore: rootStore.modalStore
}))
@setPage('userStore')
@observer
export default class Users extends Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const { userStore } = this.props;

    await userStore.fetchGroups();
    await userStore.fetchAll();
    await userStore.fetchRoles();
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    const { userStore } = this.props;
    userStore.reset();
  }

  handleAction(type, e) {
    e.stopPropagation();
    e.preventDefault();
    const { modalStore, userStore } = this.props;
    if (type === 'renderModalJoinGroup') {
      userStore.fetchNoGroupUser();
    }
    modalStore.show(type);
  }

  renderTreeTitle = node => {
    const { userStore, t } = this.props;
    const { selectedGroupIds } = userStore;
    return selectedGroupIds.includes(node.key)
      ? this.renderGroupTitle(node, t)
      : node.title;
  };

  renderHandleGroupNode = ({ key }) => {
    const { t } = this.props;

    return (
      <div key={`${key}-operates`} className="operate-menu">
        <span
          key={`${key}-rename`}
          onClickCapture={e => this.handleAction('renderModalRenameGroup', e)}
        >
          {t('Rename')}
        </span>
        <span
          key={`${key}-join-user`}
          onClickCapture={e => this.handleAction('renderModalJoinGroup', e)}
        >
          {t('Add user')}
        </span>
        <span
          key={`${key}-delete`}
          onClickCapture={e => this.handleAction('renderModalDeleteGroup', e)}
        >
          {t('Delete')}
        </span>
      </div>
    );
  };

  renderGroupTitle = ({ title, key }, t) => (
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
      <Tooltip
        placement="top"
        targetCls={classnames(styles.tooltip)}
        content={t('Add the child node')}
      >
        <Icon
          key={`${key}-create`}
          size={20}
          type="dark"
          name="plus-square"
          className={styles.titleEventIcon}
          onClick={e => this.handleAction('renderModalCreateGroup', e)}
        />
      </Tooltip>
    </span>
  );

  renderUserHandleMenu = user => {
    const { userStore, t } = this.props;
    const { group_id } = user;
    const { showDeleteUser, showModifyUser, leaveGroupOnce } = userStore;

    return (
      <div className="operate-menu">
        <span onClick={() => showModifyUser(user)}>{t('Edit info')}</span>
        {_.isArray(group_id) && (
          <span onClick={() => leaveGroupOnce(user)}>{t('Leave group')}</span>
        )}
        <span onClick={() => showDeleteUser(user.user_id)}>{t('Delete')}</span>
      </div>
    );
  };

  renderToolbar() {
    const { userStore, t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      selectedRowKeys,
      selectedGroupIds
    } = userStore;

    if (selectedRowKeys.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          {!_.isEmpty(selectedGroupIds) && (
            <Button
              onClick={e => this.handleAction('renderModalLeaveGroup', e)}
            >
              {t('Leave group')}
            </Button>
          )}

          <Button
            type="delete"
            onClick={e => this.handleAction('renderModalDeleteUser', e)}
          >
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
        withCreateBtn={{
          name: t('Add'),
          onClick: e => this.handleAction('renderModalCreateUser', e)
        }}
      />
    );
  }

  renderCreateGroupButton() {
    const { t } = this.props;
    return (
      <div>
        <Button
          type="primary"
          onClick={e => this.handleAction('renderModalCreateUser', e)}
        >
          {t('Create group')}
        </Button>
      </div>
    );
  }

  render() {
    const { userStore, modalStore, t } = this.props;
    const { isLoading } = this.state;
    const {
      selectName, groupName, onSelectOrg, groupTreeData
    } = userStore;

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
                {groupTreeData.length === 0 && this.renderCreateGroupButton()}
              </Card>
            </Section>

            <Section size={9} className={styles.table}>
              <Card className={styles.noShadow}>
                <div className={styles.title}>
                  {t('Selected organization')}:
                  <strong className={styles.groupHeader}>{groupName}</strong>
                </div>

                {Boolean(selectName) && (
                  <div className={styles.selectInfo}>{t(selectName)}</div>
                )}

                {this.renderToolbar()}

                <EnhanceTable
                  hasRowSelection
                  rowKey="user_id"
                  isLoading={userStore.isLoading}
                  store={userStore}
                  data={userStore.users}
                  columns={columns(t, this.renderUserHandleMenu)}
                />
              </Card>
            </Section>
          </Grid>
        </Panel>
        <ModalActions t={t} modalStore={modalStore} userStore={userStore} />
      </Layout>
    );
  }
}
