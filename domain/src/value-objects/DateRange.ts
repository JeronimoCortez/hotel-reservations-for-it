import { ValidationError } from "../errors/DomainErrors";
import { compareLocalDate, LocalDate } from "./LocalDate";

export class DateRange {
  private constructor(
    public readonly start: LocalDate,
    public readonly end: LocalDate, // exclusive
  ) {}

  static create(start: LocalDate, end: LocalDate): DateRange {
    if (compareLocalDate(end, start) <= 0) {
      throw new ValidationError("endDate must be after startDate");
    }
    return new DateRange(start, end);
  }

  overlaps(other: DateRange): boolean {
    return compareLocalDate(this.start, other.end) < 0 && compareLocalDate(this.end, other.start) > 0;
  }
}

