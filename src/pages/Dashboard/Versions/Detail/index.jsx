import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import {
  Icon, Image, Button, PopoverIcon, Upload
} from 'components/Base';
import Layout, {
  Grid,
  Section,
  Card,
  Dialog,
  Stepper
} from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import CheckFiles from 'components/CheckFiles';
import UploadShow from 'components/UploadShow';
import { versionTypes } from 'config/version-types';
import AppDetail from 'pages/AppDetail';
import { formatTime, sleep, mappingStatus } from 'utils';
import routes, { toRoute } from 'routes';
import { DELETE_VERSION_STATUS } from 'config/version.js';
import Info from '../../Apps/Info';
import VersionEdit from '../VersionEdit';

import styles from './index.scss';

const actionType = {
  draft: 'submit',
  submitted: 'submit',
  passed: 'release',
  rejected: 'submit',
  active: 'active',
  suspended: 'suspended'
};
const actionName = {
  submit: 'Submit review',
  submitted: 'Cancel review',
  release: 'Release to store',
  active: 'View in store',
  suspended: 'View in store'
};
const tags = [
  { name: 'Config File', value: 'configFile' },
  { name: 'Set Price', value: 'setPrice', disabled: true },
  { name: 'Update Log', value: 'updateLog' }
];

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  appCreateStore: rootStore.appCreateStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore
}))
@observer
export default class VersionDetail extends Component {
  state = {
    isLoading: false
  };

