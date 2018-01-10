import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class FormItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
    required: PropTypes.bool,
    help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    formData: PropTypes.object,
    labelClass: PropTypes.string,
    wrapperClass: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  handleValueChange = (e) => {
    const { formData, children } = this.props;
    const { name, onChange } = children.props;

    // validator
    if (name) {
      formData[name] = e.target.value;
    }

    onChange && onChange(e);
  }

  render() {
    const { className, children, label, help, formData, labelClass, wrapperClass } = this.props;
    const { name } = children.props;

    const classNames = classnames(styles.item, className);
    const labelClassNames = classnames(styles.label, labelClass);
    const wrapperClassNames = classnames(styles.wrapper, wrapperClass);

    const childNode = React.cloneElement(children, {
      ...children.props,
      onChange: this.handleValueChange,
      defaultValue: formData[name],
      id: name,
    });

    return (
      <div className={classNames}>
        <label htmlFor={name} className={labelClassNames}>{label}</label>
        <div className={wrapperClassNames}>
          {childNode}
          {help && <span className={styles.help}>{help}</span>}
        </div>
      </div>
    );
  }
}
