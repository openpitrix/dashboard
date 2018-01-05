import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Search extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
  }

  state = {
    value: '',
  }

  handleInputChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleOnKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(this.state.value);
    }
  }

  handleClear = () => {
    this.setState({ value: '' });
  }

  render() {
    const { className, placeholder } = this.props;
    const { value } = this.state;
    return (
      <div className={classnames(styles.search, className)}>
        <i className="fa fa-search"/>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={this.handleInputChange}
          onKeyDown={this.handleOnKeyDown}
        />
        {value && <i className="fa fa-times" onClick={this.handleClear}/>}
      </div>
    );
  }
}
