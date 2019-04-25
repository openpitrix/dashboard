import React from 'react';
import {
  Checkbox, Button, Input, Select
} from 'components/Base';
import wrapField from './wrapField';
import FieldGroup from './FieldGroup';

const TextArea = props => <textarea {...props} />;

export default {
  FieldGroup,
  ButtonField: wrapField(Button),
  CheckboxField: wrapField(Checkbox),
  TextField: wrapField(Input),
  TextareaField: wrapField(TextArea),
  SelectField: wrapField(Select)
};
