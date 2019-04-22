import UploadShow from 'components/UploadShow';

describe('Component UploadShow', () => {
  it('basic render', () => {
    const wrapper = render(<UploadShow />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Upload error', () => {
    const wrapper = render(<UploadShow errorMessage="Upload error" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Upload Ok', () => {
    const wrapper = render(<UploadShow uploadStatus="ok" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Upload isLoading', () => {
    const wrapper = render(<UploadShow isLoading />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
