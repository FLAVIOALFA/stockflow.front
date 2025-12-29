import { createServiceHook } from "../hooks/createServiceHook";
import type { components } from "../types/api";

export type Movement = components['schemas']['Movement'];
export type MovementDetail = components['schemas']['InventoryMovementDetailComponent'];

export const useMovementService = createServiceHook<Movement>({
  endpoint: "/movements",
  queryKey: "movements",
  defaultParams: {
    populate: ['origin', 'destination', 'items', 'items.product']
  }
});
