import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import qs from 'query-string';
import { isHelm } from 'utils';
import { toUrl } from 'utils/url';

import {
  Icon, Button, Notification, Input
} from 'components/Base';
import { Card, Stepper } from 'components/Layout';
import Loading from 'components/Loading';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  envStore: rootStore.testingEnvStore,
  createEnvStore: rootStore.testingEnvCreateStore,
  credentialStore: rootStore.runtimeCredentialStore,
  activeStep: rootStore.testingEnvCreateStore.stepOption.activeStep,
  createdRuntime: rootStore.testingEnvCreateStore.runtime
}))
@observer
export default class CreateTestingEnv extends React.Component {
  componentWillUnmount() {
    const { rootStore, createEnvStore } = this.props;
    createEnvStore.reset();
    rootStore.clearNotify();
  }

  async componentDidUpdate(prevProps) {
    const {
      activeStep, credentialStore, createdRuntime, history
    } = this.props;
    const { credential, fetchZonesByCredential } = credentialStore;

    if (prevProps.activeStep === 1 && activeStep === 2) {
      await fetchZonesByCredential(credential.runtime_credential_id);
    }

    if (activeStep === 2 && createdRuntime.runtime_id) {
      history.push(toUrl(`/:dash/testing-env`));
    }
  }

  handleSubmit = async e => {
    const { createEnvStore } = this.props;
    e.preventDefault();
    createEnvStore.setValidateMsg();
    await createEnvStore.validateCredential();
  };

  handleEsc = () => {
    this.props.history.push(toUrl(`/:dash/testing-env`));
  };

  renderEnvAuthInfo() {
    const {
      envStore, createEnvStore, t, location
    } = this.props;
    const { platform } = envStore;
    const { validatePassed } = createEnvStore;
    const query = qs.parse(location.search);
    const curPlatform = query.type || platform || 'vm';

    return (
      <div className={styles.wrap}>
        <Card
          className={classnames(styles.info, {
            [styles.fmValidated]: Boolean(validatePassed)
          })}
        >
          <form onSubmit={this.handleSubmit} className={styles.createForm}>
            {isHelm(curPlatform)
              ? this.renderAuthForHelm()
              : this.renderAuthForVM()}
            <div>
              <Button
                htmlType="submit"
                type="primary"
                className={styles.btnVerify}
              >
                {t('Verify')}
              </Button>
              <div className={styles.errMsg}>{this.renderValidateStatus()}</div>
            </div>
          </form>
          {this.renderTipsOrName()}
        </Card>
      </div>
    );
  }

  renderValidateStatus() {
    const { createEnvStore, credentialStore, t } = this.props;
    const { validatePassed, validateMsg } = createEnvStore;
    const { isLoading } = credentialStore;

    return (
      <Fragment>
        <Loading
          isLoading={isLoading}
          className={styles.spinner}
          loaderCls={styles.loading}
        />
        {validatePassed && (
          <Icon name="checked-circle" className={styles.iconSuccess} />
        )}
        {!validatePassed
          && validateMsg && <Icon name="error" className={styles.iconFailed} />}
        <span
          className={classnames(styles.msg, {
            [styles.fixLoadingPos]: isLoading
          })}
        >
          {isLoading && t('Validating')}
          {validatePassed && t('Validate successfully')}
          {!validatePassed && validateMsg && t(validateMsg)}
        </span>
      </Fragment>
    );
  }

  renderTipsOrName() {
    const { createEnvStore, t } = this.props;
    const { validatePassed, authInfoName, changeAuthInfoName } = createEnvStore;

    if (!validatePassed) {
      return (
        <div className={styles.tips}>
          <p>
            <Icon name="question" type="dark" />
            {t('How to get these tips?')}
          </p>
          <ol>
            <li>登录QingCloud控制台</li>
            <li>进入API密钥管理界面</li>
            <li>点击创建，并下载密钥文件</li>
          </ol>
        </div>
      );
    }

    return (
      <div className={styles.fieldSetName}>
        <Input
          className={styles.input}
          placeholder={t('Set name')}
          value={authInfoName}
          onChange={changeAuthInfoName}
        />
      </div>
    );
  }

  renderAuthForVM() {
    const { createEnvStore, t } = this.props;
    const {
      runtimeUrl,
      accessKey,
      secretKey,
      changeRuntimeUrl,
      changeAccessKey,
      changeSecretKey
    } = createEnvStore;

    return (
      <Fragment>
        <div className={styles.formCtrl}>
          <label className={styles.label}>{t('URL')}</label>
          <Input
            className={styles.input}
            placeholder="https://www.qingcloud.com/api"
            value={runtimeUrl}
            onChange={changeRuntimeUrl}
          />
        </div>
        <div className={styles.formCtrl}>
          <label className={styles.label}>{t('Access Key ID')}</label>
          <Input
            className={styles.input}
            placeholder="例如：IPKQGQCLQPRIQKFWOYFL"
            value={accessKey}
            onChange={changeAccessKey}
          />
        </div>
        <div className={styles.formCtrl}>
          <label className={styles.label}>{t('Secret Access Key')}</label>
          <Input
            className={styles.input}
            placeholder="例如：7ILEgW6wZCcu3y5DaIQBuaflZGnakM2tbcJXvlJH"
            value={secretKey}
            onChange={changeSecretKey}
          />
        </div>
      </Fragment>
    );
  }

  renderAuthForHelm() {
    const { t } = this.props;

    return (
      <div className={styles.formCtrl}>
        <label className={styles.label}>{t('Credential')}</label>
        <textarea className={styles.txtCredential} maxLength={1000} />
      </div>
    );
  }

  renderEnvSetting() {
    const { createEnvStore, credentialStore, t } = this.props;
    const { runtimeZones } = credentialStore;
    const {
      runtimeInfo,
      changeRuntimeZone,
      changeRuntimeName,
      changeRuntimeDesc
    } = createEnvStore;
    const { selectZone, name, desc } = runtimeInfo;

    return (
      <div className={styles.wrap}>
        <Card className={classnames(styles.info, styles.fmEnvSetting)}>
          <form className={styles.createForm}>
            <div className={styles.formCtrl}>
              <label className={styles.label}>{t('Zone')}</label>
              <ul className={styles.zones}>
                {runtimeZones.map((zone, idx) => (
                  <li
                    key={idx}
                    className={classnames({
                      [styles.activeZone]: selectZone === zone
                    })}
                    onClick={() => changeRuntimeZone(zone)}
                  >
                    {zone}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.formCtrl}>
              <label className={styles.label}>{t('Name')}</label>
              <Input
                className={styles.input}
                value={name}
                onChange={changeRuntimeName}
              />
            </div>
            <div className={styles.formCtrl}>
              <label className={styles.label}>{t('Backlog')}</label>
              <textarea
                maxLength={1000}
                value={desc}
                onChange={changeRuntimeDesc}
              />
            </div>
          </form>
        </Card>
      </div>
    );
  }

  render() {
    const { createEnvStore } = this.props;
    const {
      stepOption, prevStep, nextStep, validatePassed
    } = createEnvStore;
    const { activeStep } = stepOption;

    return (
      <Stepper
        headerCls={styles.pgHeader}
        titleCls={styles.pgTitle}
        name={'create_runtime'}
        stepOption={{
          ...stepOption,
          prevStep,
          nextStep,
          goBack: this.handleEsc,
          disableNextStep: !validatePassed
        }}
      >
        <Notification />
        <div className={styles.form}>
          {activeStep === 1 && this.renderEnvAuthInfo()}
          {activeStep === 2 && this.renderEnvSetting()}
        </div>
      </Stepper>
    );
  }
}
