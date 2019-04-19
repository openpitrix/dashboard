import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from '../index.scss';

export default function warpField(WrappedComponent) {
  if (!WrappedComponent) return null;

  const displayName = `Field-${WrappedComponent.displayName
    || WrappedComponent.name
    || 'unkown'}`;

  class Field extends PureComponent {
    static displayName = displayName;

    static propTypes = {
      className: PropTypes.string,
      label: PropTypes.string,
      labelType: PropTypes.oneOf(['normal', 'title']),
      layout: PropTypes.oneOf(['horizon', 'vertical', 'inline'])
    };

    get isTextArea() {
      return displayName.includes('Filed-TextArea');
    }

    get isCheckbox() {
      return displayName.includes('Checkbox');
    }

    get layout() {
      return this.props.layout || 'horizon';
    }

    get labelType() {
      return this.props.labelType || 'normal';
    }

    renderLabel() {
      const { label, name } = this.props;
      if (!label) {
        return null;
      }

      return (
        <label htmlFor={name} className={styles[this.labelType]}>
          {label}
        </label>
      );
    }

    renderContent() {
      const {
        name,
        label,
        labelType,
        iconLeft,
        iconRight,
        ...restProps
      } = this.props;

      return (
        <div className={styles.control}>
          <WrappedComponent {...restProps} name={name} id={name} />
        </div>
      );
    }

    renderHelp() {
      const { help } = this.props;
      if (!help) {
        return null;
      }
      return <div className={styles.help}>{help}</div>;
    }

    render() {
      const { className } = this.props;

      return (
        <div
          className={classnames(
            styles.field,
            styles[this.layout],
            {
              [styles.checkboxField]: this.isCheckbox,
              [styles.textareaField]: this.isTextArea
            },
            className
          )}
        >
          {this.renderLabel()}
          {this.renderContent()}
          {this.renderHelp()}
        </div>
      );
    }
  }

  return Field;
}
