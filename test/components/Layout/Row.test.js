import Row from 'components/Layout/Grid/row';

describe('Layout/Row', () => {
  it('basic render', () => {
    const wrapper = render(
      <Row className="test">
        <div>test</div>
      </Row>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
