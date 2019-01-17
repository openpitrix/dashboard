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
import { formatTime, mappingStatus } from 'utils';

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
  isv: 'App service provider review',
  business_admin: 'Platform business review',
  develop_admin: 'Platform technology review'
};
const reviewPassNote = {
  isv: 'ISV_PASS_NOTE',
  business_admin: 'BUSINESS_PASS_NOTE',
  develop_admin: 'TECHNICAL_PASS_NOTE'
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
        title={t('Why refuse this application?')}
        isOpen={isDialogOpen}
        onCancel={hideModal}
        onSubmit={() => this.handleReview('reject')}
        okText={t('Submit')}
      >
        <div className={styles.rejectMessage}>
          <textarea
            placeholder={t('Please write down the reasons for rejection')}
            onChange={changeReason}
            maxLength={500}
            value={reason}
          />
          <p className={styles.note}>{t('REJECT_REASON_NOTE')}</p>
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
        cancelText={t('Look again')}
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
          <label className={styles.status}>{t('Not yet started')}</label>
        </Card>
      );
    }

    // wait review
    if (reviewStatus[role].includes(status) && user.username !== role) {
      return (
        <Card className={styles.waitReview}>
          <span className={styles.name}> {t(reviewTitle[role])}</span>
          <label className={styles.status}>{t('Waiting for review')}</label>
        </Card>
      );
    }

    // review，pass, reject action
    if (reviewStatus[role].includes(status) && user.username === role) {
      return (
        <Card className={styles.pendingReview}>
          <div className={styles.name}>
            {t(reviewTitle[role])}
            <label className={styles.status}>{t('In-review')}</label>
          </div>
          <div className={styles.reviewInfo}>
            <dl>
              <dt>{t('Auditor')}:</dt>
              <dd>{this.renderOperator(record.operator)}</dd>
            </dl>
            <dl>
              <dt>{t('Start time')}:</dt>
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
              <dt>{t('Auditor')}:</dt>
              <dd>{this.renderOperator(record.operator)}</dd>
            </dl>
            <dl>
              <dt>{t('Start time')}:</dt>
              <dd>{formatTime(record.review_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
            </dl>
            <dl>
              <dt>{isReject ? t('Reject time') : t('Pass time')}:</dt>
              <dd>{formatTime(record.status_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
            </dl>
            {record.message && (
              <dl>
                <dt>{t('Reject reason')}:</dt>
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
          <div className={styles.title}>{t('Review progress')}</div>
          <Card className={styles.noData}>{t('No review record data')}</Card>
        </div>
      );
    }

    return (
      <div className={styles.versionReview}>
        <div className={styles.title}>{t('Review progress')}</div>
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
            <dt>{t('Audit type')}:</dt>
            <dd>{version.apply_type || t('Apply for shelf')}</dd>
          </dl>
          <dl>
            <dt>{t('Audit No')}:</dt>
            <dd>{version.version_id}</dd>
          </dl>
          <dl>
            <dt>{t('Current status')}:</dt>
            <dd>
              <Status
                type={version.status}
                name={mappingStatus(version.status)}
              />
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
      <div className={styles.configFile}>
        <div className={styles.fileInfo}>
          <div className={styles.name}>
            {`${appDetail.name} ${version.name}`}
          </div>
          <div className={styles.time}>
            {t('Upload time')}：{formatTime(
              version.status_time,
              'YYYY/MM/DD HH:mm:ss'
            )}
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
      </div>
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
          <dt>{t('Name')}</dt>
          <dd>{appDetail.name}</dd>
        </dl>
        <dl>
          <dt>{t('One-sentence introduction')}</dt>
          <dd>{appDetail.abstraction || t('None')}</dd>
        </dl>
        <dl>
          <dt>{t('Detail introduction')}</dt>
          <dd>
            <pre>{appDetail.description || t('None')}</pre>
          </dd>
        </dl>
        <dl>
          <dt>{t('Icon')}</dt>
          <dd className={styles.imageOuter}>
            <Image
              src={appDetail.icon}
              iconLetter={appDetail.name}
              iconSize={96}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('Screenshot of the interface')}</dt>
          <dd>{appDetail.screenshots || t('None')}</dd>
        </dl>
        <dl>
          <dt>{t('Category')}</dt>
          <dd>{categoryName || t('None')}</dd>
        </dl>
        <dl>
          <dt>{t('Service provider website')}</dt>
          <dd>
            <a href={appDetail.home} target="_blank" rel="noopener noreferrer">
              {appDetail.home}
            </a>
            {!appDetail.home && <span>{t('None')}</span>}
          </dd>
        </dl>
      </div>
    );
  }

  render() {
    const { appStore, t } = this.props;
    const { detailTab } = appStore;

    return (
      <Layout pageTitle={t('App review detail')} hasBack>
        <Grid>
          <Section size={8}>
            <Card className={styles.reviewTitle}>
              <div className={styles.name}>{t('Audit content')}</div>
              <div className={styles.note}>
                {t('AUDIT_CONTENT_INTRODUCE')}
                <a href="#" target="_blank">
                  {t('view detail standard')} →
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
