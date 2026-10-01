import { Decimal } from "@prisma/client/runtime/library";

/** Recursively converts Prisma Decimal fields to plain numbers so res.json() doesn't emit Decimal objects. */
export function serializeDecimals<T>(value: T): T {
  if (value instanceof Decimal) {
    return value.toNumber() as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeDecimals(item)) as unknown as T;
  }
  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = serializeDecimals(val);
    }
    return result as unknown as T;
  }
  return value;
}
