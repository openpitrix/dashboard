import React, { Fragment } from 'react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { Icon, Tooltip } from 'components/Base';
import Layout, { Grid, Section, BreadCrumb } from 'components/Layout';
import Loading from 'components/Loading';
import Tabs from 'components/DetailTabs';
import { providers, userTabs, nonUserTabs } from 'config/runtimes';

import Modals from './Modals';
import Runtime from './Runtime';
import Credential from './Credential';
import Detail from './Detail';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user,
  envStore: rootStore.testingEnvStore,
  clusterStore: rootStore.clusterStore,
  runtimeStore: rootStore.runtimeStore,
  runtimeClusterStore: rootStore.runtimeClusterStore
}))
@observer
export default class Runtimes extends React.Component {
  state = {
    loadedRt: false
  };

  async componentDidMount() {
    await this.props.envStore.updateProviderCounts();
    this.setState({
      loadedRt: true
    });
  }

  componentWillUnmount() {
    const {
      clusterStore,
      envStore,
      runtimeStore,
      runtimeClusterStore
    } = this.props;
    clusterStore.reset();
    envStore.reset();
    runtimeStore.reset();
    runtimeClusterStore.reset();
  }

  get inRuntimeTab() {
    return this.props.envStore.curTab === 'runtime';
  }

  handleClickPlatform = (curPlatform, disabled) => {
    const { changePlatform } = this.props.envStore;
    if (!disabled) {
      changePlatform(curPlatform);
    }
  };

  handleChangeTab = tab => {
    this.props.envStore.changeTab(tab);
  };

  renderPlatforms() {
    const { envStore, t } = this.props;
    const { providerCounts, platform } = envStore;

    return (
      <ul className={styles.platforms}>
        {_.map(providers, ({
          name, icon, disabled, count, key
        }) => {
          disabled = Boolean(disabled);
          if (!count) {
            count = providerCounts[key];
          }
          const elem = (
            <Fragment>
              <Icon name={icon} type="dark" />
              <span className={styles.proName}>{name}</span>
              <span className={styles.proCount}>
                {disabled ? '-' : count || 0}
              </span>
            </Fragment>
          );

          return (
            <li
              key={key}
              className={classnames(styles.provider, {
                [styles.disabled]: disabled,
                [styles.active]: platform === key
              })}
              onClick={() => this.handleClickPlatform(key, disabled)}
            >
              {disabled ? (
                <Tooltip
                  isShowArrow
                  portal
                  placement="top"
                  content={t('Not support currently')}
                  key={key}
                  targetCls={styles.tooltip}
                  popperCls={styles.popper}
                >
                  {elem}
                </Tooltip>
              ) : (
                elem
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  renderContent() {
    const { loadedRt } = this.state;
    const { curTab, platform, runtimeToShowInstances } = this.props.envStore;

    if (
      this.inRuntimeTab
      && _.isObject(runtimeToShowInstances)
      && runtimeToShowInstances.runtime_id
    ) {
      return <Detail runtime={{ ...runtimeToShowInstances }} />;
    }

    return (
      <Fragment>
        <Tabs
          className={styles.tabs}
          tabs={this.props.user.isUserPortal ? userTabs : nonUserTabs}
          defaultTab={curTab}
          changeTab={this.handleChangeTab}
        />
        <div className={styles.body}>
          <Loading isLoading={!loadedRt}>
            {this.inRuntimeTab ? (
              <Runtime platform={platform} />
            ) : (
              <Credential platform={platform} />
            )}
          </Loading>
        </div>
      </Fragment>
    );
  }

  renderMain() {
    return (
      <div className={styles.page}>
        <BreadCrumb linkPath="Cloud Provider > Platform" />

        <Grid>
          <Section size={3} className={styles.leftPanel}>
            {this.renderPlatforms()}
          </Section>
          <Section size={9} className={styles.rightPanel}>
            {this.renderContent()}
          </Section>
        </Grid>
        <Modals />
      </div>
    );
  }

  render() {
    const { user } = this.props;

    if (user.isUserPortal) {
      return this.renderMain();
    }

    return (
      <Layout
        isCenterPage
        noSubMenu
        pageTitle="Testing env"
        titleCls={styles.pageTitle}
        className={classnames(styles.layout, {
          [styles.nonUserPortal]: !user.isNormal
        })}
      >
        {this.renderMain()}
      </Layout>
    );
  }
}
