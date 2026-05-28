// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// TYPES //
import { importLeadsRequestSchema } from "../src/modules/sales-leads/sales-leads.types.js";

describe("sales-leads.types", () => {
  it("accepts nullable optional fields in import rows", () => {
    const parseResult = importLeadsRequestSchema.safeParse({
      duplicateMode: "skip",
      rows: [
        {
          rowNumber: 2,
          fullName: "Rahul Sharma",
          phone: "9876543210",
          email: null,
          source: "CarWale",
          referrerName: null,
          referrerPhone: null,
          carBrand: null,
          carModel: null,
          variantName: null,
          colorPreference: null,
          budget: null,
          isUsed: null,
          status: "NEW",
          lostReason: null,
          initialNote: null,
        },
      ],
    });

    if (!parseResult.success) {
      throw parseResult.error;
    }

    assert.equal(parseResult.success, true);
    assert.equal(parseResult.data.rows[0]?.email, null);
    assert.equal(parseResult.data.rows[0]?.referrerName, null);
    assert.equal(parseResult.data.rows[0]?.referrerPhone, null);
    assert.equal(parseResult.data.rows[0]?.carBrand, null);
    assert.equal(parseResult.data.rows[0]?.carModel, null);
    assert.equal(parseResult.data.rows[0]?.variantName, null);
    assert.equal(parseResult.data.rows[0]?.colorPreference, null);
    assert.equal(parseResult.data.rows[0]?.budget, null);
    assert.equal(parseResult.data.rows[0]?.isUsed, null);
    assert.equal(parseResult.data.rows[0]?.lostReason, null);
    assert.equal(parseResult.data.rows[0]?.initialNote, null);
  });
});
