// LIBRARIES //
import assert from "node:assert/strict";
import test from "node:test";

// SERVICES //
import { normalizeRoleValue } from "../src/config/supabase.js";

test("normalizeRoleValue maps sales-style roles to the canonical sales role", () => {
  assert.equal(normalizeRoleValue("sales_rep"), "sales");
  assert.equal(normalizeRoleValue("Sales Executive"), "sales");
  assert.equal(normalizeRoleValue("Senior SE"), "sales");
});

test("normalizeRoleValue maps admin-style roles to the canonical admin role", () => {
  assert.equal(normalizeRoleValue("admin"), "admin");
  assert.equal(normalizeRoleValue("Super Admin"), "admin");
});

test("normalizeRoleValue preserves unknown roles after normalization", () => {
  assert.equal(normalizeRoleValue("Manager"), "manager");
});
