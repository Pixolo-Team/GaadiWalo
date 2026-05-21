// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { createSalesLeadsService } from "../src/modules/sales-leads/sales-leads.service.js";
import type { SalesLeadServiceErrorData } from "../src/modules/sales-leads/sales-leads.types.js";

const authenticatedSalesUser = {
  recordId: "user-row-1",
  userId: "SP001",
  email: "sales@example.com",
  fullName: "Sales Person",
  role: "sales",
} as const;

const authenticatedAdminUser = {
  recordId: "admin-row-1",
  userId: "AD001",
  email: "admin@example.com",
  fullName: "Admin User",
  role: "admin",
} as const;

const baseLeadRecord = {
  id: "lead-1",
  full_name: "Rahul Sharma",
  phone: "9876543210",
  email: "rahul@example.com",
  source: "CarWale",
  status: "NEW" as const,
  lead_source_id: "source-1",
  status_id: "status-new",
  creator_user_id: "user-row-1",
  created_at: "2026-05-15T10:00:00.000Z",
  updated_at: "2026-05-15T10:00:00.000Z",
  referrer_name: null,
  referrer_phone: null,
  car_brand_id: "brand-1",
  car_model_id: "model-1",
  variant_name: "Sportz",
  color_preference: "Red",
  budget: "6-8 Lakh",
  is_used: true,
};

