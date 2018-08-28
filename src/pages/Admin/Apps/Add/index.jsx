import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import { isNumber } from 'lodash';

import { Icon, Button, Upload } from 'components/Base';
import Layout, { Grid } from 'components/Layout';
import RepoList from './RepoList';
import StepContent from 'StepContent';

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

  constructor(props) {
    super(props);

    const setFileStatus = (file, fileStatus) => {
      const fileId = file.uid;
      const currentFile = this.state.files[fileId];
      this.setState({
        files: Object.assign({}, this.state.files, {
          [fileId]: Object.assign({}, currentFile, fileStatus)
        })
      });
    };

    this.uploaderProps = {
      name: 'foo',
      action: '/api/upload',
      data: { a: 1, b: 2 },
      multiple: true,
      headers: {
        authorization: 'authorization-text'
      },
      beforeUpload(file) {},
      onSuccess(res, file) {
        setFileStatus(file, {
          showProgress: false,
          showFile: true,
          percentage: 100,
          status: 'active'
        });
      },
      onError(err, res, file) {
        setFileStatus(file, {
          showProgress: true,
          showFile: false,
          status: 'exception'
        });
      }
    };

    this.state = {
      files: {}
    };
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

  selectRepoNext = length => {
    length > 0 ? this.setCreateStep(2) : null;
  };

  onChange = repoId => {
    const { repoStore } = this.props;
    const { repos } = repoStore;
    for (let i = 0; i < repos.length; i++) {
      if (repos[i].repo_id === repoId) {
        repos[i].active = !repos[i].active;
        repoStore.repos[i] = { ...repos[i] };
        break;
      }
    }
  };

  uploadFile = () => {
    const { appCreateStore } = this.props;
    appCreateStore.isLoading = !appCreateStore.isLoading;
  };

  renderSelectRepo() {
    const { repos } = this.props.repoStore;
    const publicRepos = repos.filter(repo => repo.visibility === 'public');
    const privateRepos = repos.filter(repo => repo.visibility === 'private');
    const selectRepos = repos.filter(repo => repo.active);
    const name = 'Create New Application';
    const explain = 'Select a Repo to store your application';

    return (
      <StepContent name={name} explain={explain}>
        <div>
          <div>
            <RepoList type="public" repos={publicRepos} onChange={this.onChange} />
            <RepoList type="private" repos={privateRepos} onChange={this.onChange} />
          </div>
          <div
            onClick={() => this.selectRepoNext(selectRepos.length)}
            className={classNames(styles.stepOperate, { [styles.noClick]: !selectRepos.length })}
          >
            Next →
          </div>
        </div>
      </StepContent>
    );
  }

  renderUploadPackage() {
    const { isLoading, errorMsg } = this.props.appCreateStore;
    const name = 'Create New Application';
    const explain = 'Upload Package';

    return (
      <StepContent name={name} explain={explain}>
        <div>
          <Upload {...this.uploaderProps}>
            <div className={classNames(styles.upload, { [styles.uploading]: isLoading })}>
              <Icon name="upload" size={48} type="dark" />
              <p className={styles.word}>Please click to select file upload</p>
              <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
              {loading && <div className={styles.loading} />}
            </div>
          </Upload>

          <div className={styles.operateWord}>
            View the
            <span onClick={() => this.setCreateStep(3)} className={styles.link}>
              《AppCenter Develop Guide》
            </span>
            and learn how to make config files
          </div>
          {errorMsg && (
            <div className={styles.errorNote}>
              <Icon name="error" size={24} />
              {errorMsg}
            </div>
          )}
          <div onClick={() => this.setCreateStep(1)} className={styles.stepOperate}>
            ← Back
          </div>
        </div>
      </StepContent>
    );
  }

  renderCreatedApp() {
    const name = 'Congratulations';
    const explain = 'Your application has been created.';

    return (
      <StepContent name={name} explain={explain}>
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
          Also you can
          <span onClick={() => this.setCreateStep(2)} className={styles.link}>
            go back
          </span>
          and reload application package.
        </div>
      </StepContent>
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
