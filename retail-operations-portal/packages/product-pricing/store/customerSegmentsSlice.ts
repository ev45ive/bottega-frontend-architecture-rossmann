import type { CustomerSegment } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const customerSegmentsSlice = createListSlice<CustomerSegment>("customerSegments");
export const { setItems: setCustomerSegments } = customerSegmentsSlice.actions;
