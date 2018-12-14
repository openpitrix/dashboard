import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './index.scss';
import typeFiles from './files';

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
                {file.description}
              </div>
            </li>
          ))}
        </ul>
        {uploadStatus === 'init' && <div className={styles.configMask} />}
        {isShowNote && (
          <div className={styles.document}>
            <span className={styles.note}>{t('Note')}</span>
            {t('See the complete app development specification')}
            <Link to="#">
              《{(_.find(typeFiles, { value: type }) || {}).name}
              {t('specification and app development')}
              》
            </Link>。
          </div>
        )}
      </div>
    );
  }
}
