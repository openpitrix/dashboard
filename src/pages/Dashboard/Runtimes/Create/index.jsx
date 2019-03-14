import React, { Fragment } from 'react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { isHelm, qs2Obj, obj2Qs } from 'utils';
import { getUrlParam } from 'utils/url';
import routes, { toRoute, getPortalFromPath } from 'routes';

import {
  Icon, Button, Notification, Input, Select
} from 'components/Base';
import { Card, Stepper } from 'components/Layout';
import { providers } from 'config/runtimes';

import styles from './index.scss';

const CreateRuntime = 'create_runtime';
const CreateCredential = 'create_credential';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  envStore: rootStore.testingEnvStore,
  cloudEnvStore: rootStore.cloudEnvStore,
  createEnvStore: rootStore.testingEnvCreateStore,
  credentialStore: rootStore.runtimeCredentialStore,
  activeStep: rootStore.testingEnvCreateStore.stepOption.activeStep
}))
@observer
export default class CreateTestingEnv extends React.Component {
  constructor(props) {
    super(props);
    this.isCredential = getUrlParam('type') === 'credential';
    this.hasProvider = !!this.platform;
    this.props.cloudEnvStore.versionType = getUrlParam('versionType');
    this.props.createEnvStore.initSteps(this.hasProvider);
  }

  async componentDidMount() {
    const { envStore, cloudEnvStore, createEnvStore } = this.props;
    if (this.platform) {
      await envStore.checkStoreWhenInitPage([this.platform]);
    }

    if (!this.hasProvider) {
      await cloudEnvStore.fetchAll();
    }

    const queryCredential = getUrlParam('credential_id');
    if (queryCredential) {
      createEnvStore.selectCredential(queryCredential);
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      credentialStore, createEnvStore, history, activeStep
    } = this.props;
    const { credential, fetchZonesByCredential } = credentialStore;
    const { selectCredentialId } = createEnvStore;

    if (prevProps.activeStep === 1 && activeStep === 2) {
      if (this.isCreateVmRt) {
        await fetchZonesByCredential(
          selectCredentialId || credential.runtime_credential_id
        );
      }
    }

    if (activeStep === 2 && (this.doneCreateRt || this.doneCreateCredential)) {
      if (getUrlParam('goback')) {
        history.goBack();
      } else {
        history.push(toRoute(routes.portal.runtimes));
      }
    }
  }

  componentWillUnmount() {
    const { rootStore, createEnvStore, credentialStore } = this.props;
    createEnvStore.reset();
    rootStore.clearNotify();
    credentialStore.reset();
  }

  @computed
  get doneCreateRt() {
    return this.props.createEnvStore.doneCreateRt;
  }

  @computed
  get doneCreateCredential() {
    return this.props.createEnvStore.doneCreateCredential;
  }

  get platform() {
    return getUrlParam('provider');
  }

  get platformName() {
    return _.get(
      _.find(providers, { key: this.platform }),
      'name',
      this.platform
    );
  }

  get isCreateVmRt() {
    return !isHelm(this.platform) && !this.isCredential;
  }

  get i18nObj() {
    const { t } = this.props;
    const curPortal = getPortalFromPath();
    return {
      runtime_name: this.platformName,
      env_name: curPortal === 'user' ? t('Runtimes') : t('Testing env')
    };
  }

  get activeEnv() {
    return this.props.cloudEnvStore.activeEnv;
  }

  get stepName() {
    return this.isCredential ? CreateCredential : CreateRuntime;
  }

  get disableNextStep() {
    const { activeStep } = this.props;
    const { validatePassed, selectCredentialId } = this.props.createEnvStore;
    if (activeStep === 0) {
      return !getUrlParam('provider');
    }

    return !(selectCredentialId || validatePassed);
  }

  onClick = key => {
    const qs = qs2Obj();
    qs.provider = key;
    this.props.history.replace(`?${obj2Qs(qs)}`);
  };

  handleSubmit = async e => {
    const { createEnvStore } = this.props;
    e.preventDefault();
    createEnvStore.setValidateMsg();
    await createEnvStore.validateCredential();
  };

  handleEsc = () => {
    this.props.history.goBack();
  };

  renderProvider() {
    return (
      <div className={styles.credentialList}>
        {_.map(this.activeEnv, env => {
          const checked = getUrlParam('provider') === env.key;
          return (
            <Card
              className={classnames(styles.item, styles.flexCenter, {
                [styles.checked]: checked
              })}
              key={env.key}
              onClick={() => this.onClick(env.key)}
            >
              <Icon
                className={styles.platformIcon}
                name={env.icon}
                type="dark"
                size={24}
              />
              <span className={styles.name}>{env.name}</span>
              {checked && <Icon name="check" size={24} />}
            </Card>
          );
        })}
      </div>
    );
  }

