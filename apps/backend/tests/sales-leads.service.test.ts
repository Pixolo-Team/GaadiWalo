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
      brandName === "Hyundai" ? "brand-1" : null,
    getCarBrandNameById: async (brandId: string) =>
      brandId === "brand-1" ? "Hyundai" : null,
    getCarModelIdByName: async (modelName: string, carBrandId: string | null) =>
      modelName === "i10" && carBrandId === "brand-1" ? "model-1" : null,
    getCarModelNameById: async (modelId: string) =>
      modelId === "model-1" ? "i10" : null,
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
});
