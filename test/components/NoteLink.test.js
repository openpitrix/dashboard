import NoteLink from 'components/NoteLink';

describe('Component NoteLink', () => {
  it('basic render', () => {
    const wrapper = render(
      <NoteLink noteWord="note" linkWord="link" link="/" />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
