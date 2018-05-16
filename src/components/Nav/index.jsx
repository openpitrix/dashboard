import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Nav extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      curValue: 'top'
    };
  }
  changeValue = value => {
    this.setState({
      curValue: value
    });
  };

  render() {
    const { className, navs } = this.props;
    return (
      <div className={classnames(styles.nav, className)}>
        {navs &&
          navs.map(item => (
            <ul key={item.title} className={styles.subNav}>
              <p>{item.title.toUpperCase()}</p>
              {item.value.map(subItem => (
                <li
                  key={subItem.value}
                  className={classnames({
                    [styles.current]: subItem.value === this.state.curValue
                  })}
                >
                  <a
                    href={`#${subItem.value}`}
                    onClick={() => {
                      this.changeValue(subItem.value);
                    }}
                  >
                    {subItem.title}
                  </a>
                </li>
              ))}
            </ul>
          ))}
      </div>
    );
  }
}
