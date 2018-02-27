import React from 'react';
import styles from './index.scss';

export default class Timeline extends React.Component {
  render() {
    return (
      <div className={styles.timeline}>
        {this.props.children}
      </div>
    );
  }
}
