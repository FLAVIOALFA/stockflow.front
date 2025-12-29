import { createServiceHook } from "../hooks/createServiceHook";

export interface Branch {
  id: number;
  documentId: string;
  name: string;
  type: 'local' | 'deposit';
  address: string;
}

export const useBranchService = createServiceHook<Branch>({
  endpoint: "/branches",
  queryKey: "branches",
});
