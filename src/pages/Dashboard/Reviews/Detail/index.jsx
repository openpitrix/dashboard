import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import _ from 'lodash';
import classnames from 'classnames';

import {
  Button, Icon, Image, PopoverIcon
} from 'components/Base';
import Layout, {
  Card, Dialog, Grid, Section
} from 'components/Layout';
import Status from 'components/Status';
import AppName from 'components/AppName';
import DetailTabs from 'components/DetailTabs';
import CheckFiles from 'components/CheckFiles';
import TdUser from 'components/TdUser';
import Screenshots from 'pages/AppDetail/Screenshots';
import { formatTime, mappingStatus } from 'utils';
import routes, { toRoute } from 'routes';
import {
  getReviewType,
  rejectStatus,
  reviewPassNote,
  reviewStatus,
  reviewTitle
} from 'config/version';

import styles from './index.scss';

const tabs = [
  { name: 'Base Info', value: 'baseInfo' },
  { name: 'Instructions', value: 'readme' },
  { name: 'Terms of service', value: 'service', disabled: true },
  { name: 'Config File', value: 'configFile' },
  { name: 'Set Price', value: 'price', disabled: true },
  { name: 'Update Log', value: 'updateLog' }
];

@withTranslation()
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

    await appVersionStore.setReviewTypes();

    await appVersionStore.fetchReviewDetail(reviewId);
    const { reviewDetail } = appVersionStore;
    await appVersionStore.fetch(reviewDetail.version_id);
    await appStore.fetch(reviewDetail.app_id);
  }

  changeTab = tab => {
    const { appStore } = this.props;
    appStore.detailTab = tab;
  };

  handleReview = async handleType => {
    const { appVersionStore } = this.props;
    const { reviewDetail } = appVersionStore;
    const { status, version_id } = reviewDetail;
    const isReviewed = status.indexOf('in-review') > -1;

    if (handleType === 'review' && isReviewed) {
      appVersionStore.isTipsOpen = true;
    } else {
      await appVersionStore.versionReview({
        handleType,
        versionId: version_id,
        currentStatus: status
      });
    }
  };

  showReasonDialog = () => {
    const { appVersionStore } = this.props;
    appVersionStore.reason = '';
    appVersionStore.isDialogOpen = true;
  };

  renderHandleMenu = pkgName => {
    const { appVersionStore, t } = this.props;
    const { reviewDetail, downloadPackage } = appVersionStore;

    return (
      <div className="operate-menu">
        <Link
          to={toRoute(routes.portal.versionFiles, {
            appId: reviewDetail.app_id,
            versionId: reviewDetail.version_id
          })}
        >
          <Icon name="eye" type="dark" /> {t('View version package')}
        </Link>
        <Link
          to={toRoute(routes.portal.deploy, {
            appId: reviewDetail.app_id,
            versionId: reviewDetail.version_id
          })}
        >
          <Icon name="stateful-set" type="dark" />
          {t('Deploy Test')}
        </Link>
        <span onClick={() => downloadPackage(reviewDetail.version_id, pkgName)}>
          <Icon name="download" type="dark" />
          {t('Download')}
        </span>
      </div>
    );
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
    const { appVersionStore, t } = this.props;
    const { reviewDetail, isTipsOpen, hideModal } = appVersionStore;

    return (
      <Dialog
        title={t('Note')}
        isOpen={isTipsOpen}
        onCancel={hideModal}
        onSubmit={() => this.handleReview('pass')}
        okText={t('Pass')}
        cancelText={t('Look again')}
      >
        {t(reviewPassNote[getReviewType(reviewDetail.status)])}
      </Dialog>
    );
  };

  renderReviewCard(type) {
    const { appVersionStore, userStore, t } = this.props;
    const { users } = userStore;
    const { reviewDetail, reveiwTypes } = appVersionStore;
    const { status, phase } = reviewDetail;
    const phaseKeys = _.keys(phase);
    const record = _.get(reviewDetail, `phase.${type}`, {});

    const hasOperateAuth = reveiwTypes.includes(type);
    const activeCard = reviewStatus[type].includes(status);
    const hasCompleted = phaseKeys.includes(type);

    // not start
    if (!activeCard && !hasCompleted) {
      return (
        <Card className={styles.unReview}>
          <span className={styles.name}> {t(reviewTitle[type])}</span>
          <label className={styles.status}>{t('Not yet started')}</label>
        </Card>
      );
    }

    // wait review
    if (activeCard && !hasOperateAuth) {
      return (
        <Card className={styles.waitReview}>
          <span className={styles.name}> {t(reviewTitle[type])}</span>
          <label className={styles.status}>{t('Waiting for review')}</label>
        </Card>
      );
    }

    // review，pass, reject action
    if (activeCard && hasOperateAuth) {
      return (
        <Card className={styles.pendingReview}>
          <div className={styles.name}>
            {t(reviewTitle[type])}
            <label className={styles.status}>{t('In-review')}</label>
          </div>
          <div className={styles.reviewInfo}>
            <dl>
              <dt>{t('Auditor')}:</dt>
              <dd>
                <TdUser userId={record.operator} users={users} />
              </dd>
            </dl>
            <dl>
              <dt>{t('Start time')}:</dt>
              <dd>{formatTime(record.review_time, 'YYYY/MM/DD HH:mm:ss')}</dd>
            </dl>
          </div>
          <div className={styles.opreateButtons}>
            {!reviewStatus.business.includes(status) && (
              <Link
                to={toRoute(routes.portal.deploy, {
                  appId: reviewDetail.app_id,
                  versionId: reviewDetail.version_id
                })}
              >
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
    if (!activeCard && hasCompleted) {
      const isReject = status === rejectStatus[type];

      return (
        <Card
          className={classnames(styles.passed, { [styles.rejectd]: isReject })}
        >
          <div className={styles.name}>
            {t(reviewTitle[type])}
            <label className={styles.status}>
              {isReject ? t('Rejected') : t('Passed')}
            </label>
          </div>
          <div className={styles.reviewInfo}>
            <dl>
              <dt>{t('Auditor')}:</dt>
              <dd>
                <TdUser userId={record.operator} users={users} />
              </dd>
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
        <div className={styles.progressLine}>
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
            && reviewRoles.map(type => (
              <div key={type}>{this.renderReviewCard(type)}</div>
            ))}
        </div>
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
    const pkgName = version.packageName || `${appDetail.name}-${version.name}`;

    return (
      <div className={styles.configFile}>
        <div className={styles.fileInfo}>
          <div className={styles.name}>{pkgName}</div>
          <div className={styles.time}>
            {t('Upload time')}：
            {formatTime(version.status_time, 'YYYY/MM/DD HH:mm:ss')}
            <PopoverIcon
              className={styles.operation}
              content={this.renderHandleMenu(pkgName)}
            />
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
    const { appDetail, currentPic, changePicture } = appStore;

    const { screenshots } = appDetail;
    let pictrues = [];
    try {
      pictrues = JSON.parse(screenshots) || [];
    } catch (err) {
      pictrues = screenshots ? screenshots.split(',') : [];
    }

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
          <dd>
            <Screenshots
              app={appDetail}
              currentPic={currentPic}
              changePicture={changePicture}
              pictures={pictrues}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('Category')}</dt>
          <dd>
            {_.get(appDetail, 'category_set', ['None'])
              .filter(cate => cate.category_id && cate.status === 'enabled')
              .map(cate => (
                <label
                  className={styles.category}
                  key={cate.category_id}
                  to={`/?cate=${cate.category_id}`}
                >
                  {t(cate.name)}
                </label>
              ))}
          </dd>
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
    const { appStore, appVersionStore, t } = this.props;
    const { detailTab } = appStore;
    const { isLoading } = appVersionStore;

    return (
      <Layout isLoading={isLoading} pageTitle={t('App review detail')} hasBack>
        <Grid>
          <Section size={8}>
            <Card>
              <div className={styles.reviewTitle}>
                <div className={styles.name}>{t('Audit content')}</div>
                <div className={styles.note}>
                  {t('AUDIT_CONTENT_INTRODUCE')}
                  {/* <a href="#" target="_blank">
                    {t('view detail standard')} →
                  </a> */}
                </div>
              </div>
              <DetailTabs tabs={tabs} changeTab={this.changeTab} isCardTab />
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
