import { createServiceHook } from "../hooks/createServiceHook";
import type { components } from "../types/api";

// We can leverage the generated types if possible, or define a clean interface.
// For now, let's define it explicitly based on the schema provided to ensure we capture the relations correctly.

export type Stock = components["schemas"]["Stock"];

export const useStockService = createServiceHook<Stock>({
  endpoint: "/stocks",
  queryKey: "stocks",
  defaultParams: {
    populate: ['branch', 'product']
  }
});

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useBulkCreateStocks = () => {
    // Using a new mutation for custom behavior
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (payload: { branchId: number; products: { productId: number; quantity: number }[] }) => {
            const { data } = await api.post("/stocks/bulk-update", payload);
            return data;
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ["stocks"] });
        }
    });
};
