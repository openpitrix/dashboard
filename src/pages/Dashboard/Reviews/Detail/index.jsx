import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import _ from 'lodash';
import classnames from 'classnames';

import { Image, Button } from 'components/Base';
import Layout, {
  Grid, Section, Card, Dialog
} from 'components/Layout';
import Status from 'components/Status';
import AppName from 'components/AppName';
import DetailTabs from 'components/DetailTabs';
import CheckFiles from 'components/CheckFiles';
import { formatTime } from 'utils';

import styles from './index.scss';

const tabs = [
  { name: 'Base Info', value: 'baseInfo' },
  { name: 'Instructions', value: 'readme' },
  { name: 'Terms of service', value: 'service' },
  { name: 'Config File', value: 'configFile' },
  { name: 'Set Price', value: 'price', disabled: true },
  { name: 'Update Log', value: 'updateLog' }
];
const reviewStatus = {
  isv: ['submitted', 'isv-in-review'],
  business_admin: ['isv-passed', 'business-in-review'],
  develop_admin: ['business-passed', 'dev-in-review']
};
const rejectStatus = {
  isv: 'isv-rejected',
  business_admin: 'business-rejected',
  develop_admin: 'dev-rejected'
};
const reviewTitle = {
  isv: '应用服务商审核',
  business_admin: '平台商务审核',
  develop_admin: '平台技术审核'
};
const reviewPassNote = {
  isv: '通过之后，此申请将提交到平台进行商务和技术审核。',
  business_admin: '通过之后，此申请将提交到平台进行技术审核。',
  develop_admin: '通过之后，应用开发者可以将此版本发布到应用商店。'
};

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  userStore: rootStore.userStore,
  user: rootStore.user
}))
@observer
export default class ReviewDetail extends Component {
  async componentDidMount() {
    const { appStore, appVersionStore, match } = this.props;
    const { reviewId } = match.params;

    await appVersionStore.fetchReviewDetail(reviewId);

    const { reviewDetail } = appVersionStore;
    await appStore.fetch(reviewDetail.app_id);
    await appVersionStore.fetch(reviewDetail.version_id);
  }

  changeTab = tab => {
    const { appStore } = this.props;
    appStore.detailTab = tab;
  };

  handleReview = async handleType => {
    const { appVersionStore, user } = this.props;
    const { version, reviewDetail } = appVersionStore;
    const isReviewed = reviewDetail.status.indexOf('in-review') > -1;

    if (handleType === 'review' && isReviewed) {
      appVersionStore.isTipsOpen = true;
    } else {
      // todo: after username should modify role
      await appVersionStore.versionReview(
        handleType,
        version.version_id,
        user.username
      );
    }
  };

  showReasonDialog = () => {
    const { appVersionStore } = this.props;
    appVersionStore.reason = '';
    appVersionStore.isDialogOpen = true;
  };

  renderReasonDialog = () => {
    const { appVersionStore, t } = this.props;
    const {
      isDialogOpen, hideModal, changeReason, reason
    } = appVersionStore;

    return (
      <Dialog
        title={t('为什么拒绝此申请？')}
        isOpen={isDialogOpen}
        onCancel={hideModal}
        onSubmit={() => this.handleReview('reject')}
        okText={t('Submit')}
      >
        <div className={styles.rejectMessage}>
          <textarea
            placeholder={t('请写下拒绝原因')}
            onChange={changeReason}
            maxLength={500}
            value={reason}
          />
          <p className={styles.note}>
            {t('以上原因将会以邮件的形式发送给申请者，请仔细填写。')}
          </p>
        </div>
      </Dialog>
    );
  };

