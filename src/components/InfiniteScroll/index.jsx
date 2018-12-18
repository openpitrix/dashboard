import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Loading from 'components/Loading';

export default class InfiniteScroll extends Component {
  static propTypes = {
    className: PropTypes.string,
    hasMore: PropTypes.bool,
    initialLoad: PropTypes.bool,
    isLoading: PropTypes.bool,
    loadMore: PropTypes.func.isRequired,
    loader: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    pageStart: PropTypes.number,
    threshold: PropTypes.number,
    useCapture: PropTypes.bool,
    useWindow: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    hasMore: false,
    loadMore: _.noop,
    initialLoad: false,
    isLoading: true,
    loader: <Loading isLoading />,
    pageStart: 0,
    threshold: 250,
    useCapture: true,
    useWindow: true
  };

  constructor(props) {
    super(props);

    this.setContainerRef = element => {
      this.containerRef = element;
    };
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
    this.detachMousewheelListener();
  }

  attachScrollListener() {
    const {
      hasMore, isLoading, initialLoad, useCapture
    } = this.props;

    // Don't attach event listeners if we have no more items to load or when it's loaing
    if (!hasMore || isLoading) {
      return;
    }

    const scrollEl = this.getParentElement();
    scrollEl.addEventListener(
      'mousewheel',
      this.mousewheelListener,
      useCapture
    );
    scrollEl.addEventListener('scroll', this.scrollListener, useCapture);
    scrollEl.addEventListener('resize', this.scrollListener, useCapture);

    if (initialLoad) {
      this.scrollListener();
    }
  }

  scrollListener = () => {
    const { loadMore, threshold } = this.props;

    const container = this.getScrollableElement();

    const offset = this.getOffsetTop();

    if (
      offset < Number(threshold)
      && (container && container.offsetParent !== null)
    ) {
      this.detachScrollListener();
      loadMore((this.pageLoaded += 1));
    }
  };

  mousewheelListener(e) {
    // Prevents Chrome hangups.
    // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
    if (e.deltaY === 1) {
      e.preventDefault();
    }
  }

  detachMousewheelListener() {
    const { useCapture } = this.props;

    const scrollEl = this.getParentElement();
    scrollEl.removeEventListener(
      'mousewheel',
      this.mousewheelListener,
      useCapture
    );
  }

  detachScrollListener() {
    const { useCapture } = this.props;

    const scrollEl = this.getParentElement();
    scrollEl.removeEventListener('scroll', this.scrollListener, useCapture);
    scrollEl.removeEventListener('resize', this.scrollListener, useCapture);
  }

  getScrollableElement() {
    return this.props.useWindow === false ? this.containerRef : window;
  }

  getParentElement() {
    return this.props.useWindow === false
      ? this.containerRef.parentNode
      : window;
  }

  getOffsetTop() {
    const { useWindow, threshold } = this.props;
    if (!this.containerRef) return threshold + 1;

    const container = this.getScrollableElement();
    const parent = this.getParentElement();

    let offset;
    if (useWindow) {
      const doc = document.documentElement || document.body.parentNode || document.body;
      const scrollTop = container.pageYOffset !== undefined
        ? container.pageYOffset
        : doc.scrollTop;
      offset = this.calculateOffset(container, scrollTop);
    } else {
      offset = container.scrollHeight - parent.scrollTop - parent.clientHeight;
    }
    return offset;
  }

  calculateOffset(el, scrollTop) {
    if (!el) {
      return 0;
    }

    return (
      this.calculateTopPosition(this.containerRef)
      + (this.containerRef.offsetHeight - scrollTop - window.innerHeight)
    );
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  renderLoadMore() {
    const renderProps = this.props;
    const { hasMore, loader, threshold } = renderProps;
    const offset = this.getOffsetTop();
    if (!hasMore || offset > threshold) return null;
    return loader;
  }

  render() {
    const {
      children,
      hasMore,
      initialLoad,
      isLoading,
      loader,
      loadMore,
      pageStart,
      threshold,
      useCapture,
      useWindow,
      ...props
    } = this.props;

    return (
      <div ref={this.setContainerRef} {...props}>
        {children}
        {this.renderLoadMore()}
      </div>
    );
  }
}
