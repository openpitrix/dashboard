import _ from 'lodash';

export const checkConfig = {
  vendor: {
    company_name: {
      required: '公司名称不能为空'
    },
    company_website: {
      required: '公司官网不能为空',
      regex: /[a-zA-z]+:\/\/[^\s]*/,
      regex_info: '输入格式错误，正确格式如：http://www.example.com'
    },
    authorizer_name: {
      required: '姓名不能为空'
    },
    authorizer_email: {
      required: '办公邮箱不能为空',
      regex: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
      regex_info: '输入格式错误，正确格式如：name@example.com'
    },
    authorizer_phone: {
      required: '手机号不能为空',
      regex: /^1[0-9]{10}$/,
      regex_info: '输入格式错误，正确格式为1开始的11位数字'
    },
    bank_name: {
      required: '开户银行不能为空'
    },
    bank_account_name: {
      required: '开户名不能为空'
    },
    bank_account_number: {
      required: '账号不能为空',
      regex: /\d{12}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}/,
      regex_info: '输入格式错误，正确格式为12到19位的数字'
    }
  }
};

export const fromCheck = (formName, submitData) => {
  const result = {};
  const config = checkConfig[formName];

  _.map(config, (check, key) => {
    const value = submitData[key];

    if (check.required) {
      result[key] = value ? '' : check.required;
    }

    if (check.regex && value) {
      result[key] = check.regex.test(value) ? '' : check.regex_info;
    }
  });

  return result;
};

export const fieldCheck = (formName, fieldName, value) => {
  const result = {};
  const check = _.get(checkConfig, `${formName}.${fieldName}`, {});

  if (check.required) {
    result[fieldName] = value ? '' : check.required;
  }

  if (check.regex && value) {
    result[fieldName] = check.regex.test(value) ? '' : check.regex_info;
  }

  return result;
};
