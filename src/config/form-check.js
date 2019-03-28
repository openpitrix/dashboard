import _ from 'lodash';

export const checkConfig = {
  vendor: {
    company_name: {
      required_info: 'Company name cannot be empty'
    },
    company_website: {
      required_info: 'Company website cannot be empty',
      regex: /[a-zA-z]+:\/\/[^\s]*/,
      regex_info: 'WEBSITE_FORMAT_INFO'
    },
    authorizer_name: {
      required_info: 'Name cannot be empty'
    },
    authorizer_email: {
      required_info: 'Office mailboxes cannot be empty',
      regex: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
      regex_info: 'AUTHORIZER_EMAIL_FORMAT_INFO'
    },
    authorizer_phone: {
      required_info: 'Mobile phone number cannot be empty',
      regex: /^1[0-9]{10}$/,
      regex_info: 'AUTHORIZER_PHONE_FORMAT_INFO'
    },
    bank_name: {
      required_info: 'Opening bank cannot be empty'
    },
    bank_account_name: {
      required_info: 'Account name cannot be empty'
    },
    bank_account_number: {
      required_info: 'Account number cannot be empty',
      regex: /\d{12}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}/,
      regex_info: 'BANK_ACCOUNT_NUMBER_FORMAT_INFO'
    }
  },
  app: {
    name: {
      required_info: 'Name should not be empty'
    },
    home: {
      regex: /[a-zA-z]+:\/\/[^\s]*/,
      regex_info: 'WEBSITE_FORMAT_INFO'
    }
  },
  version: {
    name: {
      required_info: 'Version No should not be empty"',
      regex: /^\d+((\.|\d|^\s+|\s|\[)*)+((\d|\])$)/,
      regex_info: 'VERSION_NO_FORMAT_INFO'
    }
  }
};

const checkInput = (check = {}, value = '') => {
  let result = '';
  if (check.required_info) {
    result = value ? '' : check.required_info;
  }

  if (check.regex && value) {
    result = check.regex.test(value) ? '' : check.regex_info;
  }

  return result;
};

export const formCheck = (formName, submitData) => {
  const result = {};
  const config = checkConfig[formName];

  _.map(config, (check, key) => {
    result[key] = checkInput(check, submitData[key]);

    if (!result[key]) {
      delete result[key];
    }
  });

  return result;
};

export const fieldCheck = (formName, fieldName, value) => {
  const check = _.get(checkConfig, `${formName}.${fieldName}`, {});

  return { [fieldName]: checkInput(check, value) };
};
