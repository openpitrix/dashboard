import React from 'react';
import {
  Checkbox, Button, Input, Select
} from 'components/Base';
import wrapField from './WrapField';
import FieldGroup from './FieldGroup';

const TextArea = prpos => <textarea {...prpos} />;

export default {
  FieldGroup,
  ButtonField: wrapField(Button),
  CheckboxField: wrapField(Checkbox),
  TextField: wrapField(Input),
  TextareaField: wrapField(TextArea),
  SelectField: wrapField(Select)
};
