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
      regex: /^\d+((\.|\d)*)+(\d$)/,
      regex_info: 'VERSION_NO_FORMAT_INFO'
    }
  }
};

export const fromCheck = (formName, submitData) => {
  const result = {};
  const config = checkConfig[formName];

  _.map(config, (check, key) => {
    const value = submitData[key];

    if (check.required_info) {
      result[key] = value ? '' : check.required_info;
    }

    if (check.regex && value) {
      result[key] = check.regex.test(value) ? '' : check.regex_info;
    }

    if (!result[key]) {
      delete result[key];
    }
  });

  return result;
};

export const fieldCheck = (formName, fieldName, value) => {
  const result = {};
  const check = _.get(checkConfig, `${formName}.${fieldName}`, {});

  if (check.required_info) {
    result[fieldName] = value ? '' : check.required_info;
  }

  if (check.regex && value) {
    result[fieldName] = check.regex.test(value) ? '' : check.regex_info;
  }

  return result;
};