  renderCredentialForm() {
    const { createEnvStore, credentialStore, t } = this.props;
    const {
      validatePassed,
      selectCredential,
      selectCredentialId,
      showNewlyCreate,
      toggleNewlyCreate
    } = createEnvStore;
    const { credentials } = credentialStore;

    if (!this.isCredential && credentials.length && !showNewlyCreate) {
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
                    {checked && <Icon name="check" size={24} />}
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

    const showTips = !this.isCredential && Boolean(credentials.length && showNewlyCreate);

    return (
      <div
        className={classnames(styles.wrap, {
          [styles.fixWrap]: showTips
        })}
      >
        {showTips && (
          <div className={styles.tipWrap}>
            <p className={classnames(styles.tipChoose, styles.fixPos)}>
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
            {isHelm(this.platform)
              ? this.renderCredentialForHelm()
              : this.renderCredentialForVM()}
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
        {validatePassed && (
          <Icon name="checked-circle" className={styles.iconSuccess} />
        )}
        {!validatePassed && validateMsg && (
          <Icon name="error" className={styles.iconFailed} />
        )}
        {isLoading && (
          <Fragment>
            <Icon name="loading" />
            {t('Validating')}
          </Fragment>
        )}
        <span
          className={classnames(styles.msg, {
            [styles.fixLoadingPos]: isLoading
          })}
        >
          {validatePassed && t('Validate successfully')}
          {!validatePassed && validateMsg && (
            <span className={styles.validateMsg} title={t(validateMsg)}>
              {t(validateMsg)}
            </span>
          )}
        </span>
      </Fragment>
    );
  }

  renderTipsOrName() {
    const { createEnvStore, t } = this.props;
    const {
      validatePassed,
      credentialName,
      changeCredentialName
    } = createEnvStore;

    if (!validatePassed) {
      return (
        <div className={styles.tips}>
          <p>
            <Icon name="question" type="dark" />
            {t('How to get these tips?')}
          </p>
          <ol>
            <li>
              {t('TIPS_LOGIN_PLATFORM_CONSOLE', {
                platform: this.platformName
              })}
            </li>
            <li>{t('TIPS_ADD_CREDENTIAL_1')}</li>
            <li>{t('TIPS_ADD_CREDENTIAL_2')}</li>
          </ol>
        </div>
      );
    }

    if (this.isCreateVmRt) {
      return (
        <div className={styles.fieldSetName}>
          <Input
            className={styles.input}
            placeholder={t('Set name')}
            value={credentialName}
            onChange={changeCredentialName}
          />
        </div>
      );
    }
  }

  renderCredentialForVM() {
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
            placeholder="例如: https://api.qingcloud.com"
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

  renderCredentialForHelm() {
    const { createEnvStore, t } = this.props;
    const { helmCredential, changeHelmCredential } = createEnvStore;

    return (
      <div className={styles.formCtrl}>
        <label className={styles.label}>{t('Credential')}</label>
        <textarea
          className={styles.txtCredential}
          value={helmCredential}
          onChange={changeHelmCredential}
        />
      </div>
    );
  }

  renderRuntimeSetting() {
    const { createEnvStore, credentialStore, t } = this.props;
    const { runtimeZones } = credentialStore;
    const {
      runtimeInfo,
      changeRuntimeZone,
      changeRuntimeName,
      changeRuntimeDesc,
      helmNamespace,
      changeRuntimeNamespace
    } = createEnvStore;
    const { selectZone, name, desc } = runtimeInfo;

    return (
      <div className={styles.wrap}>
        <Card className={classnames(styles.info, styles.fmEnvSetting)}>
          <form className={styles.createForm}>
            <div className={styles.formCtrl}>
              {isHelm(this.platform) ? (
                <Fragment>
                  <label className={styles.label}>{t('Namespace')}</label>
                  <Input
                    className={styles.input}
                    value={helmNamespace}
                    onChange={changeRuntimeNamespace}
                  />
                  <div className={styles.tipNamespace}>
                    {t('TIP_HELM_NAMESPACE')}
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <label className={styles.label}>{t('Zone')}</label>
                  {runtimeZones.length > 5 ? (
                    <Select
                      value={selectZone}
                      onChange={changeRuntimeZone}
                      className={styles.selectZones}
                    >
                      {runtimeZones.map((zone, idx) => (
                        <Select.Option value={zone} key={idx}>
                          {t(zone)}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
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
                  )}
                </Fragment>
              )}
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
                value={desc}
                maxLength={1000}
                onChange={changeRuntimeDesc}
              />
            </div>
          </form>
        </Card>
      </div>
    );
  }

  renderCredentialNameSetting() {
    const { createEnvStore, t } = this.props;
    const {
      credentialName,
      credentialDesc,
      changeCredentialName,
      changeCredentialDesc
    } = createEnvStore;

    return (
      <div className={styles.wrap}>
        <Card className={styles.info}>
          <form className={styles.createForm}>
            <div className={styles.formCtrl}>
              <label className={styles.label}>{t('Name')}</label>
              <Input
                className={styles.input}
                value={credentialName}
                onChange={changeCredentialName}
              />
            </div>
            <div className={styles.formCtrl}>
              <label className={styles.label}>{t('Backlog')}</label>
              <textarea
                value={credentialDesc}
                maxLength={1000}
                onChange={changeCredentialDesc}
              />
            </div>
          </form>
        </Card>
      </div>
    );
  }

  render() {
    const { createEnvStore, activeStep } = this.props;
    const { stepOption, prevStep, nextStep } = createEnvStore;
    return (
      <Stepper
        headerCls={styles.pgHeader}
        titleCls={styles.pgTitle}
        name={this.stepName}
        stepOption={{
          ...stepOption,
          prevStep,
          nextStep,
          goBack: this.handleEsc,
          disableNextStep: this.disableNextStep
        }}
        i18nObj={this.i18nObj}
      >
        <Notification />
        <div className={styles.form}>
          {activeStep === 0 && !this.hasProvider && this.renderProvider()}
          {activeStep === 1 && this.renderCredentialForm()}
          {activeStep === 2
            && (!this.isCredential
              ? this.renderRuntimeSetting()
              : this.renderCredentialNameSetting())}
        </div>
        <div className="hide">
          {this.doneCreateRt || this.doneCreateCredential}
        </div>
      </Stepper>
    );
  }
}
