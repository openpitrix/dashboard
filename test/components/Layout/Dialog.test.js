import Dialog from 'components/Layout/Dialog';

describe('Layout/Dialog', () => {
  it('basic render', () => {
    const wrapper = <Dialog />;

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
