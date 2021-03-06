import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';
import _ from 'lodash';

import {
  Input, Select, Icon, Button, Upload, Image
} from 'components/Base';
import { Card } from 'components/Layout';
import DetailTabs from 'components/DetailTabs';
import externalLink from 'config/external-link';

import styles from './index.scss';

const tabs = [
  { name: 'Base Info', value: 'baseInfo' },
  { name: 'Instructions', value: 'readme' },
  { name: 'Terms of service', value: 'service', disabled: true }
];

@withTranslation()
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

    // todo: api screenshots is string, not array
    const screenshotStr = _.get(appDetail, 'screenshots', '');
    const screenshots = screenshotStr ? screenshotStr.split(',') : [];
    const len = screenshots.length;

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
          {(screenshots || []).length}/6 {t('screenshots')}
          {isEdit && (
            <Upload
              multiple
              className={styles.selectFile}
              checkFile={checkScreenshot}
              uploadFile={uploadScreenshot}
            >
              {t('Select file')}
            </Upload>
          )}
          {isEdit && (
            <label className={styles.deleteAll} onClick={deleteScreenshot}>
              {t('Delete all')}
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
        {t('The following content editing support ')}
        <a href={externalLink.markdown} target="blank">
          Markdown
        </a>
        {t(' grammar')}
        <div className={styles.buttons}>
          <Button
            type="primary"
            disabled={!isEdit}
            onClick={() => saveAppInfo(type)}
          >
            {t('Save')}
          </Button>
          <Button disabled={!isEdit} onClick={() => this.changePreview(type)}>
            <Icon
              name={isPreview ? 'pen' : 'eye'}
              size={20}
              type="dark"
              className={styles.icon}
            />
            {t(isPreview ? 'Edit' : 'Preview')}
          </Button>
          {type === 'readme' && (
            <a href={externalLink.readme_example} target="blank">
              <Button>
                <Icon
                  name="documentation"
                  size={20}
                  type="dark"
                  className={styles.icon}
                />
                {t('View example')}
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
            placeholder={t('Start writing application terms of service')}
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
            placeholder={t('Start writing instructions for the app')}
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
      checkApp,
      checkResult,
      changeCategory,
      resetBaseInfo,
      isEdit
    } = appStore;

    return (
      <form className={styles.createForm} onSubmit={modifyApp}>
        <div
          className={classnames(styles.item, {
            [styles.error]: checkResult.name
          })}
        >
          <div className={styles.name}>
            <label>{t('Name')}</label>
            <p className={styles.noteWord}>
              {t('Important identifier of the application')}
            </p>
          </div>
          <Input
            name="name"
            value={appDetail.name || ''}
            onChange={e => changeApp(e, 'name')}
            onBlur={e => checkApp(e, 'name')}
            onFocus={e => checkApp(e, 'name', true)}
            maxLength={50}
            disabled={!isEdit}
          />
          <p className={styles.errorInfo}>{t(checkResult.name)}</p>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('App intro')}</label>
            <p className={styles.noteWord}>
              {t('A general introduction to the application')}
            </p>
          </div>
          <Input
            name="abstraction"
            maxLength={200}
            value={appDetail.abstraction || ''}
            onChange={e => changeApp(e, 'abstraction')}
            disabled={!isEdit}
          />
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('Detail introduction')}</label>
            <p className={styles.noteWord}>
              {t('Very helpful when users search for apps')}
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
            <label>{t('Icon')}</label>
            <p className={styles.noteWord}>
              {t('Format png/svg background transparency is the best')} <br />
              {t('Graphics size')}: 96px*96*px
            </p>
          </div>
          {this.renderIcon()}
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('Screenshot of the interface')}</label>
            <p className={styles.noteWord}>
              {t('Format')} : png/jpg <br />
              {t('File size no more than 2MB')}
              <br />
              {t('Minimum 3, maximum 6')}
            </p>
          </div>
          {this.renderScreenshots()}
        </div>
        <div className={styles.item}>
          <div className={styles.name}>
            <label>{t('Categories')}</label>
            <p className={styles.noteWord}>{t('CHOOSE_APP_CATEGORY_DESC')}</p>
          </div>
          <Select
            value={appDetail.category_id}
            onChange={changeCategory}
            disabled={!isEdit}
          >
            {categories.map(item => (
              <Select.Option key={item.category_id} value={item.category_id}>
                {t(item.name)}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div
          className={classnames(styles.item, {
            [styles.error]: checkResult.home
          })}
        >
          <div className={styles.name}>
            <label>{t('Service provider website')}</label>
            <p className={styles.noteWord}>
              {t("Service provider's official website address")}
            </p>
          </div>
          <Input
            className={styles.input}
            name="home"
            maxLength={200}
            value={appDetail.home || ''}
            onChange={e => changeApp(e, 'home')}
            onBlur={e => checkApp(e, 'home')}
            onFocus={e => checkApp(e, 'home', true)}
            disabled={!isEdit}
          />
          <p className={styles.errorInfo}>{t(checkResult.home)}</p>
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

  render() {
    const { appStore } = this.props;
    const { detailTab } = appStore;

    return (
      <Card>
        <DetailTabs tabs={tabs} changeTab={this.changeTab} isCardTab />
        {detailTab === 'baseInfo' && this.renderBaseInfo()}
        {detailTab === 'readme' && this.renderInstructions()}
        {detailTab === 'service' && this.renderService()}
      </Card>
    );
  }
}
