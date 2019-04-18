import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default function warpField(WrappedComponent) {
  if (!WrappedComponent) return null;

  const displayName = `Filed-${WrappedComponent.displayName
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

    static defaultProps = {
      labelType: 'normal',
      layout: 'horizon'
    };

    get isTextArea() {
      return displayName === 'Filed-TextArea';
    }

    renderLabel() {
      const { label, labelType, name } = this.props;
      if (!label) {
        return null;
      }

      return (
        <label htmlFor={name} className={styles[labelType]}>
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
      const { layout, name } = this.props;
      if (!name) {
        return null;
      }

      return (
        <div
          className={classnames(styles.field, styles[layout], {
            [styles.textareaField]: this.isTextArea
          })}
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
