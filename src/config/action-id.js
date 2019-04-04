const Action = {
  CreateCategories: 'm1.f3.a2',
  ModifyCategories: 'm1.f3.a3',
  DeleteCategories: 'm1.f3.a4',

  TechnicalReview: 'technical_review',
  BusinessReview: 'business_review',

  ISVApply: 'isv_apply',
  ISVReview: 'isv_review',
  ISVAuth: 'isv_auth',

  CreateAdminUser: 'm4.f1.a1',
  CreateISVUser: 'm4.f1.a2',
  DeleteUser: 'm4.f1.a6',
  BindUserRole: 'm4.f1.a5',

  CreateGroup: 'm4.f3.a1',
  ModifyGroup: 'm4.f3.a3',
  DeleteGroup: 'm4.f3.a4',
  JoinGroup: 'm4.f3.a5',
  LeaveGroup: 'm4.f3.a6',

  GetSSH: 'm2.f1.a2',
  CreateSSH: 'm2.f1.a1',
  DeleteSSH: 'm2.f1.a3',
  AttachSSH: 'm2.f1.a4',
  DetachSSH: 'm2.f1.a5',

  CreateRole: 'm4.f2.a3',
  DeleteRole: 'm4.f2.a2',
  ModifyRole: 'm4.f2.a4',
  ModifyRoleModule: 'm4.f2.a5',

  ServerConfigModify: 'm5.f2.a2'
};

export default {
  ...Action,
  NavAppReview: [
    Action.ISVReview,
    Action.TechnicalReview,
    Action.BusinessReview
  ],
  NavAppCategory: [
    Action.CreateCategories,
    Action.ModifyCategories,
    Action.DeleteCategories
  ],
  NavUser: [Action.CreateAdminUser, Action.CreateISVUser, Action.DeleteUser],
  NavRole: [
    Action.CreateRole,
    Action.DeleteRole,
    Action.ModifyRole,
    Action.ModifyRoleModule
  ],
  NavPermission: [
    Action.CreateAdminUser,
    Action.CreateISVUser,
    Action.DeleteUser,
    Action.CreateRole,
    Action.DeleteRole,
    Action.ModifyRole,
    Action.ModifyRoleModule
  ],

  TableAdminToolbar: [Action.JoinGroup, Action.BindUserRole],
  TableAdminUserToolbar: [Action.UserModify],
  TableAdminUserPopover: [
    Action.JoinGroup,
    Action.UserModify,
    Action.RoleModuleModify
  ],
  TableAdminRolePopover: [
    Action.ModifyRole,
    Action.ModifyRoleModule,
    Action.DeleteRole
  ],
  SetRole: [Action.BindUserRole, Action.ModifyRoleModule]
};

export const CONDITION = {
  and: 'and',
  or: 'or'
};
