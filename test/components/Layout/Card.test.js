import Card from 'components/Layout/Card';
import Panel from 'components/Layout/Panel';

describe('Layout/Card', () => {
  it('basic render', () => {
    const wrapper = render(
      <Card className="test">
        <Panel>
          <div>test</div>
        </Panel>
      </Card>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
