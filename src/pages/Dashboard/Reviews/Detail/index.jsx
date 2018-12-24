import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import _ from 'lodash';

import { Image, Button } from 'components/Base';
import Layout, {
  Grid, Section, Card, Dialog
} from 'components/Layout';
import Status from 'components/Status';
import AppName from 'components/AppName';
import DetailTabs from 'components/DetailTabs';
import CheckFiles from 'components/CheckFiles';

import styles from './index.scss';

const tabs = [
  { name: 'Base Info', value: 'baseInfo' },
  { name: 'Instructions', value: 'readme' },
  { name: 'Terms of service', value: 'service' },
  { name: 'Config File', value: 'configFile' },
  { name: 'Set Price', value: 'price', isDisabled: true },
  { name: 'Update Log', value: 'updateLog' }
];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  user: rootStore.user
}))
@observer
export default class ReviewDetail extends Component {
  async componentDidMount() {
    const { appStore, appVersionStore, match } = this.props;
    const { appId, versionId } = match.params;

    await appStore.fetch(appId);
    await appVersionStore.fetch(versionId);
    await appVersionStore.fetchReviewDetail(appId, versionId);
  }

  changeTab = tab => {
    const { appStore } = this.props;
    appStore.detailTab = tab;
  };

  handleVersion = async (handleType, versionId) => {
    const { appVersionStore } = this.props;

    await appVersionStore.handle(handleType, versionId);
  };

  showReasonDialog = () => {
    const { appVersionStore } = this.props;
    appVersionStore.reason = '';
    appVersionStore.isDialogOpen = true;
  };

  submitReason = async () => {
    const { appVersionStore, t } = this.props;
    const { handle, version, reason } = appVersionStore;

    if (!reason) {
      appVersionStore.error(t('Please input reject Reason'));
    } else {
      await handle('reject', version.version_id);
    }
  };

  renderReasonDialog = () => {
    const { appVersionStore, t } = this.props;
    const {
      isDialogOpen, hideModal, changeReason, reason
    } = appVersionStore;

    return (
      <Dialog
        title={t('Reject reason')}
        isOpen={isDialogOpen}
        onCancel={hideModal}
        onSubmit={this.submitReason}
      >
        <textarea
          className={styles.reason}
          onChange={changeReason}
          maxLength={500}
        >
          {reason}
        </textarea>
      </Dialog>
    );
  };

  renderVersionReview() {
    const { appVersionStore, t } = this.props;
    const { version, reviewDetail } = appVersionStore;
    const { phase } = reviewDetail;
    const phaseKeys = _.keys(phase);

    return (
      <div className={styles.versionReview}>
        <div className={styles.title}>{t('审核进度')}</div>
        <Card className={styles.submit}>
          {t('Submit')}
          <label className={styles.time}>2018年10月19日 23:32:22</label>
        </Card>

        {phaseKeys.map(key => (
          <Card key={key} className={styles.pending}>
            <div className={styles.name}>
              {t(' 应用服务商审核')}
              <label className={styles.passed}>{t('已通过')}</label>
            </div>
            <div className={styles.reviewInfo}>
              <dl>
                <dt>{t('审核人员')}:</dt>
                <dd>{phase[key]['operator']}</dd>
              </dl>
              <dl>
                <dt>{t('开始时间')}:</dt>
                <dd>{phase[key]['review_time']}</dd>
              </dl>
              <dl>
                <dt>{t('通过时间')}:</dt>
                <dd>{phase[key]['status_time']}</dd>
              </dl>
              <dl>
                <dt>{t('审核评论')}:</dt>
                <dd>{phase[key]['message'] || t('Passed')}</dd>
              </dl>
            </div>
          </Card>
        ))}

        <Card className={styles.pending}>
          <div className={styles.name}>
            {t(' 平台商务审核')}
            <label className={styles.status}>{t('审核中')}</label>
          </div>
          <div className={styles.reviewInfo}>
            <dl>
              <dt>{t('审核人员')}:</dt>
              <dd>Grace grace@yunify.com</dd>
            </dl>
            <dl>
              <dt>{t('开始时间')}:</dt>
              <dd>2018年10月19日 23:32:22</dd>
            </dl>
          </div>
          <div className={styles.opreateButtons}>
            <Button
              type="primary"
              onClick={() => this.handleVersion('pass', version.version_id)}
            >
              {t('Pass')}
            </Button>
            <Button type="delete" onClick={this.showReasonDialog}>
              {t('Reject')}
            </Button>
          </div>
        </Card>
        <Card className={styles.unreviewed}>
          {t('平台技术审核')}
          <label className={styles.status}>{t('尚未开始')}</label>
        </Card>
      </div>
    );
  }

  renderReviewBase() {
    const { appStore, appVersionStore, t } = this.props;
    const { appDetail } = appStore;
    const { version, reviewDetail } = appVersionStore;

    return (
      <Card className={styles.reviewInfo}>
        <AppName
          image={appDetail.icon}
          name={appDetail.name}
          type={version.type}
          versionName={version.name}
        />
        <div className={styles.info}>
          <dl>
            <dt>{t('审核类型')}:</dt>
            <dd>{t('上架申请')}</dd>
          </dl>
          <dl>
            <dt>{t('审核编号')}:</dt>
            <dd>{version.version_id}</dd>
          </dl>
          <dl>
            <dt>{t('当前状态')}:</dt>
            <dd>
              <Status type={reviewDetail.status} name={reviewDetail.status} />
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
          <dd>
            <Image
              src={appDetail.icon}
              iconSize={96}
              iconLetter={appStore.name}
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
      </Layout>
    );
  }
}
