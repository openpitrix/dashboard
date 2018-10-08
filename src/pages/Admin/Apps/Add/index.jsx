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
  static async onEnter({ appStore, repoStore, user }) {
    appStore.createReset();
    await repoStore.fetchAll({
      noLimit: true,
      isQueryPublic: user.isDev
    });
  }

  constructor(props) {
    super(props);
    const { appStore } = this.props;
    appStore.createStep = 1;
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

    if (!/\.(tar|tar\.gz|tar\.bz|tgz)$/.test(file.name.toLocaleLowerCase())) {
      appVersionStore.createError = 'The file format supports TAR, TAR.GZ, TAR.BZ and TGZ';
      return false;
    } else if (file.size > maxsize) {
      appVersionStore.createError = 'The file size cannot exceed 2M';
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
    const { t } = this.props;
    const { repos } = this.props.repoStore;
    const publicRepos = repos.filter(repo => repo.visibility === 'public');
    const privateRepos = repos.filter(repo => repo.visibility === 'private');
    const selectRepos = repos.filter(repo => repo.active);
    const name = t('creat_new_app');
    const explain = t('select_repo_app');

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
          {t('Next')} →
        </div>
      </StepContent>
    );
  }

  renderUploadPackage() {
    const { t } = this.props;
    const { isLoading, createError } = this.props.appStore;
    const name = t('creat_new_app');
    const explain = t('Upload Package');

    return (
      <StepContent name={name} explain={explain} className={styles.createVersion}>
        <Upload checkFile={this.checkFile} uploadFile={this.uploadFile}>
          <div className={classNames(styles.upload, { [styles.uploading]: isLoading })}>
            <Icon name="upload" size={48} type="dark" />
            <p className={styles.word}>{t('click_upload')}</p>
            <p className={styles.note}>{t('file_format_note')}</p>
            {isLoading && <div className={styles.loading} />}
          </div>
        </Upload>

        <div className={styles.operateWord}>
          {t('view_guide_1')}
          <a className={styles.link} target="_blank" href="https://docs.openpitrix.io/v0.3/zh-CN/developer-guide/">
            {t('view_guide_2')}
          </a>
          {t('view_guide_3')}
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
    const { t } = this.props;
    const { createAppId } = this.props.appStore;
    const name = t('Congratulations');
    const explain = t('app_created');

    return (
      <StepContent name={name} explain={explain} className={styles.createVersion}>
        <div className={styles.checkImg}>
          <label>
            <Icon name="check" size={48} />
          </label>
        </div>
        <div className={styles.operateBtn}>
          <Link to={`/store/${createAppId}/deploy`}>
            <Button type="primary">{t('Deploy & Test')}</Button>
          </Link>
          <Link to={`/dashboard/app/${createAppId}`}>
            <Button>{t('View detail')}</Button>
          </Link>
        </div>
        <div className={styles.operateWord}>
          {t('go_back_app_1')}
          <span onClick={() => this.setCreateStep(2)} className={styles.link}>
            {t('go_back_app_2')}
          </span>
          {t('go_back_app_3')}
        </div>
      </StepContent>
    );
  }

  render() {
    const { t } = this.props;
    const { createStep } = this.props.appStore;

    return (
      <div className={styles.createApp}>
        <div className={styles.operate}>
          <label onClick={() => this.setCreateStep()}>←&nbsp;{t('Back')}</label>
          <label className="pull-right" onClick={() => history.back()}>
            <Icon name="close" size={24} type="dark" />&nbsp;{t('Esc')}
          </label>
        </div>
        {createStep === 1 && this.renderSelectRepo()}
        {createStep === 2 && this.renderUploadPackage()}
        {createStep === 3 && this.renderCreatedApp()}
      </div>
    );
  }
}
