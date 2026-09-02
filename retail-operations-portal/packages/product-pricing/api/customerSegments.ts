import customerSegmentsRaw from "../mock-data/customerSegments.json";
import type { CustomerSegment } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, CustomerSegment>(customerSegmentsRaw.map((s) => [s.id, s]));

export async function listCustomerSegments(): Promise<CustomerSegment[]> {
  await delay();
  return [...db.values()];
}
