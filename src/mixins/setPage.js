import { Component, createElement } from 'react';
import _ from 'lodash';
import qs from 'query-string';

function createSetPage(storeName, component) {
  const displayName = `setPage-${component.displayName
    || component.name
    || 'unkown'}`;

  class Injector extends Component {
    static displayName = displayName;

    constructor(props) {
      super(props);
      const store = this.props[storeName];
      const values = qs.parse(this.props.location.search);
      const currentPage = Number(values.page);
      if (!_.isNaN(currentPage)) {
        store.currentPage = currentPage;
      }
    }

    render() {
      return createElement(component, this.props);
    }
  }

  return Injector;
}

const setPage = store => componentClass => createSetPage(store, componentClass);

export default setPage;
