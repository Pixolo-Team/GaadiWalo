// CONFIG //
import { environmentConfig } from "../../config/environment.js";

export interface SupabaseAuthConfigurationData {
  usersTable: string;
  loginUserIdColumn: string;
  emailColumn: string;
  nameColumn: string;
  roleColumn: string;
  activeColumn: string;
}

export const DEFAULT_SUPABASE_AUTH: SupabaseAuthConfigurationData = {
  usersTable: "users",
  loginUserIdColumn: "user_code",
  emailColumn: "email",
  nameColumn: "full_name",
  roleColumn: "role_id",
  activeColumn: "is_active",
};

export const SUPABASE_AUTH: SupabaseAuthConfigurationData = {
  usersTable: environmentConfig.supabaseUsersTable,
  loginUserIdColumn: environmentConfig.supabaseLoginUserIdColumn,
  emailColumn: environmentConfig.supabaseUserEmailColumn,
  nameColumn: environmentConfig.supabaseUserNameColumn,
  roleColumn: environmentConfig.supabaseUserRoleColumn,
  activeColumn: environmentConfig.supabaseUserActiveColumn,
};