const createDependencies = () => {
  return {
    getStatusRecords: async () => [
      { id: "status-contacted", name: "CONTACTED" },
      { id: "status-lost", name: "LOST" },
      { id: "status-new", name: "NEW" },
    ],
    getLostReasonRecords: async () => [
      { id: "lost-reason-1", name: "Budget issue" },
      { id: "lost-reason-2", name: "Bought elsewhere" },
    ],
    getLeadSourceRecords: async () => [
      {
        id: "source-1",
        name: "CarWale",
        description: "Marketplace lead source",
      },
      {
        id: "source-2",
        name: "Walk-in",
        description: "Direct showroom visit",
      },
    ],
    getBranchRecords: async () => [
      { id: "branch-1", name: "Calgary North" },
      { id: "branch-2", name: "Calgary South" },
    ],
    getCarBrandRecords: async () => [
      { id: "brand-1", name: "Hyundai" },
      { id: "brand-2", name: "Maruti Suzuki" },
      { id: "brand-3", name: "Tata" },
    ],
    getCarModelRecordsByBrandId: async (carBrandId: string) =>
      carBrandId === "brand-1"
        ? [{ id: "model-1", name: "i10", car_brand_id: "brand-1" }]
        : carBrandId === "brand-2"
          ? [{ id: "model-2", name: "Swift", car_brand_id: "brand-2" }]
          : carBrandId === "brand-3"
            ? [{ id: "model-3", name: "Nexon", car_brand_id: "brand-3" }]
            : [],
    getLeadRecord: async () => baseLeadRecord,
    getLeadActivityRecords: async () => [],
    getLeadUserRecords: async () => [
      {
        lead_id: "lead-1",
        user_id: "user-row-1",
        is_primary: true,
      },
    ],
    getLeadNoteRecords: async () => [],
    getUserByRecordIdentifier: async (userIdentifier: string) => ({
      id: userIdentifier,
      user_id: userIdentifier === "user-row-1" ? "SP001" : "SP002",
      email: "sales@example.com",
      full_name: userIdentifier === "user-row-1" ? "Sales Person" : "Other User",
      role: "sales",
      is_active: true,
    }),
    getLeadByPhone: async () => null,
    getLeadSourceIdByName: async (sourceName: string) =>
      sourceName === "CarWale" ? "source-1" : null,
    getLeadSourceNameById: async (sourceId: string) =>
      sourceId === "source-1" ? "CarWale" : null,
    getStatusIdByName: async (statusName: string) =>
      statusName === "NEW"
        ? "status-new"
        : statusName === "CONTACTED"
          ? "status-contacted"
          : statusName === "LOST"
            ? "status-lost"
          : null,
    getStatusNameById: async (statusId: string) =>
      statusId === "status-new"
        ? "NEW"
        : statusId === "status-contacted"
          ? "CONTACTED"
          : statusId === "status-lost"
            ? "LOST"
          : null,
    getLostReasonIdByName: async (lostReasonName: string) =>
      lostReasonName === "Budget issue" ? "lost-reason-1" : null,
    getLostReasonNameById: async (lostReasonId: string) =>
      lostReasonId === "lost-reason-1" ? "Budget issue" : null,
    getCarBrandIdByName: async (brandName: string) =>
      brandName === "Hyundai"
        ? "brand-1"
        : brandName === "Maruti Suzuki"
          ? "brand-2"
          : brandName === "Tata"
            ? "brand-3"
            : null,
    getCarBrandNameById: async (brandId: string) =>
      brandId === "brand-1"
        ? "Hyundai"
        : brandId === "brand-2"
          ? "Maruti Suzuki"
          : brandId === "brand-3"
            ? "Tata"
            : null,
    getCarModelIdByName: async (modelName: string, carBrandId: string | null) =>
      modelName === "i10" && carBrandId === "brand-1"
        ? "model-1"
        : modelName === "Swift" && carBrandId === "brand-2"
          ? "model-2"
          : modelName === "Nexon" &&
              (carBrandId === "brand-3" || carBrandId === null)
            ? "model-3"
            : modelName === "i10" && carBrandId === null
              ? "model-1"
              : modelName === "Swift" && carBrandId === null
                ? "model-2"
                : null,
    getCarModelNameById: async (modelId: string) =>
      modelId === "model-1"
        ? "i10"
        : modelId === "model-2"
          ? "Swift"
          : modelId === "model-3"
            ? "Nexon"
            : null,
    updateLeadRecord: async (_leadId: string, payload: object) => ({
      ...baseLeadRecord,
      ...payload,
    }),
    createLeadRecord: async (payload: object) => ({
      ...baseLeadRecord,
      ...payload,
      id: "lead-created",
      status_id: "status-new",
    }),
    createLeadNoteRecord: async (payload: object) => ({
      lead_id: String((payload as { lead_id?: unknown }).lead_id),
      user_id: String((payload as { user_id?: unknown }).user_id),
      note_text: String((payload as { note_text?: unknown }).note_text),
      created_at: "2026-05-15T10:30:00.000Z",
    }),
    createLeadUserRecord: async (payload: object) => ({
      lead_id: String((payload as { lead_id?: unknown }).lead_id),
      user_id: String((payload as { user_id?: unknown }).user_id),
      is_primary: Boolean((payload as { is_primary?: unknown }).is_primary),
    }),
    createLeadActivityRecord: async (payload: object) => ({
      lead_id: String((payload as { lead_id?: unknown }).lead_id),
      from_status_id:
        ((payload as { from_status_id?: unknown }).from_status_id as string | null) ??
        null,
      to_status_id: String((payload as { to_status_id?: unknown }).to_status_id),
      user_id: String((payload as { user_id?: unknown }).user_id),
      updated_at: "2026-05-15T10:30:00.000Z",
    }),
  };
};

