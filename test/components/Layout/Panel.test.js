import Panel from 'components/Layout/Grid/Row';

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
