import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import styles from './index.scss';

export default class Search extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClear: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string
  };

  static defaultProps = {
    className: '',
    onSearch: () => {},
    onClear: () => {},
    value: ''
  };

  state = {
    value: this.props.value
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
    this.setState({ value: '' }, this.props.onClear);
  };

  render() {
    const { className, placeholder } = this.props;
    const { value } = this.state;

    return (
      <div className={classnames(styles.inputGroup, className)}>
        <Icon name="magnifier" type="dark" />
        <input
          className={styles.input}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={this.handleInputChange}
          onKeyDown={this.handleOnKeyDown}
          data-cy="search-box"
        />
        {value && (
          <Icon
            name="close"
            size={24}
            className={styles.close}
            onClick={this.handleClear}
          />
        )}
      </div>
    );
  }
}
