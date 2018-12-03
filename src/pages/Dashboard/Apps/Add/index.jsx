import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import {
  Icon, Button, Input, Upload, Notification
} from 'components/Base';
import { LayoutStep } from 'components/Layout';
import AppCard from 'pages/Dashboard/Apps/Card';
import Card from './Card';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
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
    const isCreateApp = !appId;
    appCreateStore.isCreateApp = isCreateApp;
    appCreateStore.reset({ isCreateApp, appId });
    this.state = {
      name: isCreateApp ? 'create_app' : 'create_app_version',
      isCreateApp,
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

  onUploadClick = () => {
    this.uploadRef.onClick();
  };

  renderVersionTypes() {
    const { appCreateStore } = this.props;
    const { versionTypes } = appCreateStore;
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
      uploadPackage
    } = appCreateStore;
    const configs = [
      'Chart.yaml',
      'LICENSE',
      'README.md',
      'requirements.yaml',
      'values.yaml',
      'charts/',
      'templates/',
      'templates/NOTES.txt'
    ];

    return (
      <Fragment>
        <Upload
          ref={node => {
            this.uploadRef = node;
          }}
          checkFile={checkPackageFile}
          uploadFile={uploadPackage}
        >
          <div
            className={classNames(styles.upload, {
              [styles.uploadError]: !!errorMessage
            })}
          >
            {!!isLoading && (
              <div className={styles.loading}>
                <Icon name="loading" size={48} type="dark" />
                <p className={styles.note}>{t('file_format_loading')}</p>
              </div>
            )}
            {!isLoading
              && uploadStatus !== 'ok'
              && !errorMessage && (
                <div>
                  <Icon name="upload" size={48} type="dark" />
                  <p className={styles.note}>{t('file_format_note')}</p>
                </div>
            )}
            {!isLoading
              && uploadStatus !== 'ok'
              && errorMessage && (
                <div className={styles.errorNote}>
                  <Icon name="error" size={48} />
                  {errorMessage}
                  「<span className={styles.errorNoteLink}>
                    {t('Upload again')}
                  </span>」
                </div>
            )}
            {!isLoading
              && uploadStatus === 'ok'
              && !errorMessage && (
                <div className={styles.uploadSuccess}>
                  <Icon name="checked-circle" size={48} />
                  <div className={styles.uploadSuccessText}>
                    {t('File')}
                    <span className={styles.uploadFileName}>{fileName}</span>
                    {t('Successful upload')}
                  </div>
                </div>
            )}
          </div>
        </Upload>

        <ul className={styles.config}>
          {configs.map(config => (
            <li key={config}>
              <span
                className={classNames(styles.configName, {
                  [styles.errorColor]: !config
                })}
              >
                {config}
              </span>
              <span
                className={classNames(styles.configInfo, {
                  [styles.errorColor]: !config
                })}
              >
                # {t(`${config}_Info`)}
              </span>
            </li>
          ))}
          {uploadStatus === 'ok' && (
            <div className={styles.uploadConfirm}>
              {t('The file has problem?')}
              <span className={styles.uploadBtn} onClick={this.onUploadClick}>
                {t('Upload again')}
              </span>
            </div>
          )}
          {uploadStatus === 'init' && <div className={styles.configMask} />}
        </ul>
      </Fragment>
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
                valueChange={valueChange}
                placeholder=""
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
              valueChange={valueChange}
              placeholder=""
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
    const { appDetail } = appCreateStore;

    return (
      <Fragment>
        <div className={styles.successMsg}>
          <Icon
            className={styles.checkedIcon}
            name="checked-circle"
            size={48}
          />
          <div className={styles.textTip}>{t('Congratulations on you')}</div>
          <div className={styles.textHeader}>
            {t('Your app has been created successfully')}
          </div>
          <div className={styles.successBtns}>
            <Button
              type="primary"
              onClick={() => {
                history.push(`/store/${appDetail.app_id}/deploy`);
              }}
            >
              {t('Deploy Test')}
            </Button>
            <Button
              onClick={() => {
                history.replace(
                  `/dashboard/app/${appDetail.app_id}/create-version`
                );
              }}
              className={styles.addBtn}
            >
              {t('Add delivery type')}
            </Button>
          </div>
        </div>
        <div className={styles.appCard}>
          <AppCard apiServer={rootStore.apiServer} t={t} data={appDetail} />
        </div>
      </Fragment>
    );
  }

  render() {
    const { name, isCreateApp } = this.state;
    const { appCreateStore } = this.props;
    const { activeStep } = appCreateStore;
    const { disableNextStep } = appCreateStore;

    return (
      <LayoutStep
        className={styles.createApp}
        name={name}
        store={appCreateStore}
        disableNextStep={disableNextStep}
      >
        {activeStep === 1 && this.renderVersionTypes()}
        {activeStep === 2 && this.renderUploadConf()}
        {activeStep === 3 && isCreateApp && this.renderConfirmMsg()}
        {((activeStep === 3 && !isCreateApp) || activeStep === 4)
          && this.renderSuccessMsg()}
        <Notification />
      </LayoutStep>
    );
  }
}
