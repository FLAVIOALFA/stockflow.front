import { createServiceHook } from "../hooks/createServiceHook";

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export const useCategoryService = createServiceHook<Category>({
  endpoint: "/categories",
  queryKey: "categories",
});
