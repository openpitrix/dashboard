import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import { versionTypes } from 'config/version-types';
import typeFiles from './files';

import styles from './index.scss';

@translate()
export default class CheckFiles extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    errorFiles: PropTypes.array,
    isShowNote: PropTypes.bool,
    type: PropTypes.string,
    uploadStatus: PropTypes.string
  };

  static defaultProps = {
    type: 'vmbased',
    errorFiles: [],
    isShowNote: false,
    uploadStatus: ''
  };

  render() {
    const {
      className,
      type,
      errorFiles,
      isShowNote,
      uploadStatus,
      t
    } = this.props;
    const files = typeFiles[type] || [];
    const linkType = (_.find(versionTypes, { value: type }) || {}).name;

    return (
      <div className={classnames(styles.checkFiles, className)}>
        <ul>
          {files.map(file => (
            <li
              key={file.name}
              className={classnames({
                [styles.error]: errorFiles.includes(file.name)
              })}
            >
              <span className={styles.name}>{file.name}</span>
              <div className={styles.description}>
                #&nbsp;&nbsp;
                {file.isOptional && <span>[{t('optional')}]&nbsp;&nbsp;</span>}
                {t(file.description)}
              </div>
            </li>
          ))}
        </ul>
        {uploadStatus === 'init' && <div className={styles.configMask} />}
        {isShowNote && (
          <div className={styles.document}>
            <span className={styles.note}>{t('Note')}</span>
            {t('See the complete app development specification')}
            <a to="#">
              《{linkType}
              {t('specification and application development')}
              》
            </a>。
          </div>
        )}
      </div>
    );
  }
}
