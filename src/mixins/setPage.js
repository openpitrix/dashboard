import React, { Component } from 'react';
import _ from 'lodash';
import qs from 'query-string';

function createSetPage(storeName, WrapComponent) {
  const displayName = `setPage-${WrapComponent.displayName
    || WrapComponent.name
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
      const { keyword, reverse } = values;
      if (keyword) {
        store.searchWord = keyword;
      }
      store.reverse = reverse !== '0';
    }

    render() {
      return <WrapComponent {...this.props} />;
    }
  }

  return Injector;
}

const setPage = store => componentClass => createSetPage(store, componentClass);

export default setPage;
