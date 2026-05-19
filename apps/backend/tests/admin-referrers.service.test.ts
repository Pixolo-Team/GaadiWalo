// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { createAdminReferrersService } from "../src/modules/admin-referrers/admin-referrers.service.js";

const authenticatedAdminUser = {
  recordId: "admin-row-1",
  userId: "A001",
  email: "admin@example.com",
  fullName: "Admin User",
  role: "admin",
} as const;

const createDependencies = () => {
  const referrers = [
    {
      id: "ref-1",
      full_name: "Amit Verma",
      phone: "9876543210",
      email: "amit@example.com",
      city: "Mumbai",
      created_at: "2025-02-01T00:00:00.000Z",
    },
    {
      id: "ref-2",
      full_name: "Bhavna Shah",
      phone: "9876543211",
      email: "bhavna@example.com",
      city: "Pune",
      created_at: "2025-03-15T00:00:00.000Z",
    },
    {
      id: "ref-3",
      full_name: "Chetan Rao",
      phone: "9999999999",
      email: null,
      city: null,
      created_at: "2025-04-10T00:00:00.000Z",
    },
  ];
  const leads = [
    {
      id: "lead-1",
      full_name: "Lead One",
      created_at: "2026-05-16T00:00:00.000Z",
      status_id: "status-won",
      referred_by_referrer_id: "ref-1",
    },
    {
      id: "lead-2",
      full_name: "Lead Two",
      created_at: "2026-05-12T00:00:00.000Z",
      status_id: "status-contacted",
      referred_by_referrer_id: "ref-1",
    },
    {
      id: "lead-3",
      full_name: "Lead Three",
      created_at: "2026-05-18T00:00:00.000Z",
      status_id: "status-won",
      referred_by_referrer_id: "ref-2",
    },
    {
      id: "lead-4",
      full_name: "Lead Four",
      created_at: "2026-05-11T00:00:00.000Z",
      status_id: "status-won",
      referred_by_referrer_id: "ref-2",
    },
    {
      id: "lead-5",
      full_name: "Lead Five",
      created_at: "2026-05-08T00:00:00.000Z",
      status_id: "status-contacted",
      referred_by_referrer_id: "ref-2",
    },
  ];

  return {
    getReferrerRecords: async () => referrers,
    getReferrerRecordById: async (referrerId: string) =>
      referrers.find((referrerItem) => referrerItem.id === referrerId) ?? null,
    getLeadRecordsByReferrerIds: async (referrerIds: string[]) =>
      leads.filter((leadItem) =>
        referrerIds.includes(leadItem.referred_by_referrer_id ?? ""),
      ),
    getLeadRecordsByReferrerId: async (referrerId: string) =>
      leads.filter((leadItem) => leadItem.referred_by_referrer_id === referrerId),
    getStatusNameById: async (statusId: string) =>
      statusId === "status-won"
        ? "WON"
        : statusId === "status-contacted"
          ? "CONTACTED"
          : null,
  };
};

