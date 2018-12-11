import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon, Button, Popover } from 'components/Base';
import Layout, {
  Grid, Row, Section, Card, Dialog
} from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import CheckFiles from 'components/CheckFiles';

import versionTypes from 'config/version-types';
import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  userStore: rootStore.userStore
}))
@observer
export default class VersionDetail extends Component {
  async componentDidMount() {
    const {
      appVersionStore, appStore, userStore, match
    } = this.props;
    const { versionId } = match.params;

    // query this version version detail
    await appVersionStore.fetch(versionId);

    // query this version submit record
    const { version } = appVersionStore;
    await appVersionStore.fetchAudits(version.app_id, versionId);

    // query record relative operators name
    const userIds = _.get(appVersionStore.audits, versionId, []).map(
      item => item.operator
    );
    await userStore.fetchAll({ user_id: userIds });
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  state = {
    checkList: [
      {
        name: '应用信息',
        description: '应用的描述、截图、分类等在商店中展示的重要信息。',
        status: ''
      },
      { name: '版本信息', description: '应用版本名称、更新日志。', status: '' },
      { name: '版本定价', description: '完整的定价方案。', status: '' },
      {
        name: '服务商认证',
        description:
          '只有认证的服务商才可以将自己的应用上架到官方的商店进行售卖。',
        status: ''
      },
      {
        name: '服务商合约',
        description: '同时服务商需要与平台签署服务合约与协议。',
        status: ''
      }
    ]
  };

  submitAudit = () => {
    const { appVersionStore } = this.props;
    appVersionStore.isDialogOpen = true;
    const { checkList } = this.state;

    // simulation info check process
    for (let i = 0; i < checkList.length; i++) {
      checkList[i].status = '';
      setTimeout(() => {
        checkList[i].status = 'start';
        this.setState({ checkList });
      }, i * 800);
      setTimeout(() => {
        checkList[i].status = 'success';
        this.setState({ checkList });
      }, i * 800 + 500);
    }
  };

  toggleReason(record) {
    record.isExpand = !record.isExpand;
  }

  renderHandleMenu() {
    const { t } = this.props;

    return (
      <div className="operate-menu">
        <span>{t('Delete')}</span>
      </div>
    );
  }

  renderSubmitCheck() {
    const { appVersionStore, t } = this.props;
    const { isDialogOpen, hideModal } = appVersionStore;
    const { checkList } = this.state;
    const isDisabled = checkList.filter(item => item.status !== 'success').length !== 0;

    return (
      <Dialog
        title="提示"
        width={680}
        isOpen={isDialogOpen}
        onCancel={hideModal}
        noActions
      >
        <div className={styles.submitCheck}>
          <div className={styles.title}>
            {isDisabled
              ? '正在检查以下信息的完整性，请稍待…'
              : '检查的所有结果都成功'}
          </div>
          <ul>
            {checkList.map(check => (
              <li
                key={check.name}
                className={classnames([styles[check.status]])}
              >
                <span className={styles.status} />
                <span className={styles.name}>{check.name}</span>
                <span className={styles.description}>{check.description}</span>
              </li>
            ))}
          </ul>
          <div className={styles.operateBtns}>
            <Button type="primary" disabled={isDisabled}>
              预览应用
            </Button>
            <Button onClick={hideModal}>稍后再说</Button>
          </div>
        </div>
      </Dialog>
    );
  }

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
            {record.message}
            <br />
            <div
              onClick={() => this.toggleReason(record)}
              className={styles.expand}
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
    return (
      <Card className={styles.testInstance}>
        <div className={styles.title}>测试实例</div>
        <div className={styles.note}>此版本没有部署测试实例</div>
      </Card>
    );
  }

