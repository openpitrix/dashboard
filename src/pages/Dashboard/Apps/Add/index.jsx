import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import {
  Icon, Button, Input, Upload, Notification
} from 'components/Base';
import { LayoutStep } from 'components/Layout';
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
  componentWillUnmount() {
    this.props.appCreateStore.reset();
  }

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
        <Upload checkFile={checkPackageFile} uploadFile={uploadPackage}>
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
              && !errorMessage && (
                <div>
                  <Icon name="upload" size={48} type="dark" />
                  <p className={styles.note}>{t('file_format_note')}</p>
                </div>
            )}
            {!isLoading
              && errorMessage && (
                <div className={styles.errorNote}>
                  <Icon name="error" size={48} />
                  {errorMessage}
                  「<span className={styles.errorNoteLink}>
                    {t('Upload again')}
                  </span>」
                </div>
            )}
          </div>
        </Upload>

        <ul className={styles.config}>
          {configs.map(config => (
            <li key={config}>
              <span className={styles.configName}>{config}</span>
              <span className={styles.configInfo}># {t(`${config}_Info`)}</span>
            </li>
          ))}
          {uploadStatus === 'init' && <div className={styles.configMask} />}
        </ul>
      </Fragment>
    );
  }

  renderConfirmMsg() {
    const { t, appCreateStore } = this.props;
    const {
      attribute,
      checkIconFile,
      uploadIcon,
      errorMessage,
      valueChange
    } = appCreateStore;
    const { icon } = attribute;

    return (
      <Fragment>
        <div className={styles.configMsg}>
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
          <div>
            <label className={styles.configTitle}>{t('Current Version')}</label>
            <Input
              className={styles.appVersion}
              name="version_name"
              value={attribute.version_name}
              valueChange={valueChange}
              placeholder=""
            />
            <span className={styles.tips}>{t('INPUT_APP_VERSION_TIP')}</span>
          </div>
          <div>
            <label className={styles.configTitle}>{t('App Icon')}</label>
            <Upload checkFile={checkIconFile} uploadFile={uploadIcon}>
              <span className={styles.appIcon}>
                {icon && <img src={icon} className={styles.iconImage} />}
                {!icon && (
                  <span className={styles.iconText}>{t('Select a file')}</span>
                )}
              </span>
            </Upload>
            <span className={styles.tips}>{t('INPUT_APP_ICON_TIP')}</span>
            <span className={styles.iconError}>{errorMessage}</span>
          </div>
        </div>
      </Fragment>
    );
  }

  renderSuccessMsg() {
    const { t } = this.props;

    return (
      <div className={styles.successMsg}>
        <Icon className={styles.checkedIcon} name="checked-circle" size={48} />
        <div className={styles.textTip}>{t('Congratulations on you')}</div>
        <div className={styles.textHeader}>
          {t('Your app has been created successfully')}
        </div>
        <div className={styles.successBtns}>
          <Button type="primary" onClick={() => {}}>
            {t('Deploy Test')}
          </Button>
          <Button onClick={() => {}} className={styles.addBtn}>
            {t('Add delivery type')}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { appCreateStore } = this.props;
    const { activeStep } = appCreateStore;
    const { disableNextStep } = appCreateStore;

    return (
      <LayoutStep
        className={styles.createApp}
        name="create_app"
        store={appCreateStore}
        disableNextStep={disableNextStep}
      >
        {activeStep === 1 && this.renderVersionTypes()}
        {activeStep === 2 && this.renderUploadConf()}
        {activeStep === 3 && this.renderConfirmMsg()}
        {activeStep === 4 && this.renderSuccessMsg()}
        <Notification />
      </LayoutStep>
    );
  }
}
