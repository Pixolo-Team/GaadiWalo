// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { createSalesProfileService } from "../src/modules/sales-profile/sales-profile.service.js";

const authenticatedSalesUser = {
  recordId: "sales-row-1",
  userId: "S001",
  email: "sales1@example.com",
  fullName: "Sales One",
  role: "sales",
} as const;

const authenticatedOtherSalesUser = {
  recordId: "sales-row-2",
  userId: "S002",
  email: "sales2@example.com",
  fullName: "Sales Two",
  role: "sales",
} as const;

const authenticatedAdminUser = {
  recordId: "admin-row-1",
  userId: "A001",
  email: "admin@example.com",
  fullName: "Admin User",
  role: "admin",
} as const;

const createDependencies = () => {
  const users = [
    {
      id: "sales-row-1",
      auth_id: "auth-sales-1",
      branch_id: "branch-1",
      role_id: "role-sales",
      full_name: "Sales One",
      email: "sales1@example.com",
      phone: "9876543210",
      profile_photo_url: "https://example.com/photo-1.jpg",
      language_preference: "Hindi",
      notification_preferences_json: {
        overdueFollowUps: true,
        testDriveReminders: false,
        newLeadAssigned: true,
        statusChangeAlerts: true,
        wonLostSummary: false,
        pushNotification: true,
        sms: false,
        whatsApp: true,
        quietHoursEnabled: true,
        quietHoursFrom: "22:00",
        quietHoursTo: "07:00",
      },
      created_at: "2026-01-01T00:00:00.000Z",
      user_code: "S001",
    },
    {
      id: "sales-row-2",
      auth_id: "auth-sales-2",
      branch_id: "branch-2",
      role_id: "role-sales",
      full_name: "Sales Two",
      email: "sales2@example.com",
      phone: "9876543211",
      profile_photo_url: null,
      language_preference: null,
      notification_preferences_json: null,
      created_at: "2026-02-01T00:00:00.000Z",
      user_code: "S002",
    },
    {
      id: "admin-row-1",
      auth_id: "auth-admin-1",
      branch_id: "branch-1",
      role_id: "role-admin",
      full_name: "Admin User",
      email: "admin@example.com",
      phone: "9999999999",
      profile_photo_url: null,
      created_at: "2025-12-01T00:00:00.000Z",
      user_code: "A001",
    },
  ];
  const branches = [
    { id: "branch-1", city: "Mumbai" },
    { id: "branch-2", city: "Pune" },
  ];
  const roles = [
    { id: "role-sales", name: "sales" },
    { id: "role-admin", name: "admin" },
  ];
  const leadAssignments = [
    {
      lead_id: "lead-1",
      user_id: "sales-row-1",
      is_primary: true,
      lead: {
        id: "lead-1",
        full_name: "Lead One",
        created_at: "2026-05-02T10:00:00.000Z",
        status_id: "status-won",
        lead_source_id: "source-1",
      },
    },
    {
      lead_id: "lead-2",
      user_id: "sales-row-1",
      is_primary: true,
      lead: {
        id: "lead-2",
        full_name: "Lead Two",
        created_at: "2026-05-05T10:00:00.000Z",
        status_id: "status-lost",
        lead_source_id: "source-2",
      },
    },
    {
      lead_id: "lead-3",
      user_id: "sales-row-2",
      is_primary: true,
      lead: {
        id: "lead-3",
        full_name: "Lead Three",
        created_at: "2026-05-03T10:00:00.000Z",
        status_id: "status-contacted",
        lead_source_id: "source-1",
      },
    },
  ];
  const statusLogs = [
    {
      lead_id: "lead-1",
      updated_at: "2026-05-02T11:00:00.000Z",
      user_id: "sales-row-1",
    },
    {
      lead_id: "lead-2",
      updated_at: "2026-05-05T11:00:00.000Z",
      user_id: "sales-row-1",
    },
  ];
  const updatedPasswords: Array<{ authUserId: string; password: string }> = [];

  return {
    state: {
      users,
      updatedPasswords,
    },
    dependencies: {
      getUserRecordByUserCode: async (userCode: string) =>
        users.find((userItem) => userItem.user_code === userCode) ?? null,
      getUserRecordByEmail: async (email: string) =>
        users.find((userItem) => userItem.email === email) ?? null,
      getUserRecordByPhone: async (phone: string) =>
        users.find((userItem) => userItem.phone === phone) ?? null,
      updateUserRecord: async (userRecordId: string, payload: Record<string, unknown>) => {
        const user = users.find((userItem) => userItem.id === userRecordId);

        if (!user) {
          throw new Error("User not found.");
        }

        Object.assign(user, payload);
        return user;
      },
      getBranchById: async (branchId: string) =>
        branches.find((branchItem) => branchItem.id === branchId) ?? null,
      getRoleById: async (roleId: string) =>
        roles.find((roleItem) => roleItem.id === roleId) ?? null,
      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        if (email === "sales1@example.com" && password === "Correct123") {
          return {
            access_token: "session-token",
          };
        }

        throw new Error("Invalid login credentials");
      },
      updateAuthUserPassword: async (payload: {
        authUserId: string;
        password: string;
      }) => {
        updatedPasswords.push(payload);
      },
      getStatusNameById: async (statusId: string) =>
        statusId === "status-won"
          ? "WON"
          : statusId === "status-lost"
            ? "LOST"
            : statusId === "status-contacted"
              ? "CONTACTED"
              : null,
      getLeadSourceNameById: async (sourceId: string) =>
        sourceId === "source-1"
          ? "CarWale"
          : sourceId === "source-2"
            ? "Referral"
            : null,
      getLeadAssignmentsByUserIds: async (userRecordIds: string[]) =>
        leadAssignments.filter((assignmentItem) =>
          userRecordIds.includes(assignmentItem.user_id),
        ),
      getStatusLogsByUserIds: async (userRecordIds: string[]) =>
        statusLogs.filter((statusLogItem) =>
          userRecordIds.includes(statusLogItem.user_id ?? ""),
        ),
      getActiveSalesUserRecords: async () =>
        users.filter((userItem) => userItem.role_id === "role-sales"),
    },
  };
};

