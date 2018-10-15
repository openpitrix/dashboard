import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { find } from 'lodash';

import styles from './index.scss';

@translate()
export default class GroupCard extends Component {
  static propTypes = {
    groups: PropTypes.array,
    selectValue: PropTypes.string,
    selectCard: PropTypes.func
  };

  static defaultProps = {
    groups: [],
    selectValue: '' // default select
  };

  constructor(props) {
    super(props);

    this.state = {
      curVal: props.selectValue
    };
  }

  componentDidMount() {
    /*const { groups } = this.props;
    const { curVal } = this.state;

    this.props.selectCard(find(groups, { value: curVal }));*/
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.curVal !== this.state.curVal;
  }

  handleChange = ({ value }) => {
    this.setState({ curVal: value });
  };

  componentDidUpdate() {
    const { groups } = this.props;
    const { curVal } = this.state;

    this.props.selectCard(find(groups, { value: curVal }));
  }

  render() {
    const { groups, t } = this.props;
    const { curVal } = this.state;

    return (
      <ul className={styles.groupCard}>
        {groups.map((data, index) => (
          <li
            key={data.id || index}
            onClick={() => {
              this.handleChange(data);
            }}
            className={classnames({ [styles.current]: data.value === curVal })}
          >
            <div className={styles.name}>{t(data.name)}</div>
            {data.id && <div className={styles.id}>id:{data.id}</div>}
            <div className={styles.description}>{t(data.description)}</div>
          </li>
        ))}
      </ul>
    );
  }
}
