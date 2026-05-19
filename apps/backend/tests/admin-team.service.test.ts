// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { createAdminTeamService } from "../src/modules/admin-team/admin-team.service.js";
import type { AdminTeamServiceErrorData } from "../src/modules/admin-team/admin-team.types.js";

const authenticatedAdminUser = {
  recordId: "admin-row-1",
  userId: "A001",
  email: "admin@example.com",
  fullName: "Admin User",
  role: "admin",
} as const;

const createDependencies = () => {
  const userRecords = [
    {
      id: "admin-row-1",
      user_code: "A001",
      full_name: "Admin User",
      phone: "9999999999",
      email: "admin@example.com",
      role_id: "role-admin",
      branch_id: "branch-1",
      is_active: true,
      joined_at: "2026-01-01T00:00:00.000Z",
      auth_id: "auth-admin-1",
    },
    {
      id: "sales-row-1",
      user_code: "SP001",
      full_name: "Riya Sharma",
      phone: "9876543210",
      email: "riya@example.com",
      role_id: "role-sales-exec",
      branch_id: "branch-1",
      is_active: true,
      joined_at: "2026-02-01T00:00:00.000Z",
      auth_id: "auth-sales-1",
    },
    {
      id: "sales-row-2",
      user_code: "SP002",
      full_name: "Kabir Singh",
      phone: "9876543211",
      email: "kabir@example.com",
      role_id: "role-sales-senior",
      branch_id: "branch-2",
      is_active: true,
      joined_at: "2026-03-01T00:00:00.000Z",
      auth_id: "auth-sales-2",
    },
  ];
  const assignments = [
    {
      lead_id: "lead-1",
      user_id: "sales-row-1",
      is_primary: true,
      lead: {
        id: "lead-1",
        created_at: "2026-05-02T10:00:00.000Z",
        status_id: "status-won",
      },
    },
    {
      lead_id: "lead-2",
      user_id: "sales-row-1",
      is_primary: true,
      lead: {
        id: "lead-2",
        created_at: "2026-05-05T10:00:00.000Z",
        status_id: "status-contacted",
      },
    },
    {
      lead_id: "lead-3",
      user_id: "sales-row-2",
      is_primary: true,
      lead: {
        id: "lead-3",
        created_at: "2026-05-06T10:00:00.000Z",
        status_id: "status-contacted",
      },
    },
  ];
  const deletedAuthUserIds: string[] = [];
  const updatedPasswords: Array<{ authUserId: string; password: string }> = [];
  const reassignedPayloads: Array<{ fromUserId: string; toUserId: string; leadIds: string[] }> = [];
  const unassignedPayloads: Array<{ fromUserId: string; leadIds: string[] }> = [];

  return {
    state: {
      userRecords,
      deletedAuthUserIds,
      updatedPasswords,
      reassignedPayloads,
      unassignedPayloads,
    },
    dependencies: {
      getSalesUserRecords: async () => userRecords,
      getUserRecordByIdentifier: async (salespersonId: string) =>
        userRecords.find(
          (userRecordItem) =>
            userRecordItem.user_code === salespersonId ||
            userRecordItem.id === salespersonId,
        ) ?? null,
      getUserRecordByEmail: async (email: string) =>
        userRecords.find((userRecordItem) => userRecordItem.email === email) ?? null,
      getUserRecordByPhone: async (phone: string) =>
        userRecords.find((userRecordItem) => userRecordItem.phone === phone) ?? null,
      getUserRecordByUserCode: async (userCode: string) =>
        userRecords.find((userRecordItem) => userRecordItem.user_code === userCode) ??
        null,
      createUserRecord: async (payload: {
        userCode: string;
        fullName: string;
        phone: string;
        email: string;
        roleId: string;
        branchId: string;
        authId: string;
        isActive: boolean;
        joinedAt: string;
      }) => {
        const createdUserRecord = {
          id: "sales-row-3",
          user_code: payload.userCode,
          full_name: payload.fullName,
          phone: payload.phone,
          email: payload.email,
          role_id: payload.roleId,
          branch_id: payload.branchId,
          is_active: payload.isActive,
          joined_at: payload.joinedAt,
          auth_id: payload.authId,
        };
        userRecords.push(createdUserRecord);
        return createdUserRecord;
      },
      updateUserRecord: async (userRecordId: string, payload: Record<string, unknown>) => {
        const userRecord = userRecords.find((userRecordItem) => userRecordItem.id === userRecordId);

        if (!userRecord) {
          throw new Error("User not found.");
        }

        Object.assign(userRecord, payload);
        return userRecord;
      },
      getRoles: async () => [
        { id: "role-admin", name: "Admin" },
        { id: "role-sales-exec", name: "Sales Executive" },
        { id: "role-sales-senior", name: "Senior SE" },
      ],
      getRoleByIdentifier: async (roleIdentifier: string) =>
        (
          [
            { id: "role-admin", name: "Admin" },
            { id: "role-sales-exec", name: "Sales Executive" },
            { id: "role-sales-senior", name: "Senior SE" },
          ] as const
        ).find((roleItem) => roleItem.id === roleIdentifier) ?? null,
      getBranches: async () => [
        { id: "branch-1", name: "Mumbai" },
        { id: "branch-2", name: "Pune" },
      ],
      getBranchByIdentifier: async (branchIdentifier: string) =>
        (
          [
            { id: "branch-1", name: "Mumbai" },
            { id: "branch-2", name: "Pune" },
          ] as const
        ).find((branchItem) => branchItem.id === branchIdentifier) ?? null,
      createAuthUser: async ({ email }: { email: string; password: string }) => ({
        id: "auth-created-1",
        email,
      }),
      deleteAuthUser: async (authUserId: string) => {
        deletedAuthUserIds.push(authUserId);
      },
      updateAuthUserPassword: async (payload: {
        authUserId: string;
        password: string;
      }) => {
        updatedPasswords.push(payload);
      },
      getUserByRecordIdentifier: async () => null,
      getStatusNameById: async (statusId: string) =>
        statusId === "status-won"
          ? "WON"
          : statusId === "status-contacted"
            ? "CONTACTED"
            : null,
      getLeadAssignmentsByUserIds: async (userRecordIds: string[]) =>
        assignments.filter((assignmentItem) =>
          userRecordIds.includes(assignmentItem.user_id),
        ),
      reassignLeadAssignments: async (payload: {
        fromUserId: string;
        toUserId: string;
        leadIds: string[];
      }) => {
        reassignedPayloads.push(payload);
      },
      unassignLeadAssignments: async (payload: {
        fromUserId: string;
        leadIds: string[];
      }) => {
        unassignedPayloads.push(payload);
      },
    },
  };
};

