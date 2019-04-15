import NoteLink from 'components/NoteLink';

describe('Component NoteLink', () => {
  it('basic render', () => {
    expect(
      NoteLink({
        className: 'test',
        noteWord: 'note',
        linkWord: 'link',
        link: '/'
      })
    ).toMatchSnapshot();
  });
});
