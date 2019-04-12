import LessText from 'components/LessText';

describe('Component LessText', () => {
  it('basic render', () => {
    expect(
      LessText({
        text: 'wordwordwordwordword',
        limit: 10
      })
    ).toMatchSnapshot();
  });
});
