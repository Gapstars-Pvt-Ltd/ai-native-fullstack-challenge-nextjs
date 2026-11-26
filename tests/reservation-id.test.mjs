import assert from "node:assert/strict";
import { test } from "node:test";

import { parseReservationId } from "../src/lib/reservation-id.ts";

test("accepts positive PostgreSQL integer IDs", () => {
  assert.equal(parseReservationId("1"), 1);
  assert.equal(parseReservationId("2147483647"), 2147483647);
});

test("rejects malformed and out-of-range IDs", () => {
  for (const value of ["", "0", "-1", "1.5", "1e2", "01", " 1", "2147483648"]) {
    assert.equal(parseReservationId(value), null);
  }
});
