import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import styles from '../index.scss';

function FieldGroup(props) {
  const { layout, labelType, children } = props;
  const childNodes = React.Children.map(children, child => {
    const isField = _.invoke(child, 'type.displayName.includes', 'Field');
    const className = _.get(child, 'props.className');
    if (!child) {
      return null;
    }

    const childProps = {
      ...child.props,
      className: classnames(styles.formItem, className)
    };
    if (isField) {
      Object.assign(
        childProps,
        {
          layout,
          labelType
        },
        childProps
      );
    }

    return React.cloneElement(child, childProps);
  });

  return (
    <div className={classnames(styles.fieldGroup, props.className)}>
      {childNodes}
    </div>
  );
}

FieldGroup.displayName = 'FieldGroup';

export default FieldGroup;
