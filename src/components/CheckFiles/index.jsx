import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import styles from './index.scss';

@translate()
export default class CheckFiles extends PureComponent {
  static propTypes = {
    files: PropTypes.array
  };

  static defaultProps = {
    files: []
  };

  render() {
    const { files, t } = this.props;

    return (
      <ul className={styles.checkFiles}>
        {files.map(file => (
          <li key={file.name} className={classnames([styles[file.check]])}>
            <span className={styles.name}>{file.name}</span>
            <span className={styles.description}>
              #&nbsp;&nbsp;
              {file.isOptional && <span>[可选]&nbsp;&nbsp;</span>}
              {file.description}
            </span>
          </li>
        ))}
      </ul>
    );
  }
}
