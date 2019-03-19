import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Icon } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';
import { versionTypes } from 'config/version-types';
import { formatTime } from 'utils';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  userStore: rootStore.userStore
}))
@observer
export default class Audits extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentType: ''
    };
  }

  async componentDidMount() {
    const { appVersionStore, userStore, match } = this.props;
    const { appId } = match.params;

    // query this app all versions
    await appVersionStore.fetchAll({ app_id: appId });

    // default show last version audit records
    const { versions } = appVersionStore;
    const versionId = _.get(versions, '[0].version_id');
    await appVersionStore.fetchAudits(appId, versionId);
    if (_.isObject(versions[0])) {
      versions[0].isShowAudits = true;
    }

    // query audit relative operators name
    const userIds = _.get(appVersionStore.audits, versionId, []).map(
      item => item.operator
    );
    await userStore.fetchAll({ user_id: userIds });
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  changeType = type => {
    const { currentType } = this.state;

    if (type !== currentType) {
      this.setState({ currentType: type });
      const { versions } = this.props.appVersionStore;
      // after change type, query the type last version audit records
      const version = _.find(versions, { type });
      this.showAudits(version, true);
    }
  };

  async showAudits(version, isShowAudits) {
    const { appVersionStore, userStore } = this.props;
    const { fetchAudits, audits } = appVersionStore;
    const versionId = version.version_id;
    version.isShowAudits = isShowAudits || !version.isShowAudits;

    // judge need query audits again
    if (!audits[versionId]) {
      await fetchAudits(version.app_id, versionId);

      // judge need query users again
      const oldUserIds = userStore.users.map(item => item.user_id).sort();
      const userIds = _.get(appVersionStore.audits, versionId, []).map(
        item => item.operator
      );
      const newUserIds = _.concat(oldUserIds, userIds).sort();

      if (!_.isEqual(oldUserIds, _.uniq(newUserIds))) {
        await userStore.fetchAll({ user_id: newUserIds });
      }
    }
  }

  toggleReason(audit) {
    audit.isExpand = !audit.isExpand;
  }

  renderReason(audit) {
    const { t } = this.props;

    if (!audit.message) {
      return <span>{audit.review_id}</span>;
    }

    return (
      <div>
        {t('Reason')}:
        {!audit.isExpand && (
          <Fragment>
            <span className={styles.hideReason}>&nbsp;{audit.message}</span>
            <span
              onClick={() => this.toggleReason(audit)}
              className={styles.expand}
            >
              {t('Expand')}
            </span>
          </Fragment>
        )}
      </div>
    );
  }

  renderAudits(versionId) {
    const { appVersionStore, userStore, t } = this.props;
    const { audits } = appVersionStore;
    const { users } = userStore;
    const auditRecords = audits[versionId];

    if (!_.isArray(auditRecords)) {
      return null;
    }

    return (
      <ul className={styles.auditRecords}>
        <li>
          <label className={styles.status}>{t('Status')}</label>
          <label className={styles.operator}>{t('Operator')}</label>
          <label className={styles.reason}>
            {t('Apply No')} / {t('Reject reason')}
          </label>
          <label className={styles.time}>{t('Update time')}</label>
        </li>
        {auditRecords.map(audit => (
          <li
            key={audit.review_id || audit.status_time}
            className={classnames({ [styles.active]: audit.isExpand })}
          >
            <label className={styles.status}>
              <Status type={audit.status} name={audit.status} />
            </label>
            <label className={styles.operator}>
              {t(audit.operator_type)}:&nbsp;
              {(_.find(users, { user_id: audit.operator }) || {}).username}
            </label>
            <label className={styles.reason}>{this.renderReason(audit)}</label>
            <label className={styles.time}>
              {formatTime(audit.status_time, 'YYYY/MM/DD HH:mm:ss')}
            </label>
            {audit.isExpand && (
              <pre
                onClick={() => this.toggleReason(audit)}
                className={styles.showReason}
              >
                {audit.message}
                <br />
                <span className={styles.collapse}>{t('Collapse')}</span>
              </pre>
            )}
          </li>
        ))}
      </ul>
    );
  }

  renderTypes(types, activeType) {
    const { t } = this.props;

    return (
      <div className={styles.types}>
        {types.map(type => (
          <label
            key={type}
            onClick={() => this.changeType(type)}
            className={classnames({ [styles.active]: activeType === type })}
          >
            {(_.find(versionTypes, { value: type }) || {}).name
              || type
              || t('None')}
          </label>
        ))}
      </div>
    );
  }

  render() {
    const { appVersionStore, t } = this.props;
    const { currentType } = this.state;
    const { versions } = appVersionStore;

    const types = _.uniq(versions.map(item => item.type)); // get all unique version types
    const activeType = currentType || types[0]; // if currentType value is '', get first value of types
    const currentVersions = versions.filter(item => item.type === activeType);

    return (
      <Layout>
        <div className={styles.audits}>
          <div className={styles.title}>{t('Record')}</div>

          {this.renderTypes(types, activeType)}

          {currentVersions.map(version => (
            <div className={styles.version} key={version.version_id}>
              <div
                onClick={() => this.showAudits(version)}
                className={styles.name}
              >
                <Icon
                  name={version.isShowAudits ? 'caret-down' : 'caret-right'}
                  size={24}
                  className={styles.icon}
                />
                {t('Version')}&nbsp;{version.name}
              </div>
              {version.isShowAudits && this.renderAudits(version.version_id)}
            </div>
          ))}
        </div>
      </Layout>
    );
  }
}