  async componentDidMount() {
    const {
      appVersionStore,
      appStore,
      categoryStore,
      userStore,
      clusterStore,
      match
    } = this.props;
    const { appId, versionId } = match.params;

    this.setState({ isLoading: true });
    // query this version version detail
    await appVersionStore.fetch(versionId);
    appVersionStore.description = _.get(appVersionStore, 'version.description');

    // query this version relatived app info
    await appStore.fetch(appId);

    // query this version submit record
    await appVersionStore.fetchAudits({
      app_id: appId,
      version_id: versionId
    });
    this.setState({ isLoading: false });

    // query record relative operators name
    const userIds = _.get(appVersionStore.audits, versionId, []).map(
      item => item.operator
    );
    await userStore.fetchAll({ user_id: userIds });

    // query categories data for category select
    await categoryStore.fetchAll();

    // query deploy test instances
    await clusterStore.fetchAll({ app_id: appId, noLimit: true });
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  onUploadClick = () => {
    this.uploadRef.onClick();
  };

  changeTab = tab => {
    const { appStore } = this.props;
    appStore.detailTab = tab;
  };

  updateLog = async () => {
    const { appVersionStore, t } = this.props;
    const { version, description, modify } = appVersionStore;
    await modify({
      version_id: version.version_id,
      description
    });

    const result = appVersionStore.createResult;
    if (!(result && result.err)) {
      appVersionStore.info(t('Update log successful'));
    }
  };

  resetLog = () => {
    const { appVersionStore } = this.props;
    appVersionStore.description = '';
  };

  toggleReason(record) {
    record.isExpand = !record.isExpand;
  }

  handleVersion = async (handleType, noDailog) => {
    const {
      appVersionStore, appStore, match, history
    } = this.props;
    const { appId, versionId } = match.params;

    if (['active', 'suspended'].includes(handleType)) {
      history.push(toRoute(routes.appDetail, { appId }));
      return false;
    }

    // judge you can edit app info
    if (!noDailog && handleType === 'submit') {
      await appVersionStore.fetchAll({ app_id: appId });
      const { versions } = appVersionStore;
      const { appDetail } = appStore;
      appStore.isEdit = !_.find(versions, { status: 'in-review' })
        && appDetail.status !== 'deleted';
    }

    const hasDailog = ['delete', 'submit', 'cancel'].includes(handleType);
    if (!noDailog && hasDailog) {
      appVersionStore.showTypeDialog(handleType);
    } else {
      const result = await appVersionStore.handle(handleType, versionId);

      // after operate will has new audit
      if (!(result && result.err)) {
        await appVersionStore.fetchAudits({
          app_id: appId,
          version_id: versionId
        });
      }
    }
  };

  deleteVersion = async () => {
    const { appVersionStore, match, history } = this.props;
    const { versionId, appId } = match.params;
    const result = await appVersionStore.handle('delete', versionId);

    if (!(result && result.err)) {
      await sleep(1000);
      history.push(
        toRoute(routes.portal._dev.versions, {
          appId
        })
      );
    }
    appVersionStore.hideModal();
  };

  renderHandleMenu = () => {
    const { appVersionStore, match, t } = this.props;
    const { appId, versionId } = match.params;
    const { version, showTypeDialog } = appVersionStore;
    const { status } = version;
    const hasDeleteBtn = DELETE_VERSION_STATUS.includes(status);

    return (
      <div className="operate-menu">
        <Link
          to={toRoute(routes.portal.deploy, {
            appId,
            versionId
          })}
        >
          <Icon name="stateful-set" type="dark" />
          {t('Deploy App')}
        </Link>
        {status === 'submitted' && (
          <span onClick={() => this.handleVersion('cancel')}>
            <Icon name="restart" type="dark" /> {t(actionName[status])}
          </span>
        )}
        {hasDeleteBtn && (
          <span onClick={() => showTypeDialog('delete')}>
            <Icon name="trash" type="dark" /> {t('Delete')}
          </span>
        )}
      </div>
    );
  };

  renderDeleteDialog = () => {
    const { appVersionStore, t } = this.props;
    const { isDialogOpen, hideModal } = appVersionStore;

    return (
      <Dialog
        title={t('Delete Version')}
        isOpen={isDialogOpen}
        onSubmit={this.deleteVersion}
        onCancel={hideModal}
      >
        {t('Delete Version desc')}
      </Dialog>
    );
  };

  renderCancelDialog = () => {
    const { appVersionStore, t } = this.props;
    const { isDialogOpen, hideModal } = appVersionStore;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isDialogOpen}
        onSubmit={() => this.handleVersion('cancel', true)}
        onCancel={hideModal}
        okText={t('Undo')}
      >
        {t('CANNEL_VERSION_DESC')}
      </Dialog>
    );
  };

  renderNoteDialog = () => {
    const { appVersionStore, t } = this.props;
    const { isDialogOpen, hideModal, changeSubmitCheck } = appVersionStore;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isDialogOpen}
        onSubmit={changeSubmitCheck}
        onCancel={hideModal}
        okText={t('Submit review')}
        cancelText={t('Continue testing')}
      >
        <div className={styles.noteContent}>
          <p>
            在正式提交审核之前，请确认你的应用已经通过了以下基本功能的测试：
          </p>
          <div className={styles.noteList}>
            1. 成功部署实例
            <br />
            2. 集群运行正常
            <br />
            3. 增加节点正常
            <br />
            4. 删除节点正常 <br />
            5. 修改节点配置正常 <br />
            6. 切换私有网络正常
            <br />
            7. 暂停集群正常
            <br />
            8. 删除集群正常
            <br />
            9. 恢复集群正常
            <br />
          </div>
          <p>
            更全面的测试手册请参看<Link to={'#'}>《开发者测试指南》</Link>。
          </p>
        </div>
      </Dialog>
    );
  };

  renderReleaseDialog = () => {
    const { appVersionStore, match, t } = this.props;
    const { isDialogOpen, hideModal } = appVersionStore;
    const { appId } = match.params;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isDialogOpen}
        onSubmit={() => this.handleVersion('cancel', true)}
        onCancel={hideModal}
        hideFooter
      >
        <div className={styles.releaseContent}>
          <p className={styles.title}>{t('Congratulations on you')} </p>
          <p className={styles.description}> {t('APP_SHELF_AND_SELL')}</p>
          <Link
            to={toRoute(routes.appDetail, {
              appId
            })}
          >
            <Button type="primary">{t('View in store')}</Button>
          </Link>
        </div>
      </Dialog>
    );
  };

  renderReason(record) {
    const { t } = this.props;

    if (!record.message) {
      return null;
    }

    return (
      <div className={styles.reason}>
        {t('Reason')}:
        {record.isExpand ? (
          <div>
            <pre>{record.message}</pre>
            <br />
            <div
              onClick={() => this.toggleReason(record)}
              className={styles.collapse}
            >
              {t('Collapse')}
            </div>
          </div>
        ) : (
          <label>
            <span className={styles.hideReason}>&nbsp;{record.message}</span>
            <span
              onClick={() => this.toggleReason(record)}
              className={styles.expand}
            >
              {t('Expand')}
            </span>
          </label>
        )}
      </div>
    );
  }

  renderTestInstance() {
    const { clusterStore, match, t } = this.props;
    const { clusters } = clusterStore;
    const { appId } = match.params;

    if (clusters.length === 0) {
      return (
        <Card className={styles.testInstance}>
          <div className={styles.title}>{t('Test instance')}</div>
          <div className={styles.note}>
            {t('There are no deployment test instances in this release')}
          </div>
        </Card>
      );
    }

    return (
      <Card className={styles.testInstance}>
        <div className={styles.title}>{t('Test instance')}</div>
        <ul className={styles.list}>
          {clusters.map(item => (
            <li key={item.cluster_id}>
              <Link
                to={toRoute(routes.portal._dev.sandboxInstanceDetail, {
                  appId,
                  clusterId: item.cluster_id
                })}
                className={styles.name}
              >
                {item.name}
              </Link>
              <span className={styles.status}>
                <Status type={item.status} name={item.status} />
              </span>
            </li>
          ))}
        </ul>
      </Card>
    );
  }

  renderLatestRecord() {
    const { appVersionStore, userStore, t } = this.props;
    const { users } = userStore;
    const { version, audits } = appVersionStore;
    const audit = _.get(audits[version.version_id], '[0]', {});

    return (
      <Card className={styles.latestRecord}>
        <div className={styles.title}>{t('Latest record')}</div>
        <Status
          type={audit.status}
          name={mappingStatus(audit.status)}
          className={styles.status}
        />
        <div className={styles.record}>
          <div className={styles.operator}>
            {t(audit.operator_type)}:&nbsp;
            {(_.find(users, { user_id: audit.operator }) || {}).email
              || audit.operator}
          </div>
          {this.renderReason(audit)}
          <div className={styles.time}>
            {formatTime(audit.status_time, 'YYYY/MM/DD HH:mm:ss')}
          </div>
        </div>
        <div className={styles.link}>
          <Link
            to={toRoute(routes.portal._dev.appAudits, {
              appId: version.app_id
            })}
          >
            {t('View all records')} →
          </Link>
        </div>
      </Card>
    );
  }

  renderUpdateLog() {
    const { appVersionStore, t } = this.props;
    const { version, changeDescription, description } = appVersionStore;
    const isEdit = version.status === 'draft' || version.status === 'rejected';

    if (isEdit) {
      return (
        <div className={styles.updateLog}>
          <p>{t('Used to describe the detailed update of this version')}:</p>
          <textarea
            className={styles.description}
            value={description}
            onChange={changeDescription}
            autoFocus
          />
          <div className={styles.submitButtons}>
            <Button
              onClick={this.updateLog}
              type="primary"
              disabled={!description}
            >
              {t('Save')}
            </Button>
            <Button onClick={this.resetLog}>{t('Reset')}</Button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.updateLog}>
        <pre>{description || t('None')}</pre>
      </div>
    );
  }

  renderFileConfig() {
    const { appVersionStore, appStore, t } = this.props;
    const { isLoading } = this.state;
    const {
      version,
      createError,
      uploadError,
      packageName,
      checkPackageFile,
      uploadPackage,
      downloadPackage
    } = appVersionStore;

    const { appDetail } = appStore;
    const isShowUpload = isLoading || Boolean(createError);
    const errorFiles = _.keys(uploadError);

    const isEdit = version.status === 'draft' || version.status === 'rejected';
    const pkgName = packageName || `${appDetail.name}-${version.name}`;

    return (
      <div className={styles.configFile}>
        {!isShowUpload && (
          <div className={styles.fileInfo}>
            <div className={styles.name}>{pkgName}</div>
            <div className={styles.time}>
              {t('Upload time')}:&nbsp;
              {formatTime(version.status_time, 'YYYY/MM/DD HH:mm:ss')}
              <span
                className={styles.link}
                onClick={() => downloadPackage(version.version_id, pkgName)}
              >
                {t('Download')}
              </span>
              {isEdit && (
                <span
                  className={styles.link}
                  onClick={() => this.onUploadClick()}
                >
                  {t('Modify')}
                </span>
              )}
            </div>
          </div>
        )}
        <Upload
          className={classnames(styles.upload, { [styles.show]: isShowUpload })}
          ref={node => {
            this.uploadRef = node;
          }}
          checkFile={checkPackageFile}
          uploadFile={uploadPackage}
        >
          <UploadShow
            isLoading={isLoading}
            errorMessage={createError}
            fileName={packageName}
          />
        </Upload>
        <CheckFiles
          className={styles.checkFile}
          type={version.type}
          errorFiles={errorFiles}
          isShowNote
        />
      </div>
    );
  }

  renderTopInfo() {
    const { appVersionStore, appStore, t } = this.props;
    const { version } = appVersionStore;
    const { appDetail } = appStore;
    const handleType = actionType[version.status];
    const hasOperate = version.status !== 'deleted';

    return (
      <Card>
        <div className={styles.topInfo}>
          <div className={styles.main}>
            {(_.find(versionTypes, { value: version.type }) || {}).name}
            <label>/</label>
            {version.name}
          </div>
          <div className={styles.secondary}>
            <label>
              {t('Its application')}:&nbsp;
              <span className={styles.appName}>
                <span className={styles.imgOuter}>
                  <Image
                    src={appDetail.icon}
                    iconLetter={appDetail.name}
                    iconSize={20}
                  />
                </span>
                {appDetail.name}
              </span>
            </label>
            <label>
              {t('Version')}ID:&nbsp;
              <span className={styles.versionId}>{version.version_id}</span>
            </label>
            <label>
              {t('Update time')}:&nbsp;
              {formatTime(version.status_time, 'YYYY/MM/DD HH:mm:ss')}
            </label>
          </div>
        </div>
        {hasOperate && (
          <div className={styles.operateBtns}>
            {version.status !== 'suspended' && (
              <Button
                disabled={['submitted', 'in-review'].includes(version.status)}
                type="primary"
                onClick={() => this.handleVersion(handleType)}
              >
                {t(actionName[handleType] || version.status)}
              </Button>
            )}
            <PopoverIcon
              showBorder
              size="Large"
              className={styles.operation}
              content={this.renderHandleMenu()}
            />
          </div>
        )}
      </Card>
    );
  }

  renderSuccessMesage() {
    const { appVersionStore, t } = this.props;
    const { changeSubmitCheck } = appVersionStore;

    return (
      <div className={styles.successMesage}>
        <Icon className={styles.icon} name="checked-circle" size={48} />
        <div className={styles.textHeader}>{t('你的应用已提交成功')}</div>
        <Button type="primary" onClick={changeSubmitCheck}>
          {t('查看版本')}
        </Button>
        <div className={styles.note}>
          <label>{t('Note')}</label>
          {t('整个审核包括应用服务商审核和平台审核两个环节，请留意审核通知。')}
        </div>
      </div>
    );
  }

  render() {
    const { appVersionStore, appStore, t } = this.props;
    const { activeStep, dialogType, isSubmitCheck } = appVersionStore;
    const { detailTab } = appStore;

    if (isSubmitCheck) {
      return (
        <Stepper name="VERSION_SUBMIT_CHECK" stepOption={appVersionStore}>
          {activeStep === 1 && (
            <div className={styles.checkInfo}>
              <Info isCheckInfo />
            </div>
          )}
          {activeStep === 2 && <VersionEdit />}
          {activeStep === 3 && <AppDetail isCreate />}
          {activeStep === 4 && this.renderSuccessMesage()}
        </Stepper>
      );
    }

    return (
      <Layout
        className={styles.versionDetail}
        pageTitle={t('Version detail')}
        hasBack
      >
        {this.renderTopInfo()}
        <Grid>
          <Section size={8}>
            <Card>
              <DetailTabs tabs={tags} changeTab={this.changeTab} isCardTab />
              {detailTab === 'configFile' && this.renderFileConfig()}
              {detailTab === 'updateLog' && this.renderUpdateLog()}
            </Card>
          </Section>

          <Section>
            {this.renderLatestRecord()}
            {this.renderTestInstance()}
          </Section>
        </Grid>

        {dialogType === 'delete' && this.renderDeleteDialog()}
        {dialogType === 'submit' && this.renderNoteDialog()}
        {dialogType === 'cancel' && this.renderCancelDialog()}
        {dialogType === 'release' && this.renderReleaseDialog()}
      </Layout>
    );
  }
}
