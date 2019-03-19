import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import styles from './index.scss';

@withTranslation()
export default class TableTypes extends Component {
  static propTypes = {
    activeType: PropTypes.string,
    changeType: PropTypes.func,
    className: PropTypes.string,
    types: PropTypes.array
  };

  static defaultProps = {
    changeType: _.noop,
    type: [],
    activeType: ''
  };

  constructor(props) {
    super(props);

    const activeType = _.get(props.types, '[0].value', '');
    this.state = {
      activeType: props.activeType || activeType
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.activeType !== this.state.activeType;
  }

  componentDidUpdate() {
    this.props.changeType(this.state.activeType);
  }

  handleChange = type => {
    this.setState({ activeType: type });
  };

  render() {
    const { className, types, t } = this.props;
    const { activeType } = this.state;

    return (
      <div className={classnames(styles.tableTypes, className)}>
        {types.map(type => (
          <label
            key={type.value}
            onClick={() => this.handleChange(type.value)}
            className={classnames({
              [styles.active]: activeType === type.value
            })}
          >
            {t(type.name)}
          </label>
        ))}
      </div>
    );
  }
}