  renderRecentRecord() {
    const { appVersionStore, userStore, t } = this.props;
    const { users } = userStore;
    const { version, audits } = appVersionStore;
    const audit = _.get(audits[version.version_id], '[0]', {});

    return (
      <Card className={styles.recentRecord}>
        <div className={styles.title}>最新记录</div>
        <Status
          type={audit.status}
          name={audit.status}
          className={styles.status}
        />
        <div className={styles.record}>
          <div className={styles.operator}>
            {t(audit.role)}:&nbsp;{
              (_.find(users, { user_id: audit.operator }) || {}).username
            }
          </div>
          {this.renderReason(audit)}
          <div className={styles.time}>{audit.status_time}</div>
        </div>
        <div className={styles.link}>
          <Link to={`/dashboard/app/audits/${version.app_id}`}>
            {t('查看全部记录')} →
          </Link>
        </div>
      </Card>
    );
  }

  renderUpdateLog() {}

  renderConfigFile() {
    const { appVersionStore, t } = this.props;
    const { version } = appVersionStore;
    const files = [
      {
        name: 'Chart.yaml',
        description: 'Yaml文件，用于描述 Chart 的基本信息，包括名称版本等'
      },
      { name: 'LICENSE', description: '文本格式的协议', isOptional: true },
      {
        name: 'README.md',
        description: '应用介绍、使用说明',
        isOptional: true
      },
      {
        name: 'requirements.yaml',
        description: '用于存放当前 Chart 依赖的其它 Chart 的说明文件',
        isOptional: true
      },
      { name: 'values.yaml', description: 'Chart 的默认值配置文件' },
      {
        name: 'charts/',
        description: '该目录中放置当前 Chart 依赖的其它 Chart',
        isOptional: true,
        check: 'none'
      },
      {
        name: 'templates/',
        description:
          '部署文件模版目录，模版填入 values.yaml 中相应值，生成最终的 kubernetes 配置文件',
        isOptional: true,
        check: 'none'
      },
      { name: 'templates/NOTES.txt', description: '使用指南', isOptional: true }
    ];

    return (
      <Card className={styles.configFile}>
        <div className={styles.fileInfo}>
          <div className={styles.name}>{version.package_name}</div>
          <div className={styles.time}>
            {t('上传时间')}：{version.status_time}
            <Link className={styles.link} to="#">
              {t('部署测试')}
            </Link>
            <span className={styles.link}>删除</span>
          </div>
        </div>
        {<CheckFiles files={files} />}
        <div className={styles.document}>
          <span className={styles.note}>提示</span>
          完整的应用开发规范请参看
          <Link to="#">《VM 规范及应用开发》</Link>。
        </div>
      </Card>
    );
  }

  renderTopInfo() {
    const { appVersionStore, t } = this.props;
    const { version } = appVersionStore;

    return (
      <Card>
        <div className={styles.topInfo}>
          <div className={styles.main}>
            {(_.find(versionTypes, { value: version.type }) || {}).name}
            <label>/</label>
            {version.name}
          </div>
          <div className={styles.secondary}>
            <label>所属应用：</label>
            <label>版本ID：{version.version_id}</label>
            <label>更新时间：{version.status_time}</label>
          </div>
        </div>
        <div className={styles.operateBtns}>
          <Button type="primary" onClick={this.submitAudit}>
            提交审核
          </Button>
          <Popover
            className={styles.operation}
            content={this.renderHandleMenu()}
            showBorder
          >
            <Icon name="more" />
          </Popover>
        </div>
      </Card>
    );
  }

  render() {
    const { appVersionStore, appStore, t } = this.props;
    const { version } = appVersionStore;
    const { detailTab } = appStore;

    const tags = ['配置文件', '定价', '更新日志'];

    return (
      <Layout className={styles.versionDetail} pageTitle="版本详情" hasBack>
        {this.renderTopInfo()}

        <Grid>
          <Section size={8}>
            <DetailTabs tabs={tags} />
            {(detailTab === 'fileConfig' || detailTab === 'Information')
              && this.renderConfigFile()}
            {detailTab === 'updateLog' && this.renderUpdateLog()}
          </Section>

          <Section>
            {this.renderRecentRecord()}
            {this.renderTestInstance()}
          </Section>
        </Grid>

        {this.renderSubmitCheck()}
      </Layout>
    );
  }
}
