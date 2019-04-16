import ErrorBoundary from 'components/ErrorBoundary';

describe('Component ErrorBoundary ', () => {
  it('basic render', () => {
    const wrapper = render(
      <ErrorBoundary>
        <div>error test</div>
      </ErrorBoundary>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
