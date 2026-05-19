// CONFIG //
import { environmentConfig } from "../../config/environment.js";

export interface SupabaseAuthConfigurationData {
  usersTable: string;
  loginUserIdColumn: string;
  emailColumn: string;
  nameColumn: string;
  phoneColumn: string;
  roleColumn: string;
  branchColumn: string;
  activeColumn: string;
  joinedAtColumn: string;
}

export const DEFAULT_SUPABASE_AUTH: SupabaseAuthConfigurationData = {
  usersTable: "users",
  loginUserIdColumn: "user_code",
  emailColumn: "email",
  nameColumn: "full_name",
  phoneColumn: "phone",
  roleColumn: "role_id",
  branchColumn: "branch_id",
  activeColumn: "is_active",
  joinedAtColumn: "created_at",
};

export const SUPABASE_AUTH: SupabaseAuthConfigurationData = {
  usersTable: environmentConfig.supabaseUsersTable,
  loginUserIdColumn: environmentConfig.supabaseLoginUserIdColumn,
  emailColumn: environmentConfig.supabaseUserEmailColumn,
  nameColumn: environmentConfig.supabaseUserNameColumn,
  phoneColumn: environmentConfig.supabaseUserPhoneColumn,
  roleColumn: environmentConfig.supabaseUserRoleColumn,
  branchColumn: environmentConfig.supabaseUserBranchColumn,
  activeColumn: environmentConfig.supabaseUserActiveColumn,
  joinedAtColumn: environmentConfig.supabaseUserJoinedAtColumn,
};
