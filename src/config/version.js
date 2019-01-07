export const reviewStatus = {
  unprocessed: {
    isv: ['submitted', 'isv-in-review'],
    business_admin: ['isv-passed', 'business-in-review'],
    develop_admin: ['business-passed', 'dev-in-review']
  },
  processed: {
    isv: [
      'isv-rejected',
      'isv-passed',
      'business-in-review',
      'business-passed',
      'business-rejected',
      'dev-in-review',
      'dev-passed',
      'dev-rejected'
    ],
    business_admin: [
      'business-passed',
      'business-rejected',
      'dev-in-review',
      'dev-passed',
      'dev-rejected'
    ],
    develop_admin: ['dev-passed', 'dev-rejected']
  }
};
