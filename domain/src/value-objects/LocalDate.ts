import { ValidationError } from "../errors/DomainErrors";

export type LocalDate = string; // YYYY-MM-DD

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function assertLocalDate(value: string, fieldName = "date"): asserts value is LocalDate {
  if (!LOCAL_DATE_RE.test(value)) {
    throw new ValidationError(`${fieldName} must be in YYYY-MM-DD format`);
  }

  const [y, m, d] = value.split("-").map((part) => Number(part));
  const utc = new Date(Date.UTC(y, m - 1, d));

  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() + 1 !== m ||
    utc.getUTCDate() !== d
  ) {
    throw new ValidationError(`${fieldName} must be a real calendar date`);
  }
}

export function localDateToUtcMillis(value: LocalDate): number {
  assertLocalDate(value);
  const [y, m, d] = value.split("-").map((part) => Number(part));
  return Date.UTC(y, m - 1, d);
}

export function compareLocalDate(a: LocalDate, b: LocalDate): number {
  return localDateToUtcMillis(a) - localDateToUtcMillis(b);
}

