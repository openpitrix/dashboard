import Section from 'components/Layout/Grid/Section';

describe('Layout/Section', () => {
  it('basic render', () => {
    const wrapper = render(
      <Section className="test" size={8} offset={4}>
        <div>test</div>
      </Section>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
