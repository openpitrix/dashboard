/* eslint-disable no-continue */
import { qs2Obj } from '../src/utils';

/**
 *  simple form serializer, shim safari v11-
 *
 *  see: https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
class FormSerializer {
  constructor(form) {
    this.form = form;
    this.data = []; // serialized data
  }

  ignoreFiled(field) {
    return (
      !field.name
      || field.disabled
      || field.type === 'file'
      || field.type === 'reset'
      || field.type === 'submit'
      || field.type === 'button'
    );
  }

  toString() {
    // Loop through each field in the form
    for (let i = 0; i < this.form.elements.length; i++) {
      const field = this.form.elements[i];

      if (this.ignoreFiled(field)) {
        continue;
      }

      // If a multi-select, get all selections
      if (field.type === 'select-multiple') {
        for (let n = 0; n < field.options.length; n++) {
          if (!field.options[n].selected) {
            continue;
          }
          this.data.push(
            `${encodeURIComponent(field.name)}=${encodeURIComponent(
              field.options[n].value
            )}`
          );
        }
      } else if (
        (field.type !== 'checkbox' && field.type !== 'radio')
        || field.checked
      ) {
        this.data.push(
          `${encodeURIComponent(field.name)}=${encodeURIComponent(field.value)}`
        );
      }
    }

    return this.data.join('&');
  }

  toJson() {
    return qs2Obj(this.toString());
  }
}

export default FormSerializer;
