import { BrowserRouter } from 'react-router-dom';

import AppList from 'components/AppList';

describe('AppList', () => {
  const props = {
    apps: [
      {
        app_id: 'app-lgmAg4qW13OQ',
        name: 'Wordpress',
        app_version_types: 'vmbased',
        company_name: 'QingClound',
        description: 'test',
        icon: ''
      }
    ],
    fixNav: true
  };

  it('basic render', () => {
    const wrapper = render(
      <BrowserRouter>
        <AppList {...props} />
      </BrowserRouter>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('has search', () => {
    const newProps = {
      search: 'app',
      apps: []
    };
    const wrapper = render(
      <BrowserRouter>
        <AppList {...Object.assign(props, newProps)} />
      </BrowserRouter>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
