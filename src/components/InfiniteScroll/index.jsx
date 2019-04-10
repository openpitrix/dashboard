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
    initialLoad: true,
    isLoading: false,
    loader: <Loading isLoading />,
    pageStart: 0,
    threshold: 250,
    useCapture: false,
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

  get eventOption() {
    return { passive: false, capture: this.props.useCapture };
  }

  attachScrollListener() {
    const { hasMore, isLoading, initialLoad } = this.props;

    // Don't attach event listeners if we have no more items to load or when it's loaing
    if (!hasMore || isLoading) {
      return;
    }

    const scrollEl = this.getParentElement();
    scrollEl.addEventListener(
      'mousewheel',
      this.mousewheelListener,
      this.eventOption
    );
    scrollEl.addEventListener('scroll', this.scrollListener, this.eventOption);
    scrollEl.addEventListener('resize', this.scrollListener, this.eventOption);

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
    const scrollEl = this.getParentElement();
    scrollEl.removeEventListener(
      'mousewheel',
      this.mousewheelListener,
      this.eventOption
    );
  }

  detachScrollListener() {
    const scrollEl = this.getParentElement();
    scrollEl.removeEventListener(
      'scroll',
      this.scrollListener,
      this.eventOption
    );
    scrollEl.removeEventListener(
      'resize',
      this.scrollListener,
      this.eventOption
    );
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

  renderLoading() {
    const renderProps = this.props;
    const { loader, threshold, isLoading } = renderProps;
    const offset = this.getOffsetTop();
    if (!isLoading || offset > threshold) return null;
    return loader;
  }

  render() {
    const { className, children } = this.props;

    return (
      <div className={className} ref={this.setContainerRef}>
        {children}
        {this.renderLoading()}
      </div>
    );
  }
}
