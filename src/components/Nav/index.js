import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default class Nav extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  handleSearch = () => {

  }

  render() {
    const { className, navs } = this.props;

    return (
      <div className={`nav ${className}`}>
        {navs.map(item => (
          <ul key={item.title} className="nav-sub">
            <p>{item.title.toUpperCase()}</p>
            {item.value.map(subItem => (
              <li key={subItem.value}>
                <a href="#" onClick={this.handleSearch}>{subItem.title}</a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    );
  }
}
