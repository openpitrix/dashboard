import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import styles from './index.scss';

export default class Search extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func
  };

  static defaultProps = {
    className: '',
    onSearch: val => {}
  };

  state = {
    value: ''
  };

  handleInputChange = e => {
    this.setState({ value: e.target.value });
  };

  handleOnKeyDown = e => {
    if (e.key === 'Enter') {
      this.props.onSearch(this.state.value);
    }
  };

  handleClear = () => {
    this.setState({ value: '' });
  };

  render() {
    const { className, placeholder } = this.props;
    const { value } = this.state;
    return (
      <div className={classnames(styles.inputGroup, className)}>
        <Icon name="search" />
        <input
          className={styles.input}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={this.handleInputChange}
          onKeyDown={this.handleOnKeyDown}
        />
        {value && <Icon name="close" onClick={this.handleClear} />}
      </div>
    );
  }
}
