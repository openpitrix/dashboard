import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';

import { Icon } from 'components/Base';

import styles from './index.scss';

@withTranslation()
@observer
export default class UploadShow extends Component {
  static propTypes = {
    className: PropTypes.string,
    errorMessage: PropTypes.string,
    fileName: PropTypes.string,
    isLoading: PropTypes.bool,
    uploadStatus: PropTypes.string
  };

  render() {
    const {
      className,
      isLoading,
      errorMessage,
      uploadStatus,
      fileName,
      t
    } = this.props;

    if (isLoading) {
      return (
        <div className={classnames(styles.uploading, className)}>
          <Icon name="loading" size={48} type="dark" className={styles.icon} />
          <p className={styles.note}>{t('file_format_loading')}</p>
        </div>
      );
    }

    return (
      <div
        className={classnames(className, styles.uploadShow, {
          [styles.bodyBg]: !!errorMessage
        })}
      >
        {uploadStatus !== 'ok' && !errorMessage && (
          <div>
            <Icon name="upload" size={48} type="dark" className={styles.icon} />
            <p className={styles.note}>{t('file_format_note')}</p>
          </div>
        )}

        {uploadStatus !== 'ok' && errorMessage && (
          <div className={styles.uploadError}>
            <Icon name="error" size={48} className={styles.icon} />
            <p>
              {errorMessage}
              <span className={styles.errorLink}>「{t('Upload again')}」</span>
            </p>
          </div>
        )}
        {uploadStatus === 'ok' && !errorMessage && (
          <div className={styles.uploadSuccess}>
            <Icon name="checked-circle" size={48} className={styles.icon} />
            <p className={styles.successText}>
              {t('File')}
              <span className={styles.uploadFileName}>{fileName}</span>
              {t('Successful upload')}
            </p>
          </div>
        )}
      </div>
    );
  }
}
