import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Form extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props);
    this._formData = props.data || {};
  }

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this._formData = nextProps.data || {};
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // validator

    this.props.onSubmit(this._formData);
  }

  getData() {
    return this._formData;
  }

  render() {
    const { className, children } = this.props;

    const classNames = classnames(styles.form, className);

    const childNodes = React.Children.map(children, child => React.cloneElement(child, {
      ...child.props, formData: this._formData }));

    return (
      <form
        className={classNames}
        onSubmit={this.handleSubmit}
      >
        {childNodes}
      </form>
    );
  }
}
