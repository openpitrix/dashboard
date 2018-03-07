import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

export default class Switch extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    onText: PropTypes.string,
    offText: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    type: 'primary',
    checked: false,
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      on: props.checked,
    };
  }

  toggleSwitch = () => {
    const on = !this.state.on;
    this.setState({ on }, this.props.onChange(on));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.on) {
      this.setState({ on: nextProps.checked });
    }
  }

  render() {
    const { disabled, type, onText, offText } = this.props;
    const { on } = this.state;
    const hasText = onText || offText;
    const showText = on ? onText : offText;

    return (
      <label
        className={classNames(styles.switch, styles[type], {
          [styles.disabled]: disabled,
          [styles.on]: on,
        })}
        onClick={this.toggleSwitch}
      >
        {hasText && <span className={styles.inner}>{showText}</span>}
      </label>
    );
  }
}
