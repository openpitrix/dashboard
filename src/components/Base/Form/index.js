import Form from './form';
import Section from './section';
import Item from './item';
import Field from './Field';

Form.Section = Section;
Form.Item = Item;

export default Object.assign(Form, Field);
