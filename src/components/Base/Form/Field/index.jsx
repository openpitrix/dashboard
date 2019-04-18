import React from 'react';
import { Input, Select } from 'components/Base';
import wrapField from './WrapField';
import FieldGroup from './FieldGroup';

const TextArea = prpos => <textarea {...prpos} />;

export default {
  FieldGroup,
  TextField: wrapField(Input),
  TextareaField: wrapField(TextArea),
  SelectField: wrapField(Select)
};
