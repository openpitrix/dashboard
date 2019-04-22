import Modal from 'components/Base/Modal';

describe('Base/Modal', () => {
  it('basic render', () => {
    const wrapper = <Modal>test2</Modal>;

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
