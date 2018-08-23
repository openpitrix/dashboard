import React from 'react';
import Loadable from 'react-loadable';

const Loading = (props) => {
  if (props.error) {
    return <div>Error: {props.error.message}</div>
  } else {
    return <div>Loading..</div>
  }
}

const loadCache={};

const load = (pathId) => {
  if(loadCache[pathId]){
    return loadCache[pathId];
  }

  console.log('register component: ', pathId);

  /*
   * webpack bug: static analyse path
   * @see: https://github.com/webpack/webpack/issues/6680
   */
  const component = Loadable({
    // use webpack magic comment to add chunk name
    loader: () => {

      console.log('preload component: ', pathId);

      // server side
      // if(typeof window === 'undefined'){
      //   return import(/* webpackChunkName = "ssr-page" */ `${pathId}/index.jsx`);
      // }

      // client side
      return import(
        /* webpackInclude: /index\.jsx$/ */
        /* webpackChunkName: "page" */
        `../pages/${pathId}/index.jsx`
        )
    },
    loading: Loading,
    // modules: [pathId],
    webpack: ()=> [require.resolveWeak(`../pages/${pathId}/index.jsx`)]
  });

  loadCache[pathId] = component;

  return component;

};

export default load;
