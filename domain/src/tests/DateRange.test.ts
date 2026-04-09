import { DateRange } from "../value-objects/DateRange";
import { assertLocalDate } from "../value-objects/LocalDate";

describe("LocalDate", () => {
  test("accepts YYYY-MM-DD", () => {
    expect(() => assertLocalDate("2026-04-04", "startDate")).not.toThrow();
  });

  test("rejects invalid format", () => {
    expect(() => assertLocalDate("2026/04/04", "startDate")).toThrow(
      "startDate must be in YYYY-MM-DD format",
    );
  });

  test("rejects non-existent calendar dates", () => {
    expect(() => assertLocalDate("2025-02-30", "startDate")).toThrow(
      "startDate must be a real calendar date",
    );
  });
});

describe("DateRange", () => {
  test("end is exclusive (adjacent ranges do not overlap)", () => {
    const a = DateRange.create("2026-04-04", "2026-04-06");
    const b = DateRange.create("2026-04-06", "2026-04-08");
    expect(a.overlaps(b)).toBe(false);
    expect(b.overlaps(a)).toBe(false);
  });

  test("detects overlap", () => {
    const a = DateRange.create("2026-04-04", "2026-04-06");
    const b = DateRange.create("2026-04-05", "2026-04-07");
    expect(a.overlaps(b)).toBe(true);
  });

  test("detects enveloping overlap", () => {
    const a = DateRange.create("2026-04-04", "2026-04-10");
    const b = DateRange.create("2026-04-06", "2026-04-08");
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
  });

  test("rejects invalid ranges", () => {
    expect(() => DateRange.create("2026-04-04", "2026-04-04")).toThrow(
      "endDate must be after startDate",
    );
    expect(() => DateRange.create("2026-04-05", "2026-04-04")).toThrow(
      "endDate must be after startDate",
    );
  });
});

