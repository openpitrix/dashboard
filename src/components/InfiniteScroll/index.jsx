import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/Loading';
import Scroll from './InfiniteScroll';

export default class InfiniteScrolllComponent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    element: PropTypes.node,
    getScrollParent: PropTypes.func,
    initialLoad: PropTypes.bool,
    isReverse: PropTypes.bool,
    ref: PropTypes.func,
    store: PropTypes.object,
    threshold: PropTypes.number,
    useCapture: PropTypes.bool,
    useWindow: PropTypes.bool
  };

  static defaultProps = {
    element: 'div',
    store: {},
    initialLoad: true,
    ref: null,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    useCapture: false,
    getScrollParent: null
  };

  render() {
    const { store, t, ...restProps } = this.props;
    const props = {
      hasMore: store.hasMore,
      pageStart: store.currentPage,
      loadMore: store.loadMore,
      loader: <Loading isLoading={true} />,
      ...restProps
    };

    return <Scroll {...props} />;
  }
}
