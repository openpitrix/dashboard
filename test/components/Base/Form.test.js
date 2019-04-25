import Form from 'components/Base/Form';

const {
  FieldGroup, ButtonField, TextField, SelectField, CheckboxField
} = Form;

describe('Base/Form', () => {
  const spyOnSubmit = jest.fn();

  const props = {
    onSubmit: spyOnSubmit
  };
  const getWrapper = func => func(
      <Form {...props}>
        <FieldGroup>
          <SelectField
            label="Server protocol"
            name="protocol"
            options={[
              {
                value: 'smtp',
                label: 'SMTP'
              },
              {
                value: 'pop3',
                label: 'POP3'
              },
              {
                value: 'imap',
                label: 'IMAP'
              }
            ]}
          />
        </FieldGroup>

        <FieldGroup>
          <TextField name="email_host" placeholder="server name" />

          <TextField
            name="port"
            placeholder="1000"
            type="number"
            size="small"
          />

          <CheckboxField name="ssl_enable">
            {'SSL secure connection'}
          </CheckboxField>
        </FieldGroup>

        <FieldGroup>
          <TextField label={'Sender nickname'} name="display_sender" />
        </FieldGroup>

        <FieldGroup>
          <TextField name="email" />
          <TextField
            label="Server password"
            name="password"
            type="password"
            placeholder="**********"
          />
        </FieldGroup>
        <FieldGroup>
          <ButtonField htmlType="submit" layout="inline">
            submit
          </ButtonField>
        </FieldGroup>
      </Form>
  );
  it('basic render', () => {
    const wrapper = getWrapper(shallow);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call submit', () => {
    const wrapper = getWrapper(mount);
    wrapper.find('[type="submit"]').simulate('submit');
    expect(spyOnSubmit).toHaveBeenCalled();
    wrapper.unmount();
  });
});
