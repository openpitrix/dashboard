import React from 'react';
import PropTypes from 'prop-types';

export default class WrapperComp extends React.Component {
  static propTypes = {
    match: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.match.url !== this.props.match.url;
  }

  render() {
    const { comp: Comp, ...rest } = this.props;
    return <Comp {...rest} />;
  }
}
