import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import _ from 'lodash';

import {
  Input, Select, Icon, Button, Upload, Image
} from 'components/Base';
import Layout, { Card } from 'components/Layout';
import DetailTabs from 'components/DetailTabs';

import styles from './index.scss';

const tags = ['Base Info', 'Instructions', 'Terms of service'];

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore
}))
@observer
export default class Info extends Component {
  static propTypes = {
    isCheckInfo: PropTypes.bool
  };

  static defaultProps = {
    isCheckInfo: false
  };

  async componentDidMount() {
    const {
      appStore, appVersionStore, categoryStore, match
    } = this.props;
    const appId = _.get(match, 'params.appId', '');

    if (appId) {
      // await appStore.fetch(appId);

      // query this version relatived app info
      await appVersionStore.fetchAll({ app_id: appId });

      // judge you can edit app info
      const { versions } = appVersionStore;
      appStore.isEdit = !_.find(versions, { status: 'submitted' });

      // query categories data for category select
      await categoryStore.fetchAll();
    }
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  changeTab = tab => {
    const { appStore } = this.props;
    appStore.detailTab = tab;
  };

  changePreview = type => {
    const { appDetail } = this.props.appStore;
    const previewType = type === 'readme' ? 'isPreviewReadme' : 'isPreviewService';
    appDetail[previewType] = !appDetail[previewType];
  };

  renderScreenshots() {
    const { appStore, t } = this.props;
    const {
      isEdit,
      appDetail,
      checkScreenshot,
      uploadScreenshot,
      deleteScreenshot
    } = appStore;

    const { screenshots } = appDetail;
    const len = _.isArray(screenshots) ? screenshots.length : 0;

    return (
      <div className={styles.screenshot}>
        <ul className={styles.pictrues}>
          {len > 0 ? (
            screenshots.map((item, index) => (
              <li key={index}>
                <Image src={item} isBase64Str />
              </li>
            ))
          ) : (
            <Fragment>
              <li />
              <li />
              <li />
            </Fragment>
          )}
        </ul>
        <div className={styles.words}>
          {screenshots.length}/6 {t('张截图')}
          {isEdit && (
            <Upload
              multiple
              className={styles.selectFile}
              checkFile={checkScreenshot}
              uploadFile={uploadScreenshot}
            >
              {t('选择文件')}
            </Upload>
          )}
          {isEdit && (
            <label className={styles.deleteAll} onClick={deleteScreenshot}>
              {t('删除全部')}
            </label>
          )}
        </div>
      </div>
    );
  }

  renderIcon() {
    const { appStore, t } = this.props;
    const {
      isEdit, appDetail, checkIcon, uploadIcon, deleteIcon
    } = appStore;
    const { icon } = appDetail;

    if (icon) {
      return (
        <div className={styles.iconShow}>
          <Image src={icon} isBase64Str />
          {isEdit && (
            <label className={styles.delete} onClick={deleteIcon}>
              {t('Delete')}
            </label>
          )}
        </div>
      );
    }

    return (
      <Upload
        className={styles.selectIcon}
        checkFile={checkIcon}
        uploadFile={uploadIcon}
        disabled={!isEdit}
      >
        {isEdit && <span>{t('Select file')}</span>}
      </Upload>
    );
  }

  renderMakdownNote = type => {
    const { appStore, t } = this.props;
    const { appDetail, isEdit, saveAppInfo } = appStore;
    const previewType = type === 'readme' ? 'isPreviewReadme' : 'isPreviewService';
    const isPreview = appDetail[previewType];

    return (
      <div className={styles.markdownNote}>
        {t('以下内容编辑支持')}
        <a href="http://markdownpad.com" target="blank">
          Markdown
        </a>
        {t('语法')}
        <div className={styles.buttons}>
          <Button
            type="primary"
            disabled={!isEdit}
            onClick={() => saveAppInfo(type)}
          >
            {t('Save')}
          </Button>
          <Button disabled={!isEdit} onClick={() => this.changePreview(type)}>
            <Icon name={isPreview ? 'pen' : 'eye'} size={20} type="dark" />
            {t(isPreview ? 'Edit' : 'Preview')}
          </Button>
          {type === 'readme' && (
            <a href="#" target="_blank">
              <Button>
                <Icon name="documentation" size={20} type="dark" />
                {t('查看范例')}
              </Button>
            </a>
          )}
        </div>
      </div>
    );
  };

  renderService() {
    const { appStore, t } = this.props;
    const { appDetail, isEdit, changeApp } = appStore;
    const isPreview = !isEdit || appDetail.isPreviewService;

    return (
      <div className={styles.textareaOuter}>
        {this.renderMakdownNote('tos')}
        {isPreview ? (
          <div className="markdown">
            <ReactMarkdown source={appDetail.tos} />
          </div>
        ) : (
          <textarea
            autoFocus
            value={appDetail.tos}
            onChange={e => changeApp(e, 'tos')}
            placeholder={t('开始编写应用的服务条款')}
          />
        )}
      </div>
    );
  }

  renderInstructions() {
    const { appStore, t } = this.props;
    const { appDetail, isEdit, changeApp } = appStore;
    const isPreview = !isEdit || appDetail.isPreviewReadme;

    return (
      <div className={styles.textareaOuter}>
        {this.renderMakdownNote('readme')}
        {isPreview ? (
          <div className="markdown">
            <ReactMarkdown source={appDetail.readme} />
          </div>
        ) : (
          <textarea
            autoFocus
            value={appDetail.readme}
            onChange={e => changeApp(e, 'readme')}
            className="textarea"
            placeholder={t('开始编写应用的使用说明')}
          />
        )}
      </div>
    );
  }

  renderBaseInfo() {
    const {
      appStore, categoryStore, isCheckInfo, t
    } = this.props;
    const { categories } = categoryStore;
    const {
      appDetail,
      modifyApp,
      changeApp,
      changeCategory,
      resetBaseInfo,
      isEdit
    } = appStore;

    return (
      <form id="infoForm" className={styles.createForm} onSubmit={modifyApp}>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('Name')}</label>
            <p className={styles.noteWord}>{t('应用的重要标识')}</p>
          </div>
          <Input
            name="name"
            value={appDetail.name}
            onChange={e => changeApp(e, 'name')}
            maxLength={50}
            required
            disabled={!isEdit}
          />
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('一句话介绍')}</label>
            <p className={styles.noteWord}>{t('对应用的概括性介绍')}</p>
          </div>
          <Input
            name="abstraction"
            maxLength={200}
            value={appDetail.abstraction}
            onChange={e => changeApp(e, 'abstraction')}
            disabled={!isEdit}
          />
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('详细介绍')}</label>
            <p className={styles.noteWord}>
              {t('在用户搜索应用时会非常有帮助')}
            </p>
          </div>
          <textarea
            name="description"
            value={appDetail.description}
            onChange={e => changeApp(e, 'description')}
            disabled={!isEdit}
          />
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('图标')}</label>
            <p className={styles.noteWord}>
              {t('格式: png/svg背景透明最佳')} <br />
              {t('图形大小：')}96px*96*px
            </p>
          </div>
          {this.renderIcon()}
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
          {this.renderScreenshots()}
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('分类')}</label>
            <p className={styles.noteWord}>
              {t('选择适合的应用分类，便于用户更快发现你的应用')}
            </p>
          </div>
          <Select
            value={appDetail.category_id}
            onChange={changeCategory}
            disabled={!isEdit}
          >
            {categories.map(item => (
              <Select.Option key={item.category_id} value={item.category_id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('服务商网站')}</label>
            <p className={styles.noteWord}>{t('服务商的官方网站地址')}</p>
          </div>
          <Input
            className={styles.input}
            name="home"
            maxLength={200}
            value={appDetail.home}
            onChange={e => changeApp(e, 'home')}
            disabled={!isEdit}
          />
        </div>
        {!isCheckInfo && (
          <div className={styles.operateBtns}>
            <Button type="primary" htmlType="submit" disabled={!isEdit}>
              {t('Save')}
            </Button>
            <Button onClick={resetBaseInfo} disabled={!isEdit}>
              {t('Reset')}
            </Button>
          </div>
        )}
      </form>
    );
  }

  renderContent() {
    const { detailTab } = this.props.appStore;

    return (
      <Fragment>
        <DetailTabs tabs={tags} changeTab={this.changeTab} />
        <Card>
          {detailTab === 'Base Info' && this.renderBaseInfo()}
          {detailTab === 'Instructions' && this.renderInstructions()}
          {detailTab === 'Terms of service' && this.renderService()}
        </Card>
      </Fragment>
    );
  }

  render() {
    const {
      appStore, isCheckInfo, match, t
    } = this.props;
    const { isEdit } = appStore;
    const appId = _.get(match, 'params.appId', '');

    if (isCheckInfo) {
      return this.renderContent();
    }

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

        {this.renderContent()}
      </Layout>
    );
  }
}
