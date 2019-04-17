import { Input, Select } from 'components/Base';
import WrapField from './WrapField';

export default {
  TextField: WrapField(Input),
  SelectField: WrapField(Select)
};
