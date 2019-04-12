import Can from 'components/Can';

describe('Can', () => {
  it('basic render', () => {
    const wrapper = render(
      <Can>
        <div>show content</div>
      </Can>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
