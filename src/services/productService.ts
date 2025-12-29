import { createServiceHook } from "../hooks/createServiceHook";
import type { components } from "../types/api";

export type Product = components['schemas']['Product'];


export const useProductService = createServiceHook<Product>({
  endpoint: "/products",
  queryKey: "products",
  defaultParams: {
    populate: ['mainImage', 'brand', 'categories', 'details']
  }
});
