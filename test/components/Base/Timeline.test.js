import Icon from 'components/Base/Icon';
import Timeline from 'components/Base/Timeline';

describe('Base/Timeline', () => {
  it('basic render', () => {
    const wrapper = render(
      <Timeline className="test">
        <Timeline.Item dot={<Icon name="stop" />}>123</Timeline.Item>
        <Timeline.Item dot={<Icon name="refresh" />}>456</Timeline.Item>
        <Timeline.Item color="blue">789</Timeline.Item>
      </Timeline>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
