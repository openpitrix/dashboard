import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { Table, Icon } from 'components/Base';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Status from 'components/Status';
import { versionTypes } from 'config/version-types';
import { formatTime, mappingStatus } from 'utils';
import { ALL_VERSION_STATUS } from 'config/version';

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
      queryVersionId: '',
      currentType: ''
    };
  }

  async componentDidMount() {
    const { appVersionStore, match } = this.props;
    const { appId } = match.params;

    // query this app all versions
    await appVersionStore.fetchAll({
      app_id: appId,
      status: ALL_VERSION_STATUS
    });

    // default show last version audit records
    const { versions } = appVersionStore;
    const versionId = _.get(versions, '[0].version_id');
    this.setState({ queryVersionId: versionId });
    await appVersionStore.fetchAudits({
      app_id: appId,
      version_id: versionId,
      noLimit: true
    });

    if (_.isObject(versions[0])) {
      versions[0].isShowAudits = true;
    }
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
    const { appVersionStore } = this.props;
    const { fetchAudits, audits } = appVersionStore;
    const versionId = version.version_id;
    version.isShowAudits = isShowAudits || !version.isShowAudits;

    // judge need query audits again
    if (!audits[versionId]) {
      this.setState({ queryVersionId: versionId });
      await fetchAudits({
        app_id: version.app_id,
        version_id: versionId,
        noLimit: true
      });
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
      <div className={styles.reasonShow}>
        {t('Reason')}:
        {!audit.isExpand && (
          <Fragment>
            <span className={styles.hideReason} title={audit.message}>
              &nbsp;{audit.message}
            </span>
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
    const { audits, isLoading } = appVersionStore;
    const { users } = userStore;
    const auditRecords = audits[versionId];
    const isQuery = this.state.queryVersionId === versionId;

    if (!_.isArray(auditRecords)) {
      return null;
    }

    const columns = [
      {
        title: t('Status'),
        key: 'status',
        width: '120px',
        render: item => (
          <Status type={item.status} name={mappingStatus(item.status)} />
        )
      },
      {
        title: t('Operator'),
        key: 'operator',
        render: item => `${t(item.operator_type)}: ${
          (_.find(users, { user_id: item.operator }) || {}).email
        }`
      },
      {
        title: `${t('Apply No')} / ${t('Reject reason')}`,
        key: 'reason',
        render: item => this.renderReason(item)
      },
      {
        title: t('Update time'),
        key: 'status_time',
        className: 'time',
        width: '175px',
        render: item => formatTime(item.status_time, 'YYYY/MM/DD HH:mm:ss')
      }
    ];

    const pagination = {
      hide: true
    };

    return (
      <Table
        columns={columns}
        dataSource={auditRecords}
        pagination={pagination}
        isLoading={isLoading && isQuery}
      />
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
                className={classnames(styles.name, {
                  [styles.boldName]: version.isShowAudits
                })}
              >
                <Icon
                  name={version.isShowAudits ? 'caret-down' : 'caret-right'}
                  size={16}
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
