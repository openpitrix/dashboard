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
  componentDidMount() {
    this.props.envStore.checkStoreWhenInitPage([this.getUrlParam('provider')]);
  }

  componentWillUnmount() {
    const { rootStore, createEnvStore } = this.props;
    createEnvStore.reset();
    rootStore.clearNotify();
  }

  getUrlParam(key = '') {
    const query = qs.parse(this.props.location.search);
    return key ? query[key] : query;
  }

  async componentDidUpdate(prevProps) {
    const {
      activeStep,
      credentialStore,
      createEnvStore,
      createdRuntime,
      history
    } = this.props;
    const { credential, fetchZonesByCredential } = credentialStore;
    const { selectCredentialId } = createEnvStore;

    if (prevProps.activeStep === 1 && activeStep === 2) {
      await fetchZonesByCredential(
        selectCredentialId || credential.runtime_credential_id
      );
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
      envStore, createEnvStore, credentialStore, t
    } = this.props;
    const { platform } = envStore;
    const {
      validatePassed,
      selectCredential,
      selectCredentialId,
      showNewlyCreate,
      toggleNewlyCreate
    } = createEnvStore;
    const { credentials } = credentialStore;
    const curPlatform = this.getUrlParam('provider') || platform;

    if (credentials.length && !showNewlyCreate) {
      return (
        <div className={styles.credentialList}>
          <p className={styles.tipChoose}>
            <span className={styles.txt1}>{t('You can')}</span>
            <span className={styles.txt2}>
              {t('Choose from already saved resource')}
            </span>
          </p>
          {_.map(
            credentials,
            ({ name, description, runtime_credential_id }, idx) => {
              const checked = selectCredentialId === runtime_credential_id;

              return (
                <Card
                  className={classnames(styles.item, {
                    [styles.checked]: checked
                  })}
                  key={idx}
                  onClick={() => selectCredential(runtime_credential_id)}
                >
                  <span className={styles.name}>{name}</span>
                  <span className={styles.desc}>{description}</span>
                  <span className={styles.icon}>
                    {checked && <Icon name="check" />}
                  </span>
                </Card>
              );
            }
          )}
          <p className={styles.tipAdd}>
            <span className={styles.txt1}>{t('Or')}</span>
            <span className={styles.linkAdd} onClick={toggleNewlyCreate}>
              {t('Newly create')}
            </span>
          </p>
        </div>
      );
    }

    const showTips = Boolean(credentials.length && showNewlyCreate);

    return (
      <div
        className={classnames(styles.wrap, {
          [styles.fixWrap]: showTips
        })}
      >
        {showTips && (
          <div className={styles.tipWrap}>
            <p
              className={styles.tipChoose}
              style={{
                paddingBottom: '24px',
                borderBottom: '1px solid #eff0f5',
                marginBottom: '24px'
              }}
            >
              <span className={styles.txt1}>{t('You can')}</span>
              <span className={styles.linkAdd} onClick={toggleNewlyCreate}>
                {t('Choose from already saved resource')}
              </span>
            </p>
            <p>
              <span className={styles.txt1}>{t('Or')}</span>
              <span className={styles.txt2}>{t('Newly create')}</span>
            </p>
          </div>
        )}

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
    const { createEnvStore, t } = this.props;
    const { credentialContent, changeCredentialContent } = createEnvStore;

    return (
      <div className={styles.formCtrl}>
        <label className={styles.label}>{t('Credential')}</label>
        <textarea
          className={styles.txtCredential}
          maxLength={1000}
          value={credentialContent}
          onChange={changeCredentialContent}
        />
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
      stepOption,
      prevStep,
      nextStep,
      validatePassed,
      selectCredentialId
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
          disableNextStep: !(selectCredentialId || validatePassed)
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
