import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { Icon, Tooltip } from 'components/Base';
import Layout, {
  Grid, Section, Card, BreadCrumb
} from 'components/Layout';
import cloudProviders from 'config/cloud-providers';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  envStore: rootStore.testingEnvStore
}))
@observer
export default class TestingEnv extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  componentDidMount() {}

  handleClickPlatform = e => {
    const { envStore } = this.props;
    const { platform, disabled } = e.currentTarget.dataset;

    if (!parseInt(disabled)) {
      envStore.setPlatform(platform);
    }
  };

  renderPlatforms() {
    const { envStore, t } = this.props;
    const { platform } = envStore;

    return (
      <ul className={styles.platforms}>
        {_.map(cloudProviders, ({
          name, icon, disabled, count, key
        }) => {
          disabled = Boolean(disabled);

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
              data-platform={key}
              data-disabled={+disabled}
              className={classnames(styles.provider, {
                [styles.disabled]: disabled,
                [styles.active]: platform === key
              })}
              onClick={this.handleClickPlatform}
            >
              {disabled ? (
                <Tooltip
                  placement="top"
                  content={t('Not support currently')}
                  key={key}
                  targetCls={styles.tooltip}
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

  renderEnvs() {
    return 'envs';
  }

  render() {
    const { t } = this.props;

    console.log('render');

    return (
      <Layout noSubMenu className={styles.layout}>
        <div className={styles.page}>
          <h1 className={styles.title}>{t('Testing env')}</h1>
          <BreadCrumb linkPath="Cloud Provider > Platform" />

          <Grid>
            <Section size={3} className={styles.leftPanel}>
              {this.renderPlatforms()}
            </Section>

            <Section size={9} className={styles.rightPanel}>
              <Card className={styles.envs}>{this.renderEnvs()}</Card>
            </Section>
          </Grid>
        </div>
      </Layout>
    );
  }
}
