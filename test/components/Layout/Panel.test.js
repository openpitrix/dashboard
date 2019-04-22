import Panel from 'components/Layout/Panel';

describe('Layout/Panel', () => {
  it('basic render', () => {
    const wrapper = render(
      <Panel className="test">
        <div>test</div>
      </Panel>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
