import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Field from '';

const getFormField = CustomField => {
  class FormField extends Component {
    render() {
      const {
        value,
        defaultValue,
        className,
        controlClassName,
        style,
        label,
        name,
        help,
        onChange,
        schemas,
        validateIcon,
        validateOnChange,
        validateOnBlur,
        direction,
        ...restProps
      } = this.props;

      const { validateStatus, value: stateValue } = this.state;
      const { statusClass, helpContent } = this.generateStatus();

      return (
        <Field className={classNames(className)} style={style}>
          <CustomField
            name={name}
            label={label}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            value={stateValue}
            className={classNames(statusClass, controlClassName)}
            validateStatus={validateStatus}
            validateIcon={validateIcon}
            direction={direction}
            ref={n => {
              this.fieldRef = n;
            }}
          />
        </Field>
      );
    }
  }
  return FormField;
};

export default getFormField;
