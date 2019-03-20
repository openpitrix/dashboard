import React from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { platformUrl, PLATFORM } from 'config/runtimes';

import { Icon, DocLink } from 'components/Base';
import styles from '../index.scss';

@withTranslation()
@observer
export default class CreateTestingTip extends React.Component {
  renderQingCloudTip() {
    const { platform, platformName } = this.props;
    return (
      <ol>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_QINGCLOUD_1">
            Login {{ name: platformName }}
            <DocLink isExternal to={_.get(platformUrl, `[${platform}]console`)}>
              {' '}
              Console{' '}
            </DocLink>
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_QINGCLOUD_2">
            Enter the
            <DocLink
              isExternal
              to={_.get(platformUrl, `[${platform}]accessKey`)}
            >
              {' '}
              Access Key{' '}
            </DocLink>
            page
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_QINGCLOUD_3">
            Click
            <DocLink
              isExternal
              to={_.get(platformUrl, `[${platform}]accessKey`)}
            >
              {' '}
              Create{' '}
            </DocLink>
            and download the key file.
          </Trans>
        </li>
      </ol>
    );
  }

  renderAwsTip() {
    const { platform, platformName } = this.props;
    return (
      <ol>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_AWS_1">
            Login {{ name: platformName }}
            <DocLink isExternal to={_.get(platformUrl, `[${platform}]console`)}>
              {' '}
              Console{' '}
            </DocLink>
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_AWS_2">
            Find the API Server address of the Availability Zone;
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_AWS_3">
            Go to the
            <DocLink
              isExternal
              to={_.get(platformUrl, `[${platform}]accessKey`)}
            >
              Your Security Credentials
            </DocLink>
            screen and expand
            <DocLink
              isExternal
              to={_.get(platformUrl, `[${platform}]accessKey`)}
            >
              {' '}
              Access Key{' '}
            </DocLink>
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_AWS_4">
            Click
            <DocLink
              isExternal
              to={_.get(platformUrl, `[${platform}]accessKey`)}
            >
              {' '}
              Create{' '}
            </DocLink>
            and download the key file.
          </Trans>
        </li>
      </ol>
    );
  }

  renderAliyunTip() {
    const { platform } = this.props;
    return (
      <ol>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_ALIYUN_1">
            Login
            <DocLink isExternal to={_.get(platformUrl, `[${platform}]console`)}>
              {' '}
              Console{' '}
            </DocLink>
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_ALIYUN_2">
            Enter the
            <DocLink
              isExternal
              to={_.get(platformUrl, `[${platform}]accessKey`)}
            >
              {' '}
              Security Management{' '}
            </DocLink>
            page
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_ALIYUN_3">
            Click
            <DocLink
              isExternal
              to={_.get(platformUrl, `[${platform}]accessKey`)}
            >
              {' '}
              Create{' '}
            </DocLink>
            and download the key file.
          </Trans>
        </li>
      </ol>
    );
  }

  renderK8STip() {
    return (
      <ol>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_K8S_1">
            Enter the Kubernetes environment;
          </Trans>
        </li>
        <li>
          <Trans i18nKey="TIPS_ADD_CREDENTIAL_K8S_2">
            Copy the contents of "~/.kube/config".
          </Trans>
        </li>
      </ol>
    );
  }

  render() {
    const { t, platform } = this.props;

    return (
      <div className={styles.tips}>
        <div>
          <Icon name="question" type="dark" />
          {t('How to get these tips?')}
          {platform === PLATFORM.qingcloud && this.renderQingCloudTip()}
          {platform === PLATFORM.aws && this.renderAwsTip()}
          {platform === PLATFORM.aliyun && this.renderAliyunTip()}
          {platform === PLATFORM.kubernetes && this.renderK8STip()}
        </div>
      </div>
    );
  }
}
