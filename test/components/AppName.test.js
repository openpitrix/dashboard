import { BrowserRouter } from 'react-router-dom';

import AppName from 'components/AppName';

describe('AppName', () => {
  const props = {
    icon: 'icon',
    linkUrl: '',
    name: 'Wordpreww',
    versionName: '1.0.0'
  };

  it('basic render', () => {
    const wrapper = render(<AppName {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('has link url', () => {
    props.type = 'vm';
    props.linkUrl = '/app/app-id';
    const wrapper = render(
      <BrowserRouter>
        <AppName {...props} />
      </BrowserRouter>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
