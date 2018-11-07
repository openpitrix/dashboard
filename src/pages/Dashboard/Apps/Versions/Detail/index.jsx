import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Button, Popover } from 'components/Base';
import Layout, {
  Grid, Row, Section, Card, Dialog
} from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import CheckFiles from 'components/CheckFiles';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore
}))
@observer
export default class VersionDetail extends Component {
  async componentDidMount() {
    const { appVersionStore, match } = this.props;
    const { versionId } = match.params;

    await appVersionStore.fetch(versionId);
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
        description: '只有认证的服务商才可以将自己的应用上架到官方的商店进行售卖。',
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
      <Dialog title="提示" width={680} isOpen={isDialogOpen} onCancel={hideModal} noActions>
        <div className={styles.submitCheck}>
          <div className={styles.title}>
            {isDisabled ? '正在检查以下信息的完整性，请稍待…' : '检查的所有结果都成功'}
          </div>
          <ul>
            {checkList.map(check => (
              <li key={check.name} className={classnames([styles[check.status]])}>
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

  renderConfgFile() {
    const { appVersionStore, t } = this.props;
    const { version } = appVersionStore;
    const files = [
      { name: 'Chart.yaml', description: 'Yaml文件，用于描述 Chart 的基本信息，包括名称版本等' },
      { name: 'LICENSE', description: '文本格式的协议', isOptional: true },
      { name: 'README.md', description: '应用介绍、使用说明', isOptional: true },
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
      <div className={styles.confgFile}>
        <div className={styles.file}>
          <div className={styles.name}>{version.package_name}</div>
          <div className={styles.time}>
            更新时间：{version.status_time}
            <Link className={styles.link} to="#">
              测试
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
      </div>
    );
  }

  render() {
    const { appVersionStore, t } = this.props;
    const { version } = appVersionStore;

    const tags = ['配置文件', '定价', '更新日志', '审核记录'];

    return (
      <Layout className={styles.versionDetail} detailPage="版本详情">
        <Card>
          <div className={styles.topInfo}>
            <div className={styles.main}>
              <label>
                交付方式：<span className={styles.value}>业务</span>
              </label>
              <label>
                版本名称：<span className={styles.value}>{version.name}</span>
              </label>
            </div>
            <div className={styles.secondary}>
              <label>ID：{version.version_id}</label>
              <label>
                状态：<Status
                  name={version.status}
                  type={version.status}
                  className={styles.status}
                />
              </label>
              <label>更新时间：{version.status_time}</label>
            </div>
          </div>
          <div className={styles.operateBtns}>
            <Button type="primary" onClick={this.submitAudit}>
              提交审核
            </Button>
            <Popover className={styles.operation} content={this.renderHandleMenu()} showBorder>
              <Icon name="more" />
            </Popover>
          </div>
        </Card>

        <Row>
          <DetailTabs tabs={tags} />
          {this.renderConfgFile()}
        </Row>

        {this.renderSubmitCheck()}
      </Layout>
    );
  }
}