  renderReviewNoteDialog = () => {
    const { appVersionStore, user, t } = this.props;
    const { isTipsOpen, hideModal } = appVersionStore;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isTipsOpen}
        onCancel={hideModal}
        onSubmit={() => this.handleReview('pass')}
        okText={t('Pass')}
        cancelText={t('再看看')}
      >
        {t(reviewPassNote[user.username])}
      </Dialog>
    );
  };

  renderOperator(operatorId) {
    const { userStore, user } = this.props;
    const { users } = userStore;
    const operator = _.find(users, { user_id: operatorId }) || user;

    return (
      <div className={styles.operator}>
        <label className={styles.name}>{operator.username}</label>&nbsp;
        {operator.email}
      </div>
    );
  }

  renderReviewCard(role) {
    const { appVersionStore, user, t } = this.props;
    const { reviewDetail } = appVersionStore;
    const { status, phase } = reviewDetail;
    const phaseKeys = _.keys(phase);
    const record = _.get(reviewDetail, `phase.${role}`, {});

    // not start
    if (!phaseKeys.includes(role) && !reviewStatus[role].includes(status)) {
      return (
        <Card className={styles.unReview}>
          <span className={styles.name}> {t(reviewTitle[role])}</span>
          <label className={styles.status}>{t('尚未开始')}</label>
        </Card>
      );
    }

    // wait review
    if (reviewStatus[role].includes(status) && user.username !== role) {
      return (
        <Card className={styles.waitReview}>
          <span className={styles.name}> {t(reviewTitle[role])}</span>
          <label className={styles.status}>{t('等待审核')}</label>
        </Card>
      );
    }

    // review，pass, reject action
    if (reviewStatus[role].includes(status) && user.username === role) {
      return (
        <Card className={styles.pendingReview}>
          <div className={styles.name}>
            {t(reviewTitle[role])}
            <label className={styles.status}>{t('审核中')}</label>
          </div>
          <div className={styles.reviewInfo}>
            <dl>
              <dt>{t('审核人员')}:</dt>
              <dd>{this.renderOperator(record.operator)}</dd>
            </dl>
            <dl>
              <dt>{t('开始时间')}:</dt>
              <dd>{formatTime(record.review_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
            </dl>
          </div>
          <div className={styles.opreateButtons}>
            {user.username === 'develop_admin' && (
              <Link to={`/dashboard/apps/${reviewDetail.app_id}/deploy`}>
                <Button>{t('Deploy Test')}</Button>
              </Link>
            )}
            <Button type="primary" onClick={() => this.handleReview('review')}>
              {t('Pass')}
            </Button>
            <Button type="delete" onClick={this.showReasonDialog}>
              {t('Reject')}
            </Button>
          </div>
        </Card>
      );
    }

    // passed, rejectd
    if (phaseKeys.includes(role) && !reviewStatus[role].includes(status)) {
      const isReject = status === rejectStatus[role];

      return (
        <Card
          className={classnames(styles.passed, { [styles.rejectd]: isReject })}
        >
          <div className={styles.name}>
            {t(reviewTitle[role])}
            <label className={styles.status}>
              {isReject ? t('Rejected') : t('Passed')}
            </label>
          </div>
          <div className={styles.reviewInfo}>
            <dl>
              <dt>{t('审核人员')}:</dt>
              <dd>{this.renderOperator(record.operator)}</dd>
            </dl>
            <dl>
              <dt>{t('开始时间')}:</dt>
              <dd>{formatTime(record.review_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
            </dl>
            <dl>
              <dt>{isReject ? t('拒绝时间') : t('通过时间')}:</dt>
              <dd>{formatTime(record.status_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
            </dl>
            {record.message && (
              <dl>
                <dt>{t('拒绝原因')}:</dt>
                <dd>
                  <pre>{record.message}</pre>
                </dd>
              </dl>
            )}
          </div>
        </Card>
      );
    }
  }

  renderVersionReview() {
    const { appVersionStore, t } = this.props;
    const { reviewDetail } = appVersionStore;
    const { phase } = reviewDetail;
    const reviewRoles = _.keys(reviewStatus);

    if (!reviewDetail.version_id) {
      return (
        <div className={styles.versionReview}>
          <div className={styles.title}>{t('审核进度')}</div>
          <Card className={styles.noData}>{t('暂无审核记录数据')}</Card>
        </div>
      );
    }

    return (
      <div className={styles.versionReview}>
        <div className={styles.title}>{t('审核进度')}</div>
        <Card className={styles.submit}>
          <span className={styles.name}>{t('Submit')}</span>
          <label className={styles.time}>
            {formatTime(
              _.get(phase, 'developer.review_time'),
              'YYYY/MM/DD HH:mm:ss'
            )}
          </label>
        </Card>

        {reviewDetail.status
          && reviewRoles.map(role => (
            <div key={role}>{this.renderReviewCard(role)}</div>
          ))}
      </div>
    );
  }

  renderReviewBase() {
    const { appStore, appVersionStore, t } = this.props;
    const { appDetail } = appStore;
    const { version } = appVersionStore;

    return (
      <Card className={styles.reviewInfo}>
        <AppName
          icon={appDetail.icon}
          name={appDetail.name}
          type={version.type}
          versionName={version.name}
        />
        <div className={styles.info}>
          <dl>
            <dt>{t('审核类型')}:</dt>
            <dd>{version.apply_type || t('上架申请')}</dd>
          </dl>
          <dl>
            <dt>{t('审核编号')}:</dt>
            <dd>{version.version_id}</dd>
          </dl>
          <dl>
            <dt>{t('当前状态')}:</dt>
            <dd>
              <Status type={version.status} name={version.status} />
            </dd>
          </dl>
        </div>
      </Card>
    );
  }

  renderUpdateLog() {
    const { appVersionStore, t } = this.props;
    const { description } = appVersionStore.version;

    return <pre className={styles.updateLog}>{description || t('None')}</pre>;
  }

  renderConfigFile() {
    const { appVersionStore, appStore, t } = this.props;
    const { appDetail } = appStore;
    const { version } = appVersionStore;

    return (
      <Card className={styles.configFile}>
        <div className={styles.fileInfo}>
          <div className={styles.name}>
            {`${appDetail.name} ${version.name}`}
          </div>
          <div className={styles.time}>
            {t('Upload time')}：{version.status_time}
            <Link
              className={styles.link}
              to={`/dashboard/app/${appDetail.app_id}/deploy/${
                version.version_id
              }`}
            >
              {t('Deploy App')}
            </Link>
          </div>
        </div>
        <CheckFiles
          className={styles.checkFile}
          type={version.type}
          isShowNote
        />
      </Card>
    );
  }

  renderService() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    return (
      <div className="markdown">
        <ReactMarkdown source={appDetail.tos || t('None')} />
      </div>
    );
  }

  renderReadme() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    return (
      <div className="markdown">
        <ReactMarkdown source={appDetail.readme || t('None')} />
      </div>
    );
  }

  renderBaseInfo() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;
    const categoryName = _.get(appDetail, 'category_set.name', '');

    return (
      <div className={styles.baseInfo}>
        <dl>
          <dt>{t('名称')}</dt>
          <dd>{appDetail.name}</dd>
        </dl>
        <dl>
          <dt>{t('一句话介绍')}</dt>
          <dd>{appDetail.abstraction}</dd>
        </dl>
        <dl>
          <dt>{t('详细介绍')}</dt>
          <dd>
            <pre>{appDetail.description}</pre>
          </dd>
        </dl>
        <dl>
          <dt>{t('图标')}</dt>
          <dd className={styles.imageOuter}>
            <Image
              src={appDetail.icon}
              iconLetter={appDetail.name}
              iconSize={96}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('页面截图')}</dt>
          <dd>{appDetail.screenshots}</dd>
        </dl>
        <dl>
          <dt>{t('分类')}</dt>
          <dd>{categoryName}</dd>
        </dl>
        <dl>
          <dt>{t('服务商网站')}</dt>
          <dd>
            <a href={appDetail.home} target="_blank" rel="noopener noreferrer">
              {appDetail.home}
            </a>
          </dd>
        </dl>
      </div>
    );
  }

  render() {
    const { appStore, t } = this.props;
    const { detailTab } = appStore;

    return (
      <Layout pageTitle={t('应用审核详情')} hasBack>
        <Grid>
          <Section size={8}>
            <Card className={styles.reviewTitle}>
              <div className={styles.name}>{t('审核内容')}</div>
              <div className={styles.note}>
                {t(
                  '以下信息必须真实准确，关键的操作说明需要描述详情，对于条款中的权利与义务需要描述清晰，'
                )}
                <a href="#" target="_blank">
                  {t('查看详细标准')} →
                </a>
              </div>
            </Card>

            <DetailTabs tabs={tabs} changeTab={this.changeTab} />
            <Card>
              {detailTab === 'baseInfo' && this.renderBaseInfo()}
              {detailTab === 'readme' && this.renderReadme()}
              {detailTab === 'service' && this.renderService()}
              {detailTab === 'configFile' && this.renderConfigFile()}
              {detailTab === 'updateLog' && this.renderUpdateLog()}
            </Card>
          </Section>

          <Section size={4}>
            {this.renderReviewBase()}
            {this.renderVersionReview()}
          </Section>
        </Grid>

        {this.renderReasonDialog()}
        {this.renderReviewNoteDialog()}
      </Layout>
    );
  }
}
