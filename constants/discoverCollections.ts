import type { PartnerStore } from './mockData';

/**
 * Discover “collections” images (custom).
 * Mapped from `assets/catogary/`:
 * explore / flash / new / sweet(+bakery).
 * (If you add a `feast` image later, we can map it too.)
 */
const collectionExplore = require('../assets/catogary/explore.jpg');
const collectionFlash = require('../assets/catogary/flash savings.webp');
const collectionNew = require('../assets/catogary/new on nimah.png');
const collectionSweet = require('../assets/catogary/sweet and bakery.jpg');
// No feast image in assets/catogary/ yet; keep the previous one.
const collectionFeast = require('../assets/discover-collections/feast.jpg');
const collectionFlowers = require('../assets/food/grocery/fruit-stand.jpg');
const collectionGrocery = require('../assets/partners/green-cart-market.jpg');

export type DiscoverCollection = {
  id: string;
  titleKey: string;
  /** Optional text pill on the image */
  pillKey?: string;
  /** Optional Ionicons name — when set, shows icon badge instead of pill text (use pillKey for a11y). */
  pillIcon?: string;
  image: any;
  filter: (stores: PartnerStore[]) => PartnerStore[];
};

function hasStrongSavingBag(store: PartnerStore): boolean {
  return store.bags.some((b) => b.retailValue >= b.price * 2);
}

/**
 * Discover “featured collections” — same *idea* as horizontal category rails
 * (explore, savings spotlight, new partners, dessert-style, gathering meals)
 * with Nimah-specific filters.
 */
export const DISCOVER_COLLECTIONS: DiscoverCollection[] = [
  {
    id: 'explore',
    titleKey: 'discover.collections.explore',
    image: collectionExplore,
    filter: (stores) => stores,
  },
  {
    id: 'flash',
    titleKey: 'discover.collections.flash',
    pillKey: 'discover.collections.biggerSaves',
    pillIcon: 'pricetag',
    image: collectionFlash,
    filter: (stores) => stores.filter(hasStrongSavingBag),
  },
  {
    id: 'new',
    titleKey: 'discover.collections.newPartners',
    image: collectionNew,
    filter: (stores) => stores.filter((s) => s.isNewOnNimah === true),
  },
  {
    id: 'sweet',
    titleKey: 'discover.collections.sweet',
    image: collectionSweet,
    filter: (stores) => stores.filter((s) => s.categories.includes('Bakery')),
  },
  {
    id: 'feast',
    titleKey: 'discover.collections.feast',
    image: collectionFeast,
    filter: (stores) => stores.filter((s) => s.categories.includes('Meals')),
  },
  {
    id: 'flowers',
    titleKey: 'discover.collections.flowers',
    pillIcon: 'flower-outline',
    pillKey: 'discover.collections.flowersPillA11y',
    image: collectionFlowers,
    filter: (stores) => stores.filter((s) => s.categories.includes('Flowers')),
  },
  {
    id: 'grocery',
    titleKey: 'discover.collections.grocery',
    pillIcon: 'basket-outline',
    pillKey: 'discover.collections.groceryPillA11y',
    image: collectionGrocery,
    filter: (stores) => stores.filter((s) => s.categories.includes('Groceries')),
  },
];