describe("admin-referrers.service", () => {
  it("returns ranked referrers with all-time metrics", async () => {
    const adminReferrersService = createAdminReferrersService(createDependencies());

    const referrersResult = await adminReferrersService.getReferrersService(
      authenticatedAdminUser,
      {
        search: undefined,
        sort: "most-referrals",
        page: 1,
        limit: 10,
      },
    );

    assert.equal(referrersResult.error, null);
    assert.deepEqual(referrersResult.data, {
      items: [
        {
          id: "ref-2",
          name: "Bhavna Shah",
          phone: "9876543211",
          email: "bhavna@example.com",
          city: "Pune",
          since: "Mar 2025",
          totalReferrals: 3,
          won: 2,
          conversionRate: 66.67,
        },
        {
          id: "ref-1",
          name: "Amit Verma",
          phone: "9876543210",
          email: "amit@example.com",
          city: "Mumbai",
          since: "Feb 2025",
          totalReferrals: 2,
          won: 1,
          conversionRate: 50,
        },
        {
          id: "ref-3",
          name: "Chetan Rao",
          phone: "9999999999",
          email: null,
          city: null,
          since: "Apr 2025",
          totalReferrals: 0,
          won: 0,
          conversionRate: 0,
        },
      ],
      page: 1,
      limit: 10,
      totalItems: 3,
      totalPages: 1,
    });
  });

  it("filters the referrers list by name and phone", async () => {
    const adminReferrersService = createAdminReferrersService(createDependencies());

    const searchByNameResult = await adminReferrersService.getReferrersService(
      authenticatedAdminUser,
      {
        search: "bhavna",
        sort: "most-referrals",
        page: 1,
        limit: 10,
      },
    );
    const searchByPhoneResult = await adminReferrersService.getReferrersService(
      authenticatedAdminUser,
      {
        search: "9999",
        sort: "most-referrals",
        page: 1,
        limit: 10,
      },
    );

    assert.equal(searchByNameResult.data?.items.length, 1);
    assert.equal(searchByNameResult.data?.items[0]?.id, "ref-2");
    assert.equal(searchByPhoneResult.data?.items.length, 1);
    assert.equal(searchByPhoneResult.data?.items[0]?.id, "ref-3");
  });

  it("changes ranking when best-conversion sorting is requested", async () => {
    const adminReferrersService = createAdminReferrersService({
      ...createDependencies(),
      getLeadRecordsByReferrerIds: async (referrerIds: string[]) => [
        {
          id: "lead-1",
          full_name: "Lead One",
          created_at: "2026-05-16T00:00:00.000Z",
          status_id: "status-won",
          referred_by_referrer_id: "ref-1",
        },
        {
          id: "lead-2",
          full_name: "Lead Two",
          created_at: "2026-05-12T00:00:00.000Z",
          status_id: "status-contacted",
          referred_by_referrer_id: "ref-1",
        },
        {
          id: "lead-3",
          full_name: "Lead Three",
          created_at: "2026-05-18T00:00:00.000Z",
          status_id: "status-won",
          referred_by_referrer_id: "ref-2",
        },
        {
          id: "lead-4",
          full_name: "Lead Four",
          created_at: "2026-05-11T00:00:00.000Z",
          status_id: "status-contacted",
          referred_by_referrer_id: "ref-2",
        },
      ].filter((leadItem) =>
        referrerIds.includes(leadItem.referred_by_referrer_id ?? ""),
      ),
    });

    const referrersResult = await adminReferrersService.getReferrersService(
      authenticatedAdminUser,
      {
        search: undefined,
        sort: "best-conversion",
        page: 1,
        limit: 10,
      },
    );

    assert.equal(referrersResult.data?.items[0]?.id, "ref-1");
    assert.equal(referrersResult.data?.items[1]?.id, "ref-2");
  });

  it("returns one referrer detail and marks only the top-ranked referrer", async () => {
    const adminReferrersService = createAdminReferrersService(createDependencies());

    const topReferrerResult = await adminReferrersService.getReferrerByIdService(
      authenticatedAdminUser,
      "ref-2",
    );
    const nonTopReferrerResult =
      await adminReferrersService.getReferrerByIdService(
        authenticatedAdminUser,
        "ref-1",
      );

    assert.equal(topReferrerResult.data?.isTopReferrer, true);
    assert.equal(nonTopReferrerResult.data?.isTopReferrer, false);
    assert.equal(topReferrerResult.data?.since, "Mar 2025");
  });

  it("returns paginated newest-first referred leads with formatted months", async () => {
    const adminReferrersService = createAdminReferrersService(createDependencies());

    const referredLeadsResult =
      await adminReferrersService.getReferredLeadsService(
        authenticatedAdminUser,
        "ref-2",
        {
          page: 1,
          limit: 2,
        },
      );

    assert.equal(referredLeadsResult.error, null);
    assert.deepEqual(referredLeadsResult.data, {
      items: [
        {
          id: "lead-3",
          leadName: "Lead Three",
          status: "WON",
          month: "May 2026",
        },
        {
          id: "lead-4",
          leadName: "Lead Four",
          status: "WON",
          month: "May 2026",
        },
      ],
      page: 1,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
    });
  });

  it("returns zero counts for a referrer without lead history", async () => {
    const adminReferrersService = createAdminReferrersService(createDependencies());

    const referrerResult = await adminReferrersService.getReferrerByIdService(
      authenticatedAdminUser,
      "ref-3",
    );

    assert.equal(referrerResult.data?.totalReferrals, 0);
    assert.equal(referrerResult.data?.won, 0);
    assert.equal(referrerResult.data?.conversionRate, 0);
  });

  it("returns not found for an unknown referrer", async () => {
    const adminReferrersService = createAdminReferrersService(createDependencies());

    const referrerResult = await adminReferrersService.getReferrerByIdService(
      authenticatedAdminUser,
      "missing-referrer",
    );

    assert.equal(referrerResult.data, null);
    assert.equal(referrerResult.error?.message, "Referrer not found.");
  });
});
