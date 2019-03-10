import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
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
import Card from './Card';

import styles from './index.scss';

@translate()
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

    const { match, appCreateStore } = props;
    const appId = _.get(match, 'params.appId');
    const type = getUrlParam('type');
    let name = !appId ? 'create_app' : 'create_app_version';
    if (type) {
      appCreateStore.modifyVersionType = type;
      name = 'add_app_version';
    }

    appCreateStore.reset({ appId, type });
    this.state = {
      name,
      isCreateApp: !appId,
      isAddVersion: Boolean(type),
      appId
    };
  }

  async componentDidMount() {
    const { appCreateStore } = this.props;
    const app_id = this.state.appId;
    if (app_id) {
      await appCreateStore.fetchOneApp({ app_id });
    }
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

  onUploadClick = () => {
    this.uploadRef.onClick();
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
      iconBase64,
      attribute,
      checkIconFile,
      uploadIcon,
      errorMessage,
      valueChange
    } = appCreateStore;
    const { isCreateApp } = this.state;

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
    const { isCreateApp, isAddVersion, appId } = this.state;
    const { appDetail } = appCreateStore;
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
            {!isAddVersion && (
              <Button
                onClick={() => {
                  if (isCreateApp) {
                    history.replace(toRoute(routes.portal._dev.appCreate));
                  } else {
                    appCreateStore.reload({ isCreateApp, appId });
                  }
                }}
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
    const { name, isCreateApp, isAddVersion } = this.state;
    const { appCreateStore } = this.props;
    const { activeStep } = appCreateStore;
    const { disableNextStep } = appCreateStore;

    if (isAddVersion) {
      return (
        <Stepper
          className={styles.createApp}
          name={name}
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
        name={name}
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
