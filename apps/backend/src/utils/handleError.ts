import { Response } from "express";
import { DomainError } from "../../../../domain/dist/errors/DomainErrors";

export function handleError(res: Response, err: unknown) {
  if (err instanceof DomainError) {
    const status =
      err.code === "VALIDATION" ? 400 :
      err.code === "NOT_FOUND" ? 404 :
      err.code === "NOT_AUTHORIZED" ? 403 :
      err.code === "CONFLICT" ? 409 :
      err.code === "INVARIANT" ? 409 :
      500;

    return res.status(status).json({ message: err.message, code: err.code });
  }

  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }

  return res.status(500).json({ message: String(err) });
}
