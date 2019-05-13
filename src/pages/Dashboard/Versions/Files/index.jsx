import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';
import { Base64 } from 'js-base64';
// import CodeMirror from 'react-codemirror';

import { Image, Button } from 'components/Base';
import Layout, { Grid, Section } from 'components/Layout';
import { EDIT_VERSION_STATUS } from 'config/version.js';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore,
  user: rootStore.user
}))
@observer
export default class VersionDetail extends Component {
  state = {
    selectIndex: 0
  };

  async componentDidMount() {
    const { appStore, appVersionStore, match } = this.props;
    const { versionId, appId } = match.params;

    await appStore.fetch(appId);
    await appVersionStore.fetchPackageFiles(versionId);
    await appVersionStore.fetch(versionId);
  }

  changeName = index => {
    this.setState({
      selectIndex: index
    });
  };

  changeFile = e => {
    const value = e.target.value;
    const { appVersionStore } = this.props;
    const { allFiles } = appVersionStore;
    const { selectIndex } = this.state;
    const file = allFiles[selectIndex];
    allFiles.splice(selectIndex, 1, {
      name: file.name,
      content: value
    });
  };

  modifyFile = () => {
    const { appVersionStore } = this.props;
    const { selectIndex } = this.state;
    const { version, allFiles, modifyPackageFiles } = appVersionStore;
    const file = allFiles[selectIndex];
    modifyPackageFiles(version.version_id, {
      [file.name]: Base64.encode(file.content)
    });
  };

  renderFileNames() {
    const { appVersionStore } = this.props;
    const { allFiles } = appVersionStore;
    const { selectIndex } = this.state;

    return (
      <Section size={3} className={styles.fileNames}>
        <ul>
          {allFiles.map((item, index) => (
            <li
              key={item.name}
              onClick={() => this.changeName(index)}
              className={classnames({ [styles.active]: index === selectIndex })}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  render() {
    const {
      appStore, appVersionStore, user, t
    } = this.props;
    const { version, allFiles } = appVersionStore;
    const { appDetail } = appStore;
    const { selectIndex } = this.state;
    const isEdit = EDIT_VERSION_STATUS.includes(version.status) && user.isDevPortal;

    return (
      <Layout
        className={styles.versionFiles}
        pageTitle={t('Version Files')}
        hasBack
      >
        <div className={styles.header}>
          <span className={styles.image}>
            <Image
              src={appDetail.icon}
              iconLetter={appDetail.name}
              iconSize={48}
            />
          </span>
          <span className={styles.appName}>
            {appDetail.name}&nbsp;/&nbsp;{version.name}
          </span>
          {isEdit && (
            <label className="pull-right">
              <Button type="primary" onClick={this.modifyFile}>
                {t('Save')}
              </Button>
            </label>
          )}
        </div>
        <Grid className={styles.container}>
          {this.renderFileNames()}
          <Section size={9}>
            <div className={styles.fileContent}>
              {/* <CodeMirror
                code={code}
                onChange={this.changeFile}
                className={styles.code}
              /> */}
              <textarea
                className={classnames({ [styles.readOnly]: !isEdit })}
                onChange={this.changeFile}
                value={_.get(allFiles, `${selectIndex}.content`)}
                readOnly={!isEdit}
              />
            </div>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
