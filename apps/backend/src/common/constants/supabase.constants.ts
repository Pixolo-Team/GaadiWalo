export const SUPABASE_AUTH = {
  usersTable: "users",
  loginUserIdColumn: "user_code",
  emailColumn: "email",
  nameColumn: "full_name",
  roleColumn: "role_id",
  activeColumn: "is_active",
} as const;
