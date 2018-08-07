import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';
import { translate } from 'react-i18next';

import styles from './index.scss';

@translate()
export default class TagNav extends Component {
  static propTypes = {
    tags: PropTypes.array,
    changeTag: PropTypes.func,
    defaultTag: PropTypes.string
  };

  static defaultProps = {
    changeTag: noop,
    tags: [],
    defaultTag: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      curTag: props.defaultTag || props.tags[0]
    };
  }

  componentDidMount() {
    const { curTag } = this.state;
    curTag && this.props.changeTag(curTag);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.curTag !== this.state.curTag;
  }

  handleChange = tag => {
    this.setState({ curTag: tag });
  };

  componentDidUpdate() {
    this.props.changeTag(this.state.curTag);
  }

  render() {
    const { tags, t } = this.props;
    const { curTag } = this.state;

    return (
      <div className={styles.tagNav}>
        {tags.map((tag, idx) => (
          <div
            className={classnames(styles.tag, { [styles.active]: tag === curTag })}
            key={idx}
            onClick={() => this.handleChange(tag)}
          >
            {t(tag)}
          </div>
        ))}
      </div>
    );
  }
}