describe("admin-team.service", () => {
  it("returns options without admin roles", async () => {
    const { dependencies } = createDependencies();
    const adminTeamService = createAdminTeamService(dependencies);

    const optionsResult =
      await adminTeamService.getTeamOptionsService(authenticatedAdminUser);

    assert.equal(optionsResult.error, null);
    assert.deepEqual(optionsResult.data, {
      roles: [
        { id: "role-sales-exec", name: "Sales Executive" },
        { id: "role-sales-senior", name: "Senior SE" },
      ],
      branches: [
        { id: "branch-1", name: "Mumbai" },
        { id: "branch-2", name: "Pune" },
      ],
    });
  });

  it("creates a salesperson in auth and users data", async () => {
    const { dependencies } = createDependencies();
    const adminTeamService = createAdminTeamService(dependencies);

    const createResult = await adminTeamService.createSalespersonService(
      authenticatedAdminUser,
      {
        fullName: "Sneha Kapoor",
        phone: "9876543222",
        email: "sneha@example.com",
        branchId: "branch-1",
        roleId: "role-sales-exec",
      },
    );

    assert.equal(createResult.error, null);
    assert.equal(createResult.data?.salesperson.userId, "SP003");
    assert.equal(createResult.data?.salesperson.fullName, "Sneha Kapoor");
    assert.equal(createResult.data?.salesperson.branch.name, "Mumbai");
    assert.equal(createResult.data?.salesperson.role.name, "Sales Executive");
    assert.equal(typeof createResult.data?.tempPassword, "string");
  });

  it("rolls back auth user creation when public user insert fails", async () => {
    const { dependencies, state } = createDependencies();
    const adminTeamService = createAdminTeamService({
      ...dependencies,
      createUserRecord: async () => {
        throw new Error("Insert failed.");
      },
    });

    const createResult = await adminTeamService.createSalespersonService(
      authenticatedAdminUser,
      {
        fullName: "Sneha Kapoor",
        phone: "9876543222",
        email: "sneha@example.com",
        branchId: "branch-1",
        roleId: "role-sales-exec",
      },
    );

    assert.equal(createResult.data, null);
    assert.deepEqual(state.deletedAuthUserIds, ["auth-created-1"]);
  });

  it("resets password through auth only", async () => {
    const { dependencies, state } = createDependencies();
    const adminTeamService = createAdminTeamService(dependencies);

    const resetResult =
      await adminTeamService.resetSalespersonPasswordService(
        authenticatedAdminUser,
        "SP001",
      );

    assert.equal(resetResult.error, null);
    assert.equal(state.updatedPasswords.length, 1);
    assert.equal(state.updatedPasswords[0]?.authUserId, "auth-sales-1");
    assert.equal(typeof resetResult.data?.tempPassword, "string");
  });

  it("reassigns active leads and deactivates salesperson on removal", async () => {
    const { dependencies, state } = createDependencies();
    const adminTeamService = createAdminTeamService(dependencies);

    const removeResult = await adminTeamService.removeSalespersonService(
      authenticatedAdminUser,
      "SP001",
      {
        strategy: "reassign",
        reassignToId: "SP002",
      },
    );

    assert.equal(removeResult.error, null);
    assert.deepEqual(removeResult.data, {
      success: true,
      removalStrategy: "reassign",
      reassignedLeadCount: 1,
      unassignedLeadCount: 0,
    });
    assert.deepEqual(state.reassignedPayloads, [
      {
        fromUserId: "sales-row-1",
        toUserId: "sales-row-2",
        leadIds: ["lead-2"],
      },
    ]);
    assert.equal(
      state.userRecords.find((userRecordItem) => userRecordItem.user_code === "SP001")
        ?.is_active,
      false,
    );
  });

  it("unassigns active leads and deactivates salesperson on removal", async () => {
    const { dependencies, state } = createDependencies();
    const adminTeamService = createAdminTeamService(dependencies);

    const removeResult = await adminTeamService.removeSalespersonService(
      authenticatedAdminUser,
      "SP001",
      {
        strategy: "unassigned",
      },
    );

    assert.equal(removeResult.error, null);
    assert.deepEqual(removeResult.data, {
      success: true,
      removalStrategy: "unassigned",
      reassignedLeadCount: 0,
      unassignedLeadCount: 1,
    });
    assert.deepEqual(state.unassignedPayloads, [
      {
        fromUserId: "sales-row-1",
        leadIds: ["lead-2"],
      },
    ]);
  });

  it("returns a conflict when create uses an existing email", async () => {
    const { dependencies } = createDependencies();
    const adminTeamService = createAdminTeamService(dependencies);

    const createResult = await adminTeamService.createSalespersonService(
      authenticatedAdminUser,
      {
        fullName: "Duplicate User",
        phone: "9876543888",
        email: "riya@example.com",
        branchId: "branch-1",
        roleId: "role-sales-exec",
      },
    );

    assert.equal(createResult.data, null);
    assert.equal(
      createResult.error?.message,
      "A salesperson with this email already exists.",
    );
    assert.equal(
      (createResult.error as AdminTeamServiceErrorData | null)?.code,
      "CONFLICT",
    );
  });
});
