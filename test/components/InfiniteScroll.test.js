import InfiniteScroll from 'components/InfiniteScroll';

describe('Component InfiniteScroll', () => {
  it('basic render', () => {
    const wrapper = render(<InfiniteScroll isLoading>test</InfiniteScroll>);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
