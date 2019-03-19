import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import routes, { toRoute } from 'routes';

import { Icon, Button, Notification } from 'components/Base';
import { Card, Grid, Section } from 'components/Layout';
import Loading from 'components/Loading';
import RuntimeCard from '../Card';

import styles from '../index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  envStore: rootStore.testingEnvStore,
  credentialStore: rootStore.runtimeCredentialStore,
  user: rootStore.user
}))
@observer
export class Runtime extends React.Component {
  static propTypes = {
    platform: PropTypes.string
  };

  static defaultProps = {
    platform: 'qingcloud'
  };

  async componentDidMount() {
    await this.props.envStore.fetchData();
  }

  async componentDidUpdate(prevProps) {
    const { platform, envStore } = this.props;
    if (prevProps.platform !== platform) {
      await envStore.fetchData();
    }
  }

  handleClickClusterCnt = rt => {
    this.props.envStore.changeRuntimeToShowInstances(rt);
  };

  goPage = () => {
    const { platform = 'qingcloud' } = this.props.envStore;
    const page = toRoute(routes.portal.runtimeCreate);
    this.props.history.push(`${page}?provider=${platform}`);
  };

  renderEmpty() {
    const { envStore, t } = this.props;

    return (
      <Card className={styles.emptyData}>
        <p>{t('No env')}</p>
        <p>{t('TIPS_NOT_ADD_ENV', { env: envStore.platformName })}</p>
        <Button
          type="primary"
          className={styles.btnAddEnv}
          onClick={this.goPage}
        >
          <Icon name="add" type="white" />
          {t('Add')}
        </Button>
      </Card>
    );
  }

  renderContent() {
    const { envStore, runtimeStore, t } = this.props;
    const { platform } = envStore;
    const { runtimes } = runtimeStore;
    const validRts = _.filter(runtimes, rt => rt.provider === platform);

    if (_.isEmpty(validRts)) {
      return this.renderEmpty();
    }

    return (
      <Grid className={styles.envs}>
        {_.map(validRts, props => (
          <Section size={6} key={props.runtime_id}>
            <RuntimeCard
              {...props}
              onClick={() => this.handleClickClusterCnt(props)}
            />
          </Section>
        ))}
        <Section size={6} className={styles.cardAddEnv}>
          <Button
            className={styles.btnAdd}
            onClick={this.goPage}
            type="primary"
          >
            <Icon name="add" type="white" />
            {t('Add new env')}
          </Button>
        </Section>
      </Grid>
    );
  }

  render() {
    const { envStore } = this.props;
    const { isLoading } = envStore;

    return (
      <Loading isLoading={isLoading}>
        <Notification />
        {this.renderContent()}
      </Loading>
    );
  }
}

export default withRouter(Runtime);
