import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import {
  Icon, Button, Input, Upload, Notification
} from 'components/Base';
import { Stepper } from 'components/Layout';
import AppCard from 'pages/Dashboard/Apps/Card';
import { versionTypes } from 'config/version-types';
import CheckFiles from 'components/CheckFiles';
import UploadShow from 'components/UploadShow';
import { getUrlParam } from 'utils';
import routes, { toRoute } from 'routes';
import externalLink from 'config/external-link';
import Card from './Card';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  appCreateStore: rootStore.appCreateStore,
  user: rootStore.user
}))
@observer
export default class AppAdd extends Component {
  constructor(props) {
    super(props);
    props.appCreateStore.load({ appId: this.appId, type: this.type });
  }

  async componentDidMount() {
    if (this.appId) {
      await this.props.appCreateStore.fetchOneApp({ app_id: this.appId });
    }
  }

  get appId() {
    return _.get(this.props.match, 'params.appId', '');
  }

  get type() {
    return getUrlParam('type');
  }

  get stepName() {
    if (!this.appId) {
      return 'create_app';
    }
    if (this.type) {
      return 'add_app_version';
    }
    return 'create_app_version';
  }

  get appName() {
    const { appCreateStore } = this.props;
    return _.get(appCreateStore, 'appDetail.name', '');
  }

  get i18nObj() {
    const { appCreateStore } = this.props;

    return {
      appName: this.appName,
      versionTypeName: appCreateStore.versionTypeName
    };
  }

  get canAddVersionType() {
    // only two versionTypes
    const appTypes = _.get(
      this.props.appCreateStore,
      'appDetail.app_version_types',
      ''
    );
    return appTypes.split(',').length < 2;
  }

  onUploadClick = () => {
    this.uploadRef.onClick();
  };

  handAddVersionType = () => {
    const { appCreateStore, history } = this.props;
    const appId = _.get(appCreateStore, 'appDetail.app_id', '');
    history.replace(
      toRoute(routes.portal._dev.versionCreate, {
        appId
      })
    );
    appCreateStore.load({ appId }, true);
  };

  renderVersionTypes() {
    const { appCreateStore } = this.props;
    return (
      <div className={styles.cardContainer}>
        {versionTypes.map(item => (
          <Card key={item.intro} appCreateStore={appCreateStore} {...item} />
        ))}
      </div>
    );
  }

