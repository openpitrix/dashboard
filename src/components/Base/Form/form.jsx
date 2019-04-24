import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { getFormData } from 'utils';

import styles from './index.scss';

export default class Form extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    labelType: PropTypes.oneOf(['normal', 'title']),
    layout: PropTypes.oneOf(['horizon', 'vertical', 'inline']),
    onSubmit: PropTypes.func
  };

  static defaultProps = {
    className: '',
    labelType: 'normal',
    layout: 'horizon'
  };

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(e, getFormData(this.formRef.current));
  };

  get formClass() {
    return classnames(
      styles.form,
      {
        [styles.noPaddingForm]: this.props.noPadding
      },
      this.props.className
    );
  }

  render() {
    const {
      children, layout, labelType, ...restProps
    } = this.props;

    const childNodes = React.Children.map(children, (child = {}) => {
      const isField = _.invoke(child, 'type.displayName.includes', 'Field');
      const className = classnames(
        styles.formItem,
        _.get(child, 'props.className')
      );
      let props = {
        ...child.props,
        className
      };
      if (isField) {
        props = Object.assign(
          {
            layout,
            labelType
          },
          props
        );
      }
      return React.cloneElement(child, props);
    });

    return (
      <form
        {...restProps}
        className={this.formClass}
        ref={this.formRef}
        onSubmit={this.handleSubmit}
      >
        {childNodes}
      </form>
    );
  }
}
