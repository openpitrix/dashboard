import _ from 'lodash';

export const reviewFilter = {
  unprocessed: {
    isv: ['submitted', 'isv-in-review'],
    business: ['isv-passed', 'business-in-review'],
    technical: ['business-passed', 'develop-in-review'],
    all: [
      'isv-passed',
      'business-in-review',
      'business-passed',
      'develop-in-review'
    ]
  },
  processed: {
    isv: [
      'isv-rejected',
      'isv-passed',
      'business-in-review',
      'business-passed',
      'business-rejected',
      'develop-in-review',
      'develop-passed',
      'develop-rejected'
    ],
    business: [
      'business-passed',
      'business-rejected',
      'develop-in-review',
      'develop-passed',
      'develop-rejected'
    ],
    technical: ['develop-passed', 'develop-rejected'],
    all: [
      'business-passed',
      'business-rejected',
      'develop-in-review',
      'develop-passed',
      'develop-rejected',
      'develop-passed',
      'develop-rejected'
    ]
  }
};

export const reviewShowStatus = {
  submitted: 'submitted',
  'isv-in-review': 'in-review',
  'isv-rejected': 'rejected',
  'isv-passed': 'submitted',
  'business-in-review': 'in-review',
  'business-rejected': 'rejected',
  'business-passed': 'submitted',
  'develop-rejected': 'rejected',
  'develop-in-review': 'in-review',
  'develop-passed': 'passed'
};

export const reviewStatus = {
  isv: ['submitted', 'isv-in-review'],
  business: ['isv-passed', 'business-in-review'],
  technical: ['business-passed', 'develop-in-review']
};

export const rejectStatus = {
  isv: 'isv-rejected',
  business: 'business-rejected',
  technical: 'develop-rejected'
};

export const reviewTitle = {
  isv: 'App service provider review',
  business: 'Platform business review',
  technical: 'Platform technology review'
};

export const reviewPassNote = {
  isv: 'ISV_PASS_NOTE',
  business: 'BUSINESS_PASS_NOTE',
  technical: 'TECHNICAL_PASS_NOTE'
};

export const getReviewType = status => {
  let result = '';
  _.forIn(reviewStatus, (value, key) => {
    if (value.includes(status)) {
      result = key;
    }
  });

  return result;
};

export const getFilterStatus = (activeType, reveiwTypes) => {
  if (_.isEmpty(reveiwTypes)) {
    return 'none'; // if status is '' will query all data
  }

  let status = [];
  reveiwTypes.forEach(type => {
    status = _.concat(
      status,
      _.get(reviewFilter, `${activeType}.${type}`, 'none')
    );
  });

  return _.uniq(status);
};

export const ALL_VERSION_STATUS = [
  'deleted',
  'draft',
  'submitted',
  'in-review',
  'passed',
  'rejected',
  'active',
  'suspended'
];
