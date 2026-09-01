import type { CustomerSegment } from "@/types";
import { createListSlice } from "./createListSlice";

export const customerSegmentsSlice = createListSlice<CustomerSegment>("customerSegments");
export const { setItems: setCustomerSegments } = customerSegmentsSlice.actions;
