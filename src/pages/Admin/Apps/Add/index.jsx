import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Icon, Button } from 'components/Base';
import Layout, { Grid } from 'components/Layout';
import RepoList from './RepoList';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore,
  appCreateStore: rootStore.appCreateStore
}))
@observer
export default class AppAdd extends Component {
  static async onEnter({ repoStore }) {
    await repoStore.fetchAll();
  }

  componentWillUnmount() {
    const { repoStore } = this.props;
    repoStore.loadPageInit();
  }

  setCreateStep = step => {
    const { setCreateStep } = this.props.appCreateStore;
    window.scroll({ top: 0, behavior: 'smooth' });
    setCreateStep(step);
  };

  uploadFile = () => {
    const { appCreateStore } = this.props;
    appCreateStore.isLoading = !appCreateStore.isLoading;
  };

  renderSelectRepo() {
    const { repos } = this.props.repoStore;
    const publicRepos = repos.filter(repo => repo.visibility === 'public');
    const privateRepos = repos.filter(repo => repo.visibility === 'private');

    return (
      <div className={styles.stepContent}>
        <div className={styles.stepName}>Create New Application</div>
        <div className={styles.stepExplain}>Select a Repo to store your application</div>
        <div className={styles.repoOuter}>
          <RepoList type="public" repos={publicRepos} />
          <RepoList type="private" repos={privateRepos} />
        </div>
        <div>
          <label onClick={() => this.setCreateStep(2)} className={styles.stepOperate}>
            Next →
          </label>
        </div>
      </div>
    );
  }

  renderUploadPackage() {
    const { isLoading, errorMsg } = this.props.appCreateStore;

    return (
      <div className={styles.stepContent}>
        <div className={styles.stepName}>Create New Application</div>
        <div className={styles.stepExplain}>Create New Application</div>
        <div
          className={classNames(styles.upload, { [styles.uploading]: isLoading })}
          onClick={() => this.uploadFile()}
        >
          <Icon name="upload" size={48} type="dark" />
          <p className={styles.word}>Please click to select file upload</p>
          <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
          {loading && <div className={styles.loading} />}
        </div>
        <div className={styles.operateWord}>
          View the{' '}
          <sapn onClick={() => this.setCreateStep(3)} className={styles.link}>
            《AppCenter Develop Guide》
          </sapn>{' '}
          and learn how to make config files
        </div>
        {errorMsg && (
          <div className={styles.errorNote}>
            <Icon name="error" size={24} />
            {errorMsg}
          </div>
        )}
        <div className={styles.errotNote}>
          <label onClick={() => this.setCreateStep(1)} className={styles.stepOperate}>
            ← Back
          </label>
        </div>
      </div>
    );
  }

  renderCreatedApp() {
    return (
      <div className={styles.stepContent}>
        <div className={styles.stepName}>Congratulations!</div>
        <div className={styles.stepExplain}>Your application has been created.</div>
        <div className={styles.checkImg}>
          <label>
            <Icon name="check" size={48} />
          </label>
        </div>
        <div className={styles.operateBtn}>
          <Button type="primary">Deploy & Test</Button>
          <Button>View in Store</Button>
        </div>
        <div className={styles.operateWord}>
          Also you can{' '}
          <sapn onClick={() => this.setCreateStep(2)} className={styles.link}>
            go back
          </sapn>{' '}
          and reload application package.
        </div>
      </div>
    );
  }

  render() {
    const { createStep } = this.props.appCreateStore;

    return (
      <Layout>
        <Grid>
          {createStep === 1 && this.renderSelectRepo()}
          {createStep === 2 && this.renderUploadPackage()}
          {createStep === 3 && this.renderCreatedApp()}
        </Grid>
      </Layout>
    );
  }
}
