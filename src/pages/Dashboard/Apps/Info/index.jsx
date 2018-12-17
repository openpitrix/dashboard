import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import {
  Input, Select, Icon, Button, Upload
} from 'components/Base';
import Layout, { Card } from 'components/Layout';
import DetailTabs from 'components/DetailTabs';

import styles from './index.scss';

const actionName = {
  draft: 'submit',
  submitted: 'cancel',
  passed: 'release',
  rejected: 'submit'
};
const tags = ['Base Info', 'Instructions', 'Terms of service'];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore
}))
@observer
export default class Info extends Component {
  async componentDidMount() {
    const { appVersionStore, match } = this.props;
    const { appId } = match.params;

    // query this version relatived app info
    await appVersionStore.fetchAll({ app_id: appId });
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

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

  resetBaseInfo = () => {
    const { appVersionStore } = this.props;
  };

  renderScreenshot(isEdit) {
    const { t } = this.props;

    return (
      <div className={styles.screenshot}>
        <ul className={styles.pictrues}>
          <li />
        </ul>
        <div className={styles.words}>
          0/6 张截图
          <Upload className={styles.selectFile}>{t('选择文件')}</Upload>
          <label className={styles.deleteAll}>{t('删除全部')}</label>
        </div>
      </div>
    );
  }

  renderMakdownNote = () => {
    const { t } = this.props;

    return (
      <div className={styles.markdownNote}>
        {t('以下内容编辑支持')}
        <a href="http://markdownpad.com/" target="blank">
          Markdown
        </a>
        {t('语法')}
        <div className={styles.buttons}>
          <Button type="primary">{t('Save')}</Button>
          <Button>
            <Icon name="eye" size={20} type="dark" />
            {t('preview')}
          </Button>
        </div>
      </div>
    );
  };

  renderService(isEdit) {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    if (!isEdit) {
      return <ReactMarkdown source={appDetail.services} />;
    }

    return (
      <div className={styles.textareaOuter}>
        {this.renderMakdownNote()}
        <textarea
          className="textarea"
          placeholder={t('开始编写应用的服务条款')}
        />
      </div>
    );
  }

  renderInstructions(isEdit) {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;

    if (!isEdit) {
      return <ReactMarkdown source={appDetail.instructions} />;
    }

    return (
      <div className={styles.textareaOuter}>
        {this.renderMakdownNote()}
        <textarea
          className="textarea"
          placeholder={t('开始编写应用的使用说明')}
        />
      </div>
    );
  }

  renderBaseInfo() {
    const { appStore, t } = this.props;

    return (
      <form className={styles.createForm}>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('Name')}</label>
            <p className={styles.noteWord}>{t('应用的重要标识')}</p>
          </div>
          <Input name="name" maxLength="30" />
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('一句话介绍')}</label>
            <p className={styles.noteWord}>{t('对应用的概括性介绍')}</p>
          </div>
          <Input name="name" maxLength="100" />
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('详细介绍')}</label>
            <p className={styles.noteWord}>
              {t('在用户搜索应用时会非常有帮助')}
            </p>
          </div>
          <textarea name="name" maxLength="30" />
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('图标')}</label>
            <p className={styles.noteWord}>
              {t('格式: png/svg背景透明最佳')} <br />
              {t('图形大小：')}96px*96*px
            </p>
          </div>
          <Upload className={styles.selectIcon}>{t('Select file')}</Upload>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('界面截图')}</label>
            <p className={styles.noteWord}>
              {t('格式')} : png/jpg <br />
              {t('文件大小：不超过 2MB')}
              <br />
              {t('最少3张，最多6张')}
            </p>
          </div>
          {this.renderScreenshot()}
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('分类')}</label>
            <p className={styles.noteWord}>
              {t('选择适合的应用分类，便于用户更快发现你的应用')}
            </p>
          </div>
          <Select>
            <Select.Option>分类1</Select.Option>
          </Select>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('服务商网站')}</label>
            <p className={styles.noteWord}>{t('服务商的官方网站地址')}</p>
          </div>
          <Input className={styles.input} name="name" maxLength="100" />
        </div>
        <div className={styles.operateBtns}>
          <Button type="primary">{t('Save')}</Button>
          <Button onClick={this.resetBaseInfo}>{t('Reset')}</Button>
        </div>
      </form>
    );
  }

  render() {
    const { appStore, match, t } = this.props;
    const { detailTab } = appStore;
    const { appId } = match.params;

    // todo: the logic need to discuss
    const isEdit = false;

    return (
      <Layout className={styles.appInfo} pageTitle={t('App Info')} isCenterPage>
        {isEdit ? (
          <div className={styles.note}>
            <label>{t('Note')}</label>每次修改的内容都将跟随下一次版本上架而真正生效。
          </div>
        ) : (
          <div className={styles.auditNote}>
            <Icon name="exclamation" size={20} className={styles.icon} />
            {t('当前应用有版本正在审核中，以下信息暂时不可更改。')}
            <Link to={`/dashboard/app/${appId}/versions`}>
              {t('查看版本记录 →')}
            </Link>
          </div>
        )}

        <DetailTabs tabs={tags} changeTab={this.changeTab} />
        <Card>
          {detailTab === 'Base Info' && this.renderBaseInfo()}
          {detailTab === 'Instructions' && this.renderInstructions(isEdit)}
          {detailTab === 'Terms of service' && this.renderService(isEdit)}
        </Card>
      </Layout>
    );
  }
}