describe("sales-leads.service", () => {
  it("returns all accessible leads for the authenticated sales user", async () => {
    const newerLeadRecord = {
      ...baseLeadRecord,
      id: "lead-2",
      full_name: "Priya Mehta",
      phone: "9999999999",
      created_at: "2026-05-16T10:00:00.000Z",
      updated_at: "2026-05-16T10:30:00.000Z",
    };
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      getLeadRecordsByUserIdentifier: async (userIdentifier: string) =>
        userIdentifier === "user-row-1" ? [baseLeadRecord] : [],
      getLeadUserRecordsByUserIdentifier: async (userIdentifier: string) =>
        userIdentifier === "user-row-1"
          ? [
              {
                lead_id: "lead-2",
                user_id: "user-row-1",
                is_primary: true,
              },
            ]
          : [],
      getLeadRecordsByIds: async (leadIds: string[]) =>
        leadIds.includes("lead-2") ? [newerLeadRecord] : [],
      getLeadUserRecords: async (leadId: string) =>
        leadId === "lead-2"
          ? [
              {
                lead_id: "lead-2",
                user_id: "user-row-1",
                is_primary: true,
              },
            ]
          : [
              {
                lead_id: "lead-1",
                user_id: "user-row-1",
                is_primary: true,
              },
            ],
    });

    const leadListResult =
      await salesLeadsService.getAllLeadsService(authenticatedSalesUser);

    assert.equal(leadListResult.error, null);
    assert.equal(leadListResult.data?.length, 2);
    assert.deepEqual(
      leadListResult.data?.map((leadItem) => leadItem.id),
      ["lead-2", "lead-1"],
    );
    assert.equal(leadListResult.data?.[0]?.fullName, "Priya Mehta");
    assert.equal(leadListResult.data?.[1]?.assignedTo?.id, "SP001");
  });

  it("returns all leads for an authenticated admin user", async () => {
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      getLeadRecords: async () => [baseLeadRecord],
    });

    const leadListResult =
      await salesLeadsService.getAllLeadsService(authenticatedAdminUser);

    assert.equal(leadListResult.error, null);
    assert.equal(leadListResult.data?.length, 1);
    assert.equal(leadListResult.data?.[0]?.id, "lead-1");
  });

  it("returns car brands for the create-lead dropdown", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const carBrandsResult =
      await salesLeadsService.getCarBrandsService(authenticatedSalesUser);

    assert.equal(carBrandsResult.error, null);
    assert.deepEqual(carBrandsResult.data, [
      { id: "brand-1", name: "Hyundai", models: ["i10"] },
      { id: "brand-2", name: "Maruti Suzuki", models: ["Swift"] },
      { id: "brand-3", name: "Tata", models: ["Nexon"] },
    ]);
  });

  it("returns lead statuses for the create-lead dropdown", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const leadStatusesResult =
      await salesLeadsService.getLeadStatusesService(authenticatedSalesUser);

    assert.equal(leadStatusesResult.error, null);
    assert.deepEqual(leadStatusesResult.data, [
      { id: "status-contacted", name: "CONTACTED", reason: [] },
      {
        id: "status-lost",
        name: "LOST",
        reason: ["Budget issue", "Bought elsewhere"],
      },
      { id: "status-new", name: "NEW", reason: [] },
    ]);
  });

  it("returns active lead sources for the create-lead dropdown", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const leadSourcesResult =
      await salesLeadsService.getLeadSourcesService(authenticatedSalesUser);

    assert.equal(leadSourcesResult.error, null);
    assert.deepEqual(leadSourcesResult.data, [
      {
        id: "source-1",
        name: "CarWale",
        description: "Marketplace lead source",
      },
      {
        id: "source-2",
        name: "Walk-in",
        description: "Direct showroom visit",
      },
    ]);
  });

  it("returns active branches for the create-lead dropdown", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const branchesResult =
      await salesLeadsService.getBranchesService(authenticatedSalesUser);

    assert.equal(branchesResult.error, null);
    assert.deepEqual(branchesResult.data, [
      { id: "branch-1", name: "Calgary North" },
      { id: "branch-2", name: "Calgary South" },
    ]);
  });

  it("returns car models scoped to the selected brand", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const carModelsResult = await salesLeadsService.getCarModelsService(
      authenticatedSalesUser,
      "Maruti Suzuki",
    );

    assert.equal(carModelsResult.error, null);
    assert.deepEqual(carModelsResult.data, [
      { id: "model-2", name: "Swift", carBrandId: "brand-2" },
    ]);
  });

  it("returns lead details for an assigned sales user", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const leadDetailsResult = await salesLeadsService.getLeadDetailsService(
      authenticatedSalesUser,
      "lead-1",
    );

    assert.equal(leadDetailsResult.error, null);
    assert.equal(leadDetailsResult.data?.id, "lead-1");
    assert.equal(leadDetailsResult.data?.assignedTo?.id, "SP001");
    assert.equal(leadDetailsResult.data?.source, "CarWale");
    assert.equal(leadDetailsResult.data?.status, "NEW");
    assert.equal(leadDetailsResult.data?.carBrand, "Hyundai");
    assert.equal(leadDetailsResult.data?.carModel, "i10");
  });

  it("returns a forbidden error when the lead is owned by another user", async () => {
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      getLeadRecord: async () => ({
        ...baseLeadRecord,
        creator_user_id: "user-row-2",
      }),
      getLeadUserRecords: async () => [
        {
          lead_id: "lead-1",
          user_id: "user-row-2",
          is_primary: true,
        },
      ],
    });

    const leadDetailsResult = await salesLeadsService.getLeadDetailsService(
      authenticatedSalesUser,
      "lead-1",
    );

    assert.equal(leadDetailsResult.data, null);
    assert.equal(leadDetailsResult.error?.message, "You are not allowed to access this lead.");
    assert.equal(
      (leadDetailsResult.error as SalesLeadServiceErrorData | null)?.code,
      "FORBIDDEN",
    );
  });

  it("returns a conflict when another lead already uses the same phone", async () => {
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      getLeadByPhone: async () => ({
        ...baseLeadRecord,
        id: "lead-2",
      }),
    });

    const updateLeadDetailsResult =
      await salesLeadsService.updateLeadDetailsService(
        authenticatedSalesUser,
        "lead-1",
        {
          fullName: "Rahul Sharma",
          phone: "9876543210",
          email: "rahul@example.com",
          source: "CarWale",
          referrerName: null,
          referrerPhone: null,
          carBrand: "Hyundai",
          carModel: "i10",
          variantName: "Sportz",
          colorPreference: "Red",
          budget: "6-8 Lakh",
          isUsed: true,
        },
      );

    assert.equal(updateLeadDetailsResult.data, null);
    assert.equal(
      updateLeadDetailsResult.error?.message,
      "A lead with this phone number already exists.",
    );
    assert.equal(
      (updateLeadDetailsResult.error as SalesLeadServiceErrorData | null)?.code,
      "CONFLICT",
    );
  });

  it("maps a database duplicate-phone error to a conflict when updating a lead", async () => {
    const duplicatePhoneError = Object.assign(
      new Error('duplicate key value violates unique constraint "leads_phone_key"'),
      {
        code: "23505",
        details: "Key (phone)=(9876543210) already exists.",
        constraint: "leads_phone_key",
      },
    );
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      getLeadByPhone: async () => null,
      updateLeadRecord: async () => {
        throw duplicatePhoneError;
      },
    });

    const updateLeadDetailsResult =
      await salesLeadsService.updateLeadDetailsService(
        authenticatedSalesUser,
        "lead-1",
        {
          fullName: "Rahul Sharma",
          phone: "9876543210",
          email: "rahul@example.com",
          source: "CarWale",
          referrerName: null,
          referrerPhone: null,
          carBrand: "Hyundai",
          carModel: "i10",
          variantName: "Sportz",
          colorPreference: "Red",
          budget: "6-8 Lakh",
          isUsed: true,
        },
      );

    assert.equal(updateLeadDetailsResult.data, null);
    assert.equal(
      updateLeadDetailsResult.error?.message,
      "A lead with this phone number already exists.",
    );
    assert.equal(
      (updateLeadDetailsResult.error as SalesLeadServiceErrorData | null)?.code,
      "CONFLICT",
    );
  });

  it("creates a note and returns the authored response payload", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const createLeadNoteResult = await salesLeadsService.createLeadNoteService(
      authenticatedSalesUser,
      "lead-1",
      {
        content: "Customer asked for a callback after 6 PM.",
      },
    );

    assert.equal(createLeadNoteResult.error, null);
    assert.equal(createLeadNoteResult.data?.leadId, "lead-1");
    assert.equal(createLeadNoteResult.data?.author?.id, "SP001");
  });

  it("maps status activity ids into readable status names", async () => {
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      getLeadActivityRecords: async () => [
        {
          lead_id: "lead-1",
          from_status_id: "status-new",
          to_status_id: "status-contacted",
          user_id: "user-row-1",
          updated_at: "2026-05-15T10:30:00.000Z",
        },
      ],
    });

    const leadActivitiesResult = await salesLeadsService.getLeadActivitiesService(
      authenticatedSalesUser,
      "lead-1",
    );

    assert.equal(leadActivitiesResult.error, null);
    assert.equal(
      leadActivitiesResult.data?.[0]?.description,
      "Lead status changed from NEW to CONTACTED.",
    );
  });

  it("stores lost_reason_id when updating a lost lead status", async () => {
    let updatedPayload: object | null = null;
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      updateLeadRecord: async (_leadId: string, payload: object) => {
        updatedPayload = payload;

        return {
          ...baseLeadRecord,
          ...payload,
          status_id: "status-lost",
          lost_reason_id: "lost-reason-1",
        };
      },
    });

    const updateLeadStatusResult = await salesLeadsService.updateLeadStatusService(
      authenticatedSalesUser,
      "lead-1",
      {
        status: "LOST",
        lostReason: "Budget issue",
      },
    );

    assert.equal(updateLeadStatusResult.error, null);
    assert.deepEqual(updatedPayload, {
      status_id: "status-lost",
      lost_reason_id: "lost-reason-1",
    });
    assert.equal(updateLeadStatusResult.data?.lostReason, "Budget issue");
  });

  it("creates a lead and uses the generated lead id for the initial note", async () => {
    const createdNotePayloads: Array<{
      lead_id: string;
      user_id: string;
      note_text: string;
    }> = [];
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      createLeadNoteRecord: async (payload: {
        lead_id: string;
        user_id: string;
        note_text: string;
      }) => {
        createdNotePayloads.push(payload);

        return {
          lead_id: payload.lead_id,
          user_id: payload.user_id,
          note_text: payload.note_text,
          created_at: "2026-05-15T10:30:00.000Z",
        };
      },
    });

    const createLeadResult = await salesLeadsService.createLeadService(
      authenticatedSalesUser,
      {
        fullName: "Rahul Sharma",
        phone: "9999999999",
        email: "rahul@example.com",
        source: "CarWale",
        status: "NEW",
        referrerName: null,
        referrerPhone: null,
        carBrand: "Hyundai",
        carModel: "i10",
        variantName: "Sportz",
        colorPreference: "Red",
        budget: "6-8 Lakh",
        isUsed: true,
        initialNote: "Customer asked for a callback after 6 PM.",
      },
    );

    assert.equal(createLeadResult.error, null);
    assert.equal(createLeadResult.data?.lead.id, "lead-created");
    assert.equal(createLeadResult.data?.note?.leadId, "lead-created");
    assert.equal(
      createLeadResult.data?.note?.content,
      "Customer asked for a callback after 6 PM.",
    );
    assert.deepEqual(createdNotePayloads, [
      {
        lead_id: "lead-created",
        user_id: "user-row-1",
        note_text: "Customer asked for a callback after 6 PM.",
      },
    ]);
  });

  it("creates a lead with the selected status and lost reason id", async () => {
    let createdLeadStatusId: string | undefined;
    let createdLeadLostReasonId: string | null | undefined;
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      createLeadRecord: async (payload) => {
        createdLeadStatusId = payload.status_id;
        createdLeadLostReasonId = payload.lost_reason_id;

        return {
          ...baseLeadRecord,
          ...payload,
          id: "lead-created-with-status",
          status_id: "status-lost",
          lost_reason_id: "lost-reason-1",
        };
      },
    });

    const createLeadResult = await salesLeadsService.createLeadService(
      authenticatedSalesUser,
      {
        fullName: "Rahul Sharma",
        phone: "9999999995",
        email: "rahul@example.com",
        source: "CarWale",
        status: "LOST",
        lostReason: "Budget issue",
        referrerName: null,
        referrerPhone: null,
        carBrand: "Hyundai",
        carModel: "i10",
        variantName: "Sportz",
        colorPreference: "Red",
        budget: "6-8 Lakh",
        isUsed: true,
        initialNote: null,
      },
    );

    assert.equal(createLeadResult.error, null);
    assert.equal(createLeadResult.data?.lead.status, "LOST");
    assert.equal(createLeadResult.data?.lead.lostReason, "Budget issue");
    assert.equal(createdLeadStatusId, "status-lost");
    assert.equal(createdLeadLostReasonId, "lost-reason-1");
  });

  it("creates a lead without inserting a note when initialNote is omitted", async () => {
    let createdNoteCount = 0;
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      createLeadNoteRecord: async (payload: object) => {
        createdNoteCount += 1;

        return {
          lead_id: String((payload as { lead_id?: unknown }).lead_id),
          user_id: String((payload as { user_id?: unknown }).user_id),
          note_text: String((payload as { note_text?: unknown }).note_text),
          created_at: "2026-05-15T10:30:00.000Z",
        };
      },
    });

    const createLeadResult = await salesLeadsService.createLeadService(
      authenticatedSalesUser,
      {
        fullName: "Rahul Sharma",
        phone: "9999999998",
        email: "rahul@example.com",
        source: "CarWale",
        status: "NEW",
        referrerName: null,
        referrerPhone: null,
        carBrand: "Hyundai",
        carModel: "i10",
        variantName: "Sportz",
        colorPreference: "Red",
        budget: "6-8 Lakh",
        isUsed: true,
        initialNote: null,
      },
    );

    assert.equal(createLeadResult.error, null);
    assert.equal(createLeadResult.data?.lead.id, "lead-created");
    assert.equal(createLeadResult.data?.note, null);
    assert.equal(createdNoteCount, 0);
  });

  it("rejects a lead when the car model does not belong to the selected brand", async () => {
    const salesLeadsService = createSalesLeadsService(createDependencies());

    const createLeadResult = await salesLeadsService.createLeadService(
      authenticatedSalesUser,
      {
        fullName: "Rahul Sharma",
        phone: "9999999996",
        email: "rahul@example.com",
        source: "CarWale",
        status: "NEW",
        referrerName: null,
        referrerPhone: null,
        carBrand: "Maruti Suzuki",
        carModel: "Nexon",
        variantName: "Sportz",
        colorPreference: "Red",
        budget: "6-8 Lakh",
        isUsed: true,
        initialNote: null,
      },
    );

    assert.equal(createLeadResult.data, null);
    assert.equal(
      createLeadResult.error?.message,
      "Car model Nexon does not belong to car brand Maruti Suzuki.",
    );
    assert.equal(
      (createLeadResult.error as SalesLeadServiceErrorData | null)?.code,
      "BAD_REQUEST",
    );
  });

  it("maps a database duplicate-phone error to a conflict when creating a lead", async () => {
    const duplicatePhoneError = Object.assign(
      new Error('duplicate key value violates unique constraint "leads_phone_key"'),
      {
        code: "23505",
        details: "Key (phone)=(9999999997) already exists.",
        constraint: "leads_phone_key",
      },
    );
    const salesLeadsService = createSalesLeadsService({
      ...createDependencies(),
      getLeadByPhone: async () => null,
      createLeadRecord: async () => {
        throw duplicatePhoneError;
      },
    });

    const createLeadResult = await salesLeadsService.createLeadService(
      authenticatedSalesUser,
      {
        fullName: "Rahul Sharma",
        phone: "9999999997",
        email: "rahul@example.com",
        source: "CarWale",
        status: "NEW",
        referrerName: null,
        referrerPhone: null,
        carBrand: "Hyundai",
        carModel: "i10",
        variantName: "Sportz",
        colorPreference: "Red",
        budget: "6-8 Lakh",
        isUsed: true,
        initialNote: null,
      },
    );

    assert.equal(createLeadResult.data, null);
    assert.equal(
      createLeadResult.error?.message,
      "A lead with this phone number already exists.",
    );
    assert.equal(
      (createLeadResult.error as SalesLeadServiceErrorData | null)?.code,
      "CONFLICT",
    );
  });
});
