# Application architecture

## 1. React Server Side Render (aka: SSR)

### Why need server side render?

* Front and back end can share code
* Front and back routing can be handled uniformly
* Friendly to SEO

### React SSR implement methods

React's **renderToString** and **renderToStaticMarkup** methods to be more efficient for server rendering , these used to output the **component** as an **HTML string**, this is the basis for rendering on the React server.

### SSR implement code

* server code

  ```
  const components = isProd
    ? renderToString(
        <I18nextProvider i18n={i18n}>
          <Provider rootStore={ctx.store} sessInfo={sessInfo} sock={null}>
            <StaticRouter location={ctx.url} context={context}>
              <App>{renderRoutes(routes)}</App>
            </StaticRouter>
          </Provider>
        </I18nextProvider>
      )
    : null;
  ```

* Browser side

  ```
  ctx.body = renderPage({
  		    isProd,
  		    title: get(ctx.store, 'config.title'),
  		    children: components,
  		    state: JSON.stringify(ctx.store)
  });

  ...

  <div id="root">
    ${options.children ? `<div id="root">${options.children}</div>` : `<div id="root"></div>`}
  </div>
  ```

## 2. React + Mbox

React provides mechanisms to optimally render UI by using a virtual DOM that reduces the number of costly DOM mutations.

### React Compents

Project component file structure as follows

```
├── src
│   ├── components
│   │   ├── AppList
│   │   ├── Banner
│   │   ├── Base
...
│   │   ├── ToolBar
│   │   ├── UserInfo
│   │   └── VersionList
```

Component usage example

```
import React, { PureComponent } from 'react';

export default class Button extends PureComponent {
	static propTypes = {
    type: PropTypes.string,
    ...
  };

  static defaultProps = {
    type: 'default',
    ...
  };

  render() {
    const { children, type } = this.props;

    return (
      <button
        onClick={this.handleClick}
        {...others}
      >
        {children}
      </button>
    ）
  }
}
```

### React router

React router file structure as follows

```
├── src
│   ├── routes
│   │   ├── index.js
│   │   ├── renderRoute.js
│   │   └── wrapper.js
```

```

```

### Mobx

MobX provides mechanisms to optimally synchronize application state with your React components by using a reactive virtual dependency state graph that is only updated when strictly needed and is never stale.

Store file structure as follows

```
├── src
│   ├── stores
│   │   ├── app
│   │   │   ├── deploy.js
│   │   │   ├── index.js
│   │   │   └── version.js
...
│   │   ├── RoleStore.js
│   │   ├── RootStore.js
│   │   ├── Store.js
│   │   └── UserStore.js
```

The observer function / decorator can be used to turn ReactJS components into reactive components.

```
import { observable, action } from 'mobx';

@observable apps = [];

@action
fetchAll = async (params = {}) => {
	...
}

@observer
export default class Apps extends Component {
	...
}
```
