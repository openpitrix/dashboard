import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  userStore: rootStore.userStore
}))
@observer
export default class Profile extends Component {
  render() {
    return (
      <Layout>
        <Grid>Develop ...</Grid>
      </Layout>
    );
  }
}
