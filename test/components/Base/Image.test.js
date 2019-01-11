import Image from 'components/Base/Image';

describe('Base/Iamge', () => {
  const LOAD_FAILURE_SRC = 'LOAD_FAILURE_SRC';
  const LOAD_SUCCESS_SRC = 'https://cc_webchat.yunify.com/images/icon.png';

  it('basic render', () => {
    const wrapper = render(<Image src={LOAD_SUCCESS_SRC} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('render base64', () => {
    const wrapper = render(<Image src={LOAD_SUCCESS_SRC} isBase64Str />);
    expect(wrapper).toMatchSnapshot();
  });

  it('on error', () => {
    const wrapper = mount(
      <Image src={LOAD_FAILURE_SRC} iconLetter={LOAD_FAILURE_SRC} isBase64Str />
    );
    const img = wrapper.instance().img;
    img.onerror(new Error('mocked error'));
    expect(wrapper.state().failed).toEqual(true);

    wrapper.unmount();
  });
});
