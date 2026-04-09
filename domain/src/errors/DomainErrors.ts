export type DomainErrorCode =
  | "VALIDATION"
  | "NOT_FOUND"
  | "NOT_AUTHORIZED"
  | "CONFLICT"
  | "INVARIANT";

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super("VALIDATION", message);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

export class NotAuthorizedError extends DomainError {
  constructor(message: string) {
    super("NOT_AUTHORIZED", message);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super("CONFLICT", message);
  }
}

export class InvariantError extends DomainError {
  constructor(message: string) {
    super("INVARIANT", message);
  }
}

