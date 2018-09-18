import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Icon, Button, Upload } from 'components/Base';
import Layout, { Grid } from 'components/Layout';
import RepoList from './RepoList';
import StepContent from './StepContent';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  repoStore: rootStore.repoStore
}))
@observer
export default class AppAdd extends Component {
  static async onEnter({ repoStore }) {
    await repoStore.fetchAll({ noLimit: true });
  }

  constructor(props) {
    super(props);
    const { appStore } = this.props;
    appStore.createStep;
    appStore.createError = '';
  }

  componentWillUnmount() {
    const { repoStore } = this.props;
    repoStore.loadPageInit();
  }

  setCreateStep = step => {
    window.scroll({ top: 0, behavior: 'smooth' });
    const { appStore } = this.props;
    const { setCreateStep, createStep, createError } = appStore;
    step = step ? step : createStep - 1;
    appStore.createError = '';
    if (step) {
      setCreateStep(step);
    } else {
      history.back();
    }
  };

  selectRepoNext = length => {
    length > 0 ? this.setCreateStep(2) : null;
  };

  onChange = repoId => {
    const { repoStore, appStore } = this.props;
    const { repos } = repoStore;

    appStore.createReopId = repoId;
    repos.forEach(repo => {
      if (repo.repo_id === repoId) {
        repo.active = true;
      } else {
        repo.active = false;
      }
    });
  };

  checkFile = file => {
    let result = true;
    const { appStore } = this.props;
    const maxsize = 2 * 1024 * 1024;

    if (!/\.(tar|tar\.gz|tra\.bz|zip|tgz)$/.test(file.name.toLocaleLowerCase())) {
      appStore.createError = 'The file format supports TAR, TAR.GZ, TAR.BZ,TGZ and ZIP';
      return false;
    } else if (file.size > maxsize) {
      appStore.createError = 'The file size cannot exceed 2M';
      return false;
    }

    return result;
  };

  uploadFile = (base64Str, file) => {
    const { appStore } = this.props;
    appStore.uploadFile = base64Str;
    appStore.createOrModify();
  };

  renderSelectRepo() {
    const { repos } = this.props.repoStore;
    const publicRepos = repos.filter(repo => repo.visibility === 'public');
    const privateRepos = repos.filter(repo => repo.visibility === 'private');
    const selectRepos = repos.filter(repo => repo.active);
    const name = 'Create New Application';
    const explain = 'Select a Repo to store your application';

    return (
      <StepContent name={name} explain={explain} className={styles.createVersion}>
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
      </StepContent>
    );
  }

  renderUploadPackage() {
    const { isLoading, createError } = this.props.appStore;
    const name = 'Create New Application';
    const explain = 'Upload Package';

    return (
      <StepContent name={name} explain={explain} className={styles.createVersion}>
        <Upload checkFile={this.checkFile} uploadFile={this.uploadFile}>
          <div className={classNames(styles.upload, { [styles.uploading]: isLoading })}>
            <Icon name="upload" size={48} type="dark" />
            <p className={styles.word}>Please click to select file upload</p>
            <p className={styles.note}>The file format supports TAR, TAR.GZ, TAR.BZ and ZIP</p>
            {isLoading && <div className={styles.loading} />}
          </div>
        </Upload>

        <div className={styles.operateWord}>
          View the
          <span className={styles.link}>《Openpitrix Develop Guide》</span>
          and learn how to make config files
        </div>
        {createError && (
          <div className={styles.errorNote}>
            <Icon name="error" size={24} />
            {createError}
          </div>
        )}
      </StepContent>
    );
  }

  renderCreatedApp() {
    const { createAppId } = this.props.appStore;
    const name = 'Congratulations';
    const explain = 'Your application has been created.';

    return (
      <StepContent name={name} explain={explain} className={styles.createVersion}>
        <div className={styles.checkImg}>
          <label>
            <Icon name="check" size={48} />
          </label>
        </div>
        <div className={styles.operateBtn}>
          <Link to={`/dashboard/store/${createAppId}/deploy`}>
            <Button type="primary">Deploy & Test</Button>
          </Link>
          <Link to={`/store/${createAppId}`}>
            <Button>View in Store</Button>
          </Link>
        </div>
        <div className={styles.operateWord}>
          Also you can
          <span onClick={() => this.setCreateStep(2)} className={styles.link}>
            &nbsp;go back&nbsp;
          </span>
          and reload application package.
        </div>
      </StepContent>
    );
  }

  render() {
    const { createStep } = this.props.appStore;

    return (
      <div className={styles.createApp}>
        <div className={styles.operate}>
          <label onClick={() => this.setCreateStep()}>←&nbsp;Back</label>
          <label className="pull-right" onClick={() => history.back()}>
            <Icon name="close" size={24} type="dark" />&nbsp;Esc
          </label>
        </div>
        {createStep === 1 && this.renderSelectRepo()}
        {createStep === 2 && this.renderUploadPackage()}
        {createStep === 3 && this.renderCreatedApp()}
      </div>
    );
  }
}
