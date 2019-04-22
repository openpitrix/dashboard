import Grid from 'components/Layout/Grid';

describe('Layout/Grid', () => {
  it('basic render', () => {
    const wrapper = render(
      <Grid className="test">
        <div>test</div>
      </Grid>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
