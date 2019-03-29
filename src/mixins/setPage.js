import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { qs2Obj } from 'utils';

function createSetPage(storeName, WrapComponent) {
  const displayName = `setPage-${WrapComponent.displayName
    || WrapComponent.name
    || 'unkown'}`;

  const originSource = {};
  const keys = ['currentPage', 'keyword', 'defaultStatus', 'activeType'];
  @withRouter
  class Injector extends Component {
    static displayName = displayName;

    constructor(props) {
      super(props);
      const store = this.props[storeName];
      const values = qs2Obj(this.props.location.search);
      const currentPage = Number(values.page);
      _.assign(originSource, _.pick(store, keys));
      if (!_.isNaN(currentPage)) {
        store.currentPage = currentPage;
      }
      const { keyword, status, activeType } = values;
      if (keyword) {
        store.searchWord = keyword;
      }

      if (status) {
        // store.defaultStatus = status; // todo: temporary remove
      }

      if (activeType) {
        store.activeType = activeType;
      }
    }

    componentDidUpdate(prevProps) {
      const search = _.get(this.props, 'location.search');
      const preSearch = _.get(prevProps, 'location.search');
      if (search === '' && preSearch !== '') {
        const store = this.props[storeName];
        _.assign(store, originSource);
        store.fetchAll();
      }
    }

    render() {
      return <WrapComponent {...this.props} />;
    }
  }

  return Injector;
}

const setPage = store => componentClass => createSetPage(store, componentClass);

export default setPage;
