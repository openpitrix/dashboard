import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { observable } from 'mobx';

import Stepper from 'components/Layout/Stepper';

const renderPage = (store, props) => (
  <Provider rootStore={store}>
    <BrowserRouter>
      <Stepper {...props}>
        <div>test</div>
      </Stepper>
    </BrowserRouter>
  </Provider>
);

describe('Layout/Stepper', () => {
  let store,
    props;

  beforeAll(() => {
    store = observable.object({
      user: {}
    });

    props = {
      name: 'CREATE_APP',
      stepOption: {
        disableNextStep: true,
        nextStep: jest.fn(),
        stepBase: 1,
        activeStep: 1,
        steps: 3
      }
    };
  });

  it('basic render', () => {
    const wrapper = render(renderPage(store, props));

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('basic render activeStep more than the steps', () => {
    props = {
      name: 'CREATE_APP',
      stepOption: {
        activeStep: 4,
        steps: 3
      }
    };

    const wrapper = render(renderPage(store, props));

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
