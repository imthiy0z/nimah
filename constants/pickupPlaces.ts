/** Saved pickup area options (ids map to i18n `pickup.places.<id>`). */
export const PICKUP_PLACE_IDS = ['default', 'qurum', 'seeb', 'ruwi', 'mouj'] as const;

export type PickupPlaceId = (typeof PICKUP_PLACE_IDS)[number];

export const PICKUP_PLACE_STORAGE_KEY = '@nimah/pickup_place_id';

export function isPickupPlaceId(value: string): value is PickupPlaceId {
  return (PICKUP_PLACE_IDS as readonly string[]).includes(value);
}
