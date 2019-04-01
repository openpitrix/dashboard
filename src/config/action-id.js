const Action = {
  AppCategoriesCreate: 'm1.f3.a2',
  AppCategoriesModify: 'm1.f3.a3',
  AppCategoriesDelete: 'm1.f3.a4',
  TechnicalReview: 'technical_review',
  BusinessReview: 'business_review',

  ISVApply: 'isv_apply',
  ISVReview: 'isv_review',
  ISVAuth: 'isv_auth',

  UserCreateAdmin: 'm4.f1.a1',
  UserCreateISV: 'm4.f1.a2',
  UserRoleModify: 'm4.f1.a5',
  UserDelete: 'm4.f1.a6',

  UserSSHGet: 'm2.f1.a2',
  UserSSHCreate: 'm2.f1.a1',
  UserSSHDelete: 'm2.f1.a3',
  UserSSHAttach: 'm2.f1.a4',
  UserSSHDetach: 'm2.f1.a5',

  RoleCreate: 'm4.f2.a3',
  RoleDelete: 'm4.f2.a2',
  RoleModify: 'm4.f2.a4',
  RoleModuleModify: 'm4.f2.a5',

  ServerConfigModify: 'm5.f2.a2'
};

export default {
  ...Action,
  NavAppReview: [Action.TechnicalReview, Action.BusinessReview],
  NavAppCategory: [
    Action.AppCategoriesCreate,
    Action.AppCategoriesModify,
    Action.AppCategoriesDelete
  ],
  NavUser: [
    Action.UserCreateAdmin,
    Action.UserCreateISV,
    Action.UserRoleModify,
    Action.UserDelete
  ],
  NavRole: [
    Action.RoleCreate,
    Action.RoleDelete,
    Action.RoleModify,
    Action.RoleModuleModify
  ],
  NavPermission: [
    Action.UserCreateAdmin,
    Action.UserCreateISV,
    Action.UserRoleModify,
    Action.UserDelete,
    Action.RoleCreate,
    Action.RoleDelete,
    Action.RoleModify,
    Action.RoleModuleModify
  ]
};

export const CONDITION = {
  and: 'and',
  or: 'or'
};