  renderUploadConf() {
    const { t, appCreateStore } = this.props;
    const {
      isLoading,
      uploadStatus,
      errorMessage,
      checkPackageFile,
      fileName,
      getVersionType,
      uploadError,
      uploadPackage
    } = appCreateStore;
    const type = getVersionType();
    const errorKeys = _.keys(uploadError);

    return (
      <div className={styles.uploadConf}>
        <Upload
          className={styles.upload}
          ref={node => {
            this.uploadRef = node;
          }}
          checkFile={checkPackageFile}
          uploadFile={uploadPackage}
        >
          <UploadShow
            isLoading={isLoading}
            uploadStatus={uploadStatus}
            errorMessage={errorMessage}
            fileName={fileName}
          />
        </Upload>

        <div className={styles.config}>
          <CheckFiles
            type={type}
            errorFiles={errorKeys}
            uploadStatus={uploadStatus}
          />
          {uploadStatus === 'ok' && (
            <div className={styles.uploadConfirm}>
              {t('The file has problem?')}
              <span className={styles.uploadBtn} onClick={this.onUploadClick}>
                {t('Upload again')}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  renderConfirmMsg() {
    const { t, appCreateStore } = this.props;
    const {
      isCreateApp,
      iconBase64,
      attribute,
      checkIconFile,
      uploadIcon,
      errorMessage,
      valueChange
    } = appCreateStore;

    return (
      <Fragment>
        <div className={styles.configMsg}>
          {isCreateApp && (
            <div>
              <label className={styles.configTitle}>{t('App Name')}</label>
              <Input
                className={styles.appName}
                name="name"
                value={attribute.name}
                onChange={valueChange}
                placeholder=""
                disabled
              />
              <span className={styles.tips}>{t('INPUT_APP_NAME_TIP')}</span>
            </div>
          )}
          <div>
            <label className={styles.configTitle}>{t('Current Version')}</label>
            <Input
              className={styles.appVersion}
              name={isCreateApp ? 'version_name' : 'name'}
              value={attribute.version_name}
              onChange={valueChange}
              placeholder=""
              disabled
            />
            <span className={styles.tips}>{t('INPUT_APP_VERSION_TIP')}</span>
          </div>
          {isCreateApp && (
            <div>
              <label className={styles.configTitle}>{t('App Icon')}</label>
              <Upload
                className={styles.uploadIcon}
                checkFile={checkIconFile}
                uploadFile={uploadIcon}
              >
                <span className={styles.appIcon}>
                  {iconBase64 && (
                    <img src={iconBase64} className={styles.iconImage} />
                  )}
                  {!iconBase64 && (
                    <span className={styles.iconText}>
                      {t('Select a file')}
                    </span>
                  )}
                </span>
              </Upload>
              <span className={styles.tips}>{t('INPUT_APP_ICON_TIP')}</span>
              <span className={styles.errorMessage}>{errorMessage}</span>
            </div>
          )}
        </div>
      </Fragment>
    );
  }

  renderSuccessMsg() {
    const {
      appCreateStore, t, rootStore, history
    } = this.props;
    const { appDetail, isAddVersion } = appCreateStore;
    const successInfo = isAddVersion
      ? 'New version has been created successfully'
      : 'Your app has been created successfully';

    return (
      <div className={styles.successMsg}>
        <div className={styles.successMsg}>
          <Icon
            className={styles.checkedIcon}
            name="checked-circle"
            size={48}
          />
          <div className={styles.textTip}>{t('Congratulations on you')}</div>
          <div className={styles.textHeader}>{t(successInfo)}</div>
          <div className={styles.successBtns}>
            <Button
              type="primary"
              onClick={() => {
                history.push(
                  toRoute(routes.portal.deploy, {
                    appId: appDetail.app_id
                  })
                );
              }}
            >
              {t('Deploy Test')}
            </Button>
            {this.canAddVersionType && (
              <Button
                onClick={this.handAddVersionType}
                className={styles.addBtn}
              >
                {t('Add delivery type')}
              </Button>
            )}
          </div>
        </div>
        <div className={styles.appCard}>
          <AppCard
            apiServer={rootStore.apiServer}
            t={t}
            data={appDetail}
            className={styles.appCard}
          />
        </div>
      </div>
    );
  }

  render() {
    const { appCreateStore } = this.props;
    const {
      activeStep,
      disableNextStep,
      attribute,
      isAddVersion,
      isCreateApp
    } = appCreateStore;

    const step = isCreateApp ? 2 : 1;
    if (activeStep === step && activeStep > 1) {
      const linkUrl = isCreateApp
        ? externalLink[`doc_${attribute.version_type}`]
        : externalLink[`doc_${attribute.type}`];
      Object.assign(appCreateStore, { linkUrl });
    } else {
      Object.assign(appCreateStore, { linkUrl: '' });
    }

    if (isAddVersion) {
      return (
        <Stepper
          className={styles.createApp}
          name={this.stepName}
          stepOption={appCreateStore}
          disableNextStep={disableNextStep}
          i18nObj={this.i18nObj}
        >
          {activeStep === 1 && this.renderUploadConf()}
          {activeStep === 2 && this.renderSuccessMsg()}
          <Notification />
        </Stepper>
      );
    }

    return (
      <Stepper
        className={styles.createApp}
        name={this.stepName}
        stepOption={appCreateStore}
        disableNextStep={disableNextStep}
        i18nObj={this.i18nObj}
      >
        {activeStep === 1 && this.renderVersionTypes()}
        {activeStep === 2 && this.renderUploadConf()}
        {activeStep === 3 && isCreateApp && this.renderConfirmMsg()}
        {((activeStep === 3 && !isCreateApp) || activeStep === 4)
          && this.renderSuccessMsg()}
        <Notification />
      </Stepper>
    );
  }
}
