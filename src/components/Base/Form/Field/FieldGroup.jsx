import React from 'react';
import classnames from 'classnames';

import styles from './index.scss';

export default function FieldGroup(props) {
  return (
    <div className={classnames(styles.fieldGroup, props.className)}>
      {props.children}
    </div>
  );
}
