import { createServiceHook } from "../hooks/createServiceHook";

export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export const useBrandService = createServiceHook<Brand>({
  endpoint: "/brands",
  queryKey: "brands",
});
