import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import ReactMarkdown from 'react-markdown';
import readme from './readme.js';
import styles from './index.scss';

@observer
export default class Helm extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  render() {
    return (
      <div className={styles.body}>
        <div className={styles.markdown}>
          <ReactMarkdown source={readme} />
        </div>
      </div>
    );
  }
}
