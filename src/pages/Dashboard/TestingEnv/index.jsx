import React, { Fragment } from 'react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { Icon, Tooltip } from 'components/Base';
import Layout, { Grid, Section, BreadCrumb } from 'components/Layout';
import Loading from 'components/Loading';
import Tabs from 'components/DetailTabs';
import { providers, tabs } from 'config/testing-env';
import Runtime from './Runtime';
import Credential from './Credential';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user,
  envStore: rootStore.testingEnvStore
}))
@observer
export default class TestingEnv extends React.Component {
  state = {
    loadedRt: false
  };

  async componentDidMount() {
    await this.props.envStore.updateProviderCounts();
    this.setState({
      loadedRt: true
    });
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

  render() {
    const { envStore, user, t } = this.props;
    const { loadedRt } = this.state;
    const { curTab, platform } = envStore;

    return (
      <Layout
        noSubMenu
        className={classnames(styles.layout, {
          [styles.isNormal]: user.isNormal
        })}
      >
        <div className={styles.page}>
          <h1 className={styles.title}>{t('Testing env')}</h1>
          <BreadCrumb linkPath="Cloud Provider > Platform" />

          <Grid>
            <Section size={3} className={styles.leftPanel}>
              {this.renderPlatforms()}
            </Section>

            <Section size={9} className={styles.rightPanel}>
              <Tabs
                className={styles.tabs}
                tabs={tabs}
                defaultTab={curTab}
                triggerFirst={false}
                changeTab={this.handleChangeTab}
              />
              <div className={styles.body}>
                <Loading isLoading={!loadedRt}>
                  {curTab === 'Testing env' ? (
                    <Runtime platform={platform} />
                  ) : (
                    <Credential platform={platform} />
                  )}
                </Loading>
              </div>
            </Section>
          </Grid>
        </div>
      </Layout>
    );
  }
}