describe("sales-profile.service", () => {
  it("allows a sales user to fetch their own profile by user code", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const profileResult = await salesProfileService.getSalesProfileService(
      authenticatedSalesUser,
      "S001",
    );

    assert.equal(profileResult.error, null);
    assert.deepEqual(profileResult.data, {
      userId: "S001",
      fullName: "Sales One",
      phone: "9876543210",
      email: "sales1@example.com",
      role: "sales",
      branch: "Mumbai",
      joinedAt: "2026-01-01T00:00:00.000Z",
      profilePhotoUrl: "https://example.com/photo-1.jpg",
      languagePreference: "Hindi",
      notificationPreferences: {
        overdueFollowUps: true,
        testDriveReminders: false,
        newLeadAssigned: true,
        statusChangeAlerts: true,
        wonLostSummary: false,
        pushNotification: true,
        sms: false,
        whatsApp: true,
        quietHoursEnabled: true,
        quietHoursFrom: "22:00",
        quietHoursTo: "07:00",
      },
    });
  });

  it("allows an admin to fetch a sales profile by user code", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const profileResult = await salesProfileService.getSalesProfileService(
      authenticatedAdminUser,
      "S001",
    );

    assert.equal(profileResult.error, null);
    assert.equal(profileResult.data?.userId, "S001");
  });

  it("allows an admin to fetch their own profile by user code", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const profileResult = await salesProfileService.getSalesProfileService(
      authenticatedAdminUser,
      "A001",
    );

    assert.equal(profileResult.error, null);
    assert.equal(profileResult.data?.userId, "A001");
    assert.equal(profileResult.data?.role, "admin");
  });

  it("forbids one sales user from reading another sales user's profile", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const profileResult = await salesProfileService.getSalesProfileService(
      authenticatedOtherSalesUser,
      "S001",
    );

    assert.equal(profileResult.data, null);
    assert.equal(
      profileResult.error?.message,
      "You are not allowed to access this sales profile.",
    );
  });

  it("forbids one sales user from updating another sales user's profile", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const updateResult = await salesProfileService.updateSalesProfileService(
      authenticatedOtherSalesUser,
      "S001",
      {
        fullName: "No Access",
      },
    );

    assert.equal(updateResult.data, null);
    assert.equal(
      updateResult.error?.message,
      "You are not allowed to access this sales profile.",
    );
  });

  it("returns default settings when users settings fields are empty", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const profileResult = await salesProfileService.getSalesProfileService(
      authenticatedOtherSalesUser,
      "S002",
    );

    assert.equal(profileResult.error, null);
    assert.equal(profileResult.data?.languagePreference, "English");
    assert.deepEqual(profileResult.data?.notificationPreferences, {
      overdueFollowUps: false,
      testDriveReminders: false,
      newLeadAssigned: false,
      statusChangeAlerts: false,
      wonLostSummary: false,
      pushNotification: false,
      sms: false,
      whatsApp: false,
      quietHoursEnabled: false,
      quietHoursFrom: null,
      quietHoursTo: null,
    });
  });

  it("updates profile basics and language preference", async () => {
    const { dependencies, state } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const updateResult = await salesProfileService.updateSalesProfileService(
      authenticatedSalesUser,
      "S001",
      {
        fullName: "Updated Sales One",
        phone: "9876543222",
        email: "updated.sales1@example.com",
        languagePreference: "English",
      },
    );

    assert.equal(updateResult.error, null);
    assert.equal(updateResult.data?.fullName, "Updated Sales One");
    assert.equal(updateResult.data?.phone, "9876543222");
    assert.equal(updateResult.data?.email, "updated.sales1@example.com");
    assert.equal(
      state.users.find((userItem) => userItem.id === "sales-row-1")
        ?.language_preference,
      "English",
    );
  });

  it("upserts notification preferences", async () => {
    const { dependencies, state } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const notificationResult =
      await salesProfileService.updateSalesNotificationsService(
        authenticatedOtherSalesUser,
        "S002",
        {
          overdueFollowUps: true,
          testDriveReminders: true,
          newLeadAssigned: false,
          statusChangeAlerts: true,
          wonLostSummary: true,
          pushNotification: true,
          sms: true,
          whatsApp: false,
          quietHoursEnabled: true,
          quietHoursFrom: "21:00",
          quietHoursTo: "06:00",
        },
      );

    assert.equal(notificationResult.error, null);
    assert.equal(notificationResult.data?.success, true);
    assert.deepEqual(
      state.users.find((userItem) => userItem.id === "sales-row-2")
        ?.notification_preferences_json,
      {
        overdueFollowUps: true,
        testDriveReminders: true,
        newLeadAssigned: false,
        statusChangeAlerts: true,
        wonLostSummary: true,
        pushNotification: true,
        sms: true,
        whatsApp: false,
        quietHoursEnabled: true,
        quietHoursFrom: "21:00",
        quietHoursTo: "06:00",
      },
    );
  });

  it("rejects wrong current password on password change", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const passwordResult = await salesProfileService.changeSalesPasswordService(
      authenticatedSalesUser,
      "S001",
      {
        currentPassword: "Wrong123",
        newPassword: "NewStrong123",
      },
    );

    assert.equal(passwordResult.data, null);
    assert.equal(passwordResult.error?.message, "Invalid User ID or password.");
  });

  it("allows an admin to change their own password", async () => {
    const { dependencies, state } = createDependencies();
    const salesProfileService = createSalesProfileService({
      ...dependencies,
      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        if (email === "admin@example.com" && password === "Correct123") {
          return {
            access_token: "admin-session-token",
          };
        }

        throw new Error("Invalid login credentials");
      },
    });

    const passwordResult = await salesProfileService.changeSalesPasswordService(
      authenticatedAdminUser,
      "A001",
      {
        currentPassword: "Correct123",
        newPassword: "NewStrong123",
      },
    );

    assert.equal(passwordResult.error, null);
    assert.deepEqual(passwordResult.data, {
      success: true,
    });
    assert.deepEqual(state.updatedPasswords, [
      {
        authUserId: "auth-admin-1",
        password: "NewStrong123",
      },
    ]);
  });

  it("rejects weak new passwords", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const passwordResult = await salesProfileService.changeSalesPasswordService(
      authenticatedSalesUser,
      "S001",
      {
        currentPassword: "Correct123",
        newPassword: "weak",
      },
    );

    assert.equal(passwordResult.data, null);
    assert.equal(
      passwordResult.error?.message,
      "Password must be at least 8 characters long and include 1 uppercase letter and 1 number.",
    );
  });

  it("returns performance summary with pipeline, sources, weekly activity, and rank", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const performanceResult = await salesProfileService.getSalesPerformanceService(
      authenticatedSalesUser,
      "S001",
      "2026-05",
    );

    assert.equal(performanceResult.error, null);
    assert.deepEqual(performanceResult.data, {
      totalLeads: 2,
      callsMade: 2,
      won: 1,
      wonRate: 50,
      lost: 1,
      lostRate: 50,
      rank: 1,
      pipeline: {
        NEW: 0,
        CONTACTED: 0,
        INTERESTED: 0,
        TEST_DRIVE: 0,
        WON: 1,
      },
      weeklyActivity: [
        { day: "Mon", calls: 0, leads: 0 },
        { day: "Tue", calls: 1, leads: 1 },
        { day: "Wed", calls: 0, leads: 0 },
        { day: "Thu", calls: 0, leads: 0 },
        { day: "Fri", calls: 0, leads: 0 },
        { day: "Sat", calls: 1, leads: 1 },
        { day: "Sun", calls: 0, leads: 0 },
      ],
      sourceBreakdown: [
        { source: "CarWale", count: 1 },
        { source: "Referral", count: 1 },
      ],
    });
  });

  it("allows an admin to fetch their own performance with no sales rank", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const performanceResult = await salesProfileService.getSalesPerformanceService(
      authenticatedAdminUser,
      "A001",
      "2026-05",
    );

    assert.equal(performanceResult.error, null);
    assert.deepEqual(performanceResult.data, {
      totalLeads: 0,
      callsMade: 0,
      won: 0,
      wonRate: 0,
      lost: 0,
      lostRate: 0,
      rank: null,
      pipeline: {
        NEW: 0,
        CONTACTED: 0,
        INTERESTED: 0,
        TEST_DRIVE: 0,
        WON: 0,
      },
      weeklyActivity: [
        { day: "Mon", calls: 0, leads: 0 },
        { day: "Tue", calls: 0, leads: 0 },
        { day: "Wed", calls: 0, leads: 0 },
        { day: "Thu", calls: 0, leads: 0 },
        { day: "Fri", calls: 0, leads: 0 },
        { day: "Sat", calls: 0, leads: 0 },
        { day: "Sun", calls: 0, leads: 0 },
      ],
      sourceBreakdown: [],
    });
  });

  it("returns not found for an unknown user code", async () => {
    const { dependencies } = createDependencies();
    const salesProfileService = createSalesProfileService(dependencies);

    const profileResult = await salesProfileService.getSalesProfileService(
      authenticatedAdminUser,
      "S404",
    );

    assert.equal(profileResult.data, null);
    assert.equal(profileResult.error?.message, "Sales profile not found.");
  });
});
