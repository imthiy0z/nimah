/**
 * Frontend-only mock data for Nimah (surplus food rescue).
 * Partner list: real Oman brands in the Nimah pilot — replace with API when live.
 */

import { foodImages } from './foodAssets';
import { heroForStore } from './partnerPhotos';

export type RescueBag = {
  id: string;
  title: string;
  blurb: string;
  retailValue: number;
  price: number;
  pickupWindow: string;
  left: number;
  tags: string[];
  image: any;
};

export type PartnerStore = {
  id: string;
  name: string;
  tagline: string;
  categories: string[];
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  address: string;
  /** Brand logo for badges/cards (separate from hero image). */
  logo: any;
  image: any;
  /** Demo: distance shown on Discover list cards */
  distanceKm: number;
  /** Demo: total branch count for the brand */
  branchCount: number;
  /** Official Instagram (@handle page) for the brand */
  instagramUrl?: string;
  /** Demo: surfaced in Discover “New on Nimah” collection */
  isNewOnNimah?: boolean;
  bags: RescueBag[];
};

export const CATEGORY_FILTERS = [
  'All',
  'Meals',
  'Bakery',
  'Groceries',
  'Flowers',
  'Vegan',
] as const;

export const MOCK_PICKUP_LOCATION = {
  headline: 'Pickup near',
  addressLine: 'Al Khoud, Muscat',
  hint: 'Tap to change',
} as const;

export const MOCK_STORES: PartnerStore[] = [
  {
    id: 'neeb',
    name: 'Neeb',
    tagline: 'Café · cakes · specialty coffee — Oman',
    categories: ['Bakery', 'Meals'],
    latitude: 23.505,
    longitude: 58.219,
    rating: 4.8,
    reviewCount: 940,
    address: 'Mall of Oman, Bawshar, Muscat',
    distanceKm: 1.2,
    branchCount: 3,
    logo: require('../assets/logos/neeb.webp'),
    image: heroForStore('neeb'),
    instagramUrl: 'https://www.instagram.com/neeb.om/',
    isNewOnNimah: true,
    bags: [
      {
        id: 'neeb-pastry-surprise',
        title: 'Cinnamon pastry cake',
        blurb: 'Surplus cinnamon pastries and cake slices from today — mix varies.',
        retailValue: 5.6,
        price: 1.12,
        pickupWindow: 'Today 7:00–9:00 PM',
        left: 5,
        tags: ['Bakery', 'Vegetarian'],
        image: foodImages.items.pastryBox,
      },
      {
        id: 'neeb-brunch-bundle',
        title: 'Brunch rolls platter',
        blurb: 'Surplus breakfast rolls and pastries when the café has extras.',
        retailValue: 4.6,
        price: 1.15,
        pickupWindow: 'Today 9:00–10:00 AM',
        left: 3,
        tags: ['Meals', 'Bakery'],
        image: foodImages.cuisines.breakfastPancakes,
      },
    ],
  },
  {
    id: 'kucu',
    name: 'Kucu',
    tagline: 'Sandwiches & crispy chicken — across Oman',
    categories: ['Meals'],
    latitude: 23.585,
    longitude: 58.422,
    rating: 4.6,
    reviewCount: 61200,
    address: 'Oman Avenues Mall, Seeb, Muscat',
    distanceKm: 2.8,
    branchCount: 12,
    logo: require('../assets/logos/kucu.webp'),
    image: heroForStore('kucu'),
    instagramUrl: 'https://www.instagram.com/kucu.om/',
    bags: [
      {
        id: 'kucu-combo-bag',
        title: 'Chicken sandwich combo',
        blurb: 'Surplus sandwich + side — kitchen extras near close.',
        retailValue: 4,
        price: 1.2,
        pickupWindow: 'Today 8:30–10:00 PM',
        left: 8,
        tags: ['Meals'],
        image: foodImages.cuisines.americanBurger,
      },
      {
        id: 'kucu-snack-pack',
        title: 'Crispy snack sliders',
        blurb: 'Small sliders, fries, or add-ons when available.',
        retailValue: 2.8,
        price: 1.12,
        pickupWindow: 'Today 3:00–4:00 PM',
        left: 6,
        tags: ['Meals'],
        image: foodImages.items.sandwichPlate,
      },
    ],
  },
  {
    id: 'omani-house',
    name: 'Omani House',
    tagline: 'Omani hospitality & regional favourites',
    categories: ['Meals'],
    latitude: 23.614,
    longitude: 58.545,
    rating: 4.7,
    reviewCount: 1820,
    address: 'Al Qurum, Muscat',
    distanceKm: 3.1,
    branchCount: 2,
    logo: require('../assets/logos/omani house.webp'),
    image: heroForStore('omani-house'),
    instagramUrl: 'https://www.instagram.com/omanihouse.om/',
    bags: [
      {
        id: 'oh-mezze-night',
        title: 'Mezze plate with rice',
        blurb: 'Surplus dips, bread, and rice plates — great for sharing.',
        retailValue: 4.4,
        price: 1.1,
        pickupWindow: 'Today 6:00–8:00 PM',
        left: 4,
        tags: ['Meals', 'Vegetarian'],
        image: foodImages.cuisines.lebaneseMezze,
      },
      {
        id: 'oh-grill-plate',
        title: 'Grill plate',
        blurb: 'Surplus grilled meats or fish with rice when available.',
        retailValue: 5,
        price: 1,
        pickupWindow: 'Today 8:00–8:30 PM',
        left: 3,
        tags: ['Meals'],
        image: foodImages.cuisines.middleEasternRice,
      },
    ],
  },
  {
    id: 'lovera',
    name: 'Lovera',
    tagline: 'Patisserie, desserts & sweet favourites',
    categories: ['Bakery', 'Meals'],
    latitude: 23.602,
    longitude: 58.478,
    rating: 4.9,
    reviewCount: 2100,
    address: 'Al Khuwair, Muscat',
    distanceKm: 4.5,
    branchCount: 1,
    logo: require('../assets/logos/lovera.webp'),
    image: heroForStore('lovera'),
    instagramUrl: 'https://www.instagram.com/lovera.om/',
    bags: [
      {
        id: 'lov-dessert-magic',
        title: 'Dessert magic selection',
        blurb: 'Surplus cakes, tarts, and sweets — contents change daily.',
        retailValue: 6,
        price: 1.2,
        pickupWindow: 'Today 5:30–7:00 PM',
        left: 5,
        tags: ['Bakery', 'Vegetarian'],
        image: foodImages.cuisines.bakeryCroissant,
      },
      {
        id: 'lov-mini-pastries',
        title: 'Mini pastries assortment',
        blurb: 'Surplus bite-size pastries perfect for office or family.',
        retailValue: 3.6,
        price: 1.08,
        pickupWindow: 'Today 7:00–7:30 PM',
        left: 4,
        tags: ['Bakery'],
        image: foodImages.items.pastryBox,
      },
    ],
  },
  {
    id: 'gregandi',
    name: 'Gregandi',
    tagline: 'Italian kitchen — pasta, pizza & more',
    categories: ['Meals', 'Bakery'],
    latitude: 23.628,
    longitude: 58.248,
    rating: 4.5,
    reviewCount: 890,
    address: 'Al Mouj Muscat',
    distanceKm: 5.2,
    branchCount: 4,
    logo: require('../assets/logos/gregandi.webp'),
    image: heroForStore('gregandi'),
    instagramUrl: 'https://www.instagram.com/gregandi_restaurant/',
    isNewOnNimah: true,
    bags: [
      {
        id: 'greg-pizza-surprise',
        title: 'Pizza surprise plate',
        blurb: 'Surplus end-of-service pizza or pinsa — toppings vary.',
        retailValue: 3,
        price: 1.2,
        pickupWindow: 'Today 10:00–10:30 PM',
        left: 6,
        tags: ['Meals', 'Vegetarian'],
        image: foodImages.cuisines.italianPizza,
      },
      {
        id: 'greg-pasta-night',
        title: 'Pasta night special',
        blurb: 'Surplus pasta mains or oven dishes when the kitchen has extras.',
        retailValue: 4.8,
        price: 1.2,
        pickupWindow: 'Today 9:00–9:30 PM',
        left: 3,
        tags: ['Meals'],
        image: foodImages.cuisines.steakDinner,
      },
    ],
  },
  {
    id: 'ladh',
    name: 'Ladh',
    tagline: 'Traditional sweets & Omani desserts',
    categories: ['Bakery', 'Meals'],
    latitude: 23.574,
    longitude: 58.404,
    rating: 4.7,
    reviewCount: 1260,
    address: 'Al Hail, Muscat',
    distanceKm: 3.7,
    branchCount: 2,
    logo: require('../assets/logos/ladh.png'),
    image: heroForStore('ladh'),
    instagramUrl: 'https://www.instagram.com/ladh.om/',
    isNewOnNimah: true,
    bags: [
      {
        id: 'ladh-sweets-box',
        title: 'Omani sweets assortment',
        blurb: 'Surplus halwa and traditional sweets from today.',
        retailValue: 3.8,
        price: 1.14,
        pickupWindow: 'Today 6:00–7:30 PM',
        left: 4,
        tags: ['Bakery', 'Vegetarian'],
        image: foodImages.cuisines.bakeryCroissant,
      },
      {
        id: 'ladh-mix-dessert',
        title: 'Seasonal dessert mix',
        blurb: 'Surplus desserts and pastries when available.',
        retailValue: 4.6,
        price: 0.92,
        pickupWindow: 'Today 8:30–9:00 PM',
        left: 5,
        tags: ['Bakery'],
        image: foodImages.items.pastryBox,
      },
    ],
  },
  {
    id: 'bloom-stem',
    name: 'Bloom & Stem',
    tagline: 'Fresh bouquets, plants & floral gifts — Muscat',
    categories: ['Flowers'],
    latitude: 23.598,
    longitude: 58.389,
    rating: 4.8,
    reviewCount: 420,
    address: 'Al Qurum, Muscat',
    distanceKm: 2.1,
    branchCount: 1,
    logo: require('../assets/flowers/bloom-logo.jpg'),
    image: heroForStore('bloom-stem'),
    instagramUrl: 'https://www.instagram.com/explore/tags/muscatflowers/',
    isNewOnNimah: true,
    bags: [
      {
        id: 'bs-surprise-bouquet',
        title: 'Surprise bouquet bag',
        blurb: 'End-of-day stems and seasonal blooms — colours and varieties vary.',
        retailValue: 12,
        price: 2.4,
        pickupWindow: 'Today 6:00–8:00 PM',
        left: 4,
        tags: ['Flowers'],
        image: foodImages.grocery.fruitStand,
      },
      {
        id: 'bs-petite-arrangement',
        title: 'Petite arrangement',
        blurb: 'Small desk or table arrangement from surplus stock.',
        retailValue: 8,
        price: 1.6,
        pickupWindow: 'Today 7:00–8:30 PM',
        left: 6,
        tags: ['Flowers'],
        image: foodImages.grocery.freshProduce,
      },
      {
        id: 'bs-greenery-bundle',
        title: 'Greenery & filler bundle',
        blurb: 'Extra foliage and fillers — great for DIY arrangements.',
        retailValue: 5,
        price: 1,
        pickupWindow: 'Tomorrow 5:00–7:00 PM',
        left: 8,
        tags: ['Flowers'],
        image: foodImages.cuisines.veganBowl,
      },
    ],
  },
  {
    id: 'green-cart-market',
    name: 'Green Cart Market',
    tagline: 'Local produce, bakery & dairy — daily surplus boxes',
    categories: ['Groceries', 'Vegan'],
    latitude: 23.552,
    longitude: 58.365,
    rating: 4.6,
    reviewCount: 1180,
    address: 'Al Khuwair, Muscat',
    distanceKm: 1.8,
    branchCount: 2,
    logo: require('../assets/grocery-nimah/store-logo.jpg'),
    image: heroForStore('green-cart-market'),
    instagramUrl: 'https://www.instagram.com/explore/tags/muscatgrocery/',
    bags: [
      {
        id: 'gcm-produce-rescue',
        title: 'Produce rescue box',
        blurb: 'Surplus fruit and veg from today — mix changes with the season.',
        retailValue: 6,
        price: 1.2,
        pickupWindow: 'Today 7:00–9:00 PM',
        left: 10,
        tags: ['Groceries', 'Vegan'],
        image: require('../assets/grocery-nimah/bag-produce.jpg'),
      },
      {
        id: 'gcm-bakery-dairy',
        title: 'Bakery & dairy bundle',
        blurb: 'Bread, pastries, or dairy nearing best-before — great same-day use.',
        retailValue: 5.5,
        price: 1.1,
        pickupWindow: 'Today 8:00–9:30 PM',
        left: 7,
        tags: ['Groceries'],
        image: require('../assets/grocery-nimah/bag-bakery.jpg'),
      },
      {
        id: 'gcm-yogurt-fruit',
        title: 'Yogurt & fruit pack',
        blurb: 'Yogurt cups and cut fruit when the counter has extras.',
        retailValue: 4.2,
        price: 0.95,
        pickupWindow: 'Tomorrow 9:00–11:00 AM',
        left: 5,
        tags: ['Groceries', 'Vegetarian'],
        image: require('../assets/grocery-nimah/bag-market.jpg'),
      },
    ],
  },
];

export const MAP_DEMO_PARTNERS = MOCK_STORES;

export function getStoreById(id: string): PartnerStore | undefined {
  return MOCK_STORES.find((s) => s.id === id);
}

export function getMinBagPrice(store: PartnerStore): number {
  if (store.bags.length === 0) return 0;
  return Math.min(...store.bags.map((b) => b.price));
}

/** Pickup “day bucket” label key for Discover cards. */
export function getPickupDayLabelKey(
  pickupWindow: string
): 'discover.pickupToday' | 'discover.pickupTomorrow' | 'discover.pickupLater' {
  const s = pickupWindow.toLowerCase();
  if (s.includes('tomorrow')) return 'discover.pickupTomorrow';
  if (s.includes('tonight') || s.includes('today')) return 'discover.pickupToday';
  if (s.includes('now')) return 'discover.pickupToday';
  return 'discover.pickupLater';
}

/** True if any item has a pickup window classified as “today”. */
export function hasPickupAvailableNow(store: PartnerStore): boolean {
  return store.bags.some(
    (b) => getPickupDayLabelKey(b.pickupWindow) === 'discover.pickupToday'
  );
}

/**
 * Single day label for store UI: if any bag is “today”, show today; else if any tomorrow; else later.
 */
export function getStorePickupDayKey(
  store: PartnerStore
): 'discover.pickupToday' | 'discover.pickupTomorrow' | 'discover.pickupLater' {
  const keys = store.bags.map((b) => getPickupDayLabelKey(b.pickupWindow));
  if (keys.includes('discover.pickupToday')) return 'discover.pickupToday';
  if (keys.includes('discover.pickupTomorrow')) return 'discover.pickupTomorrow';
  return 'discover.pickupLater';
}

export function getBagImage(store: PartnerStore, bagId: string): any {
  const bag = store.bags.find((b) => b.id === bagId);
  return bag?.image ?? store.image;
}

export function getFeaturedOffers(): { store: PartnerStore; bag: RescueBag }[] {
  return MOCK_STORES.slice(0, 4).map((store) => ({
    store,
    bag: store.bags[0],
  }));
}

export type MockOrder = {
  id: string;
  storeId: string;
  bagId: string;
  storeName: string;
  bagTitle: string;
  price: number;
  pickupWindow: string;
  status: 'upcoming' | 'completed';
  dateLabel: string;
};

export const DELIVERY = {
  etaMinutes: 8,
  routeProgress: 0.64,
  driverName: 'Sara M.',
  driverNameKey: 'sara',
} as const;

export const DELIVERY_TIMELINE_STEPS: {
  key: string;
  done: boolean;
  active?: boolean;
}[] = [
  { key: 'confirmed', done: true },
  { key: 'packed', done: true },
  { key: 'route', done: true, active: true },
  { key: 'drop', done: false },
];

export const MOCK_REWARD_BALANCE = {
  points: 1240,
  tier: 'Gold',
  tierEmoji: '🥇',
  tierKey: 'gold',
  nextTierName: 'Platinum',
  nextTierKey: 'platinum',
  nextTierAt: 2000,
  lifetimeEarned: 3420,
} as const;

export const MOCK_WAYS_TO_EARN = [
  {
    id: 'rescue',
    titleKey: 'rewards.earn.rescue',
    points: '+50',
    icon: 'bag-handle-outline' as const,
    tint: 'primary' as const,
  },
  {
    id: 'streak',
    titleKey: 'rewards.earn.streak',
    points: '+120',
    icon: 'flame-outline' as const,
    tint: 'primary' as const,
  },
  {
    id: 'refer',
    titleKey: 'rewards.earn.refer',
    points: '+200',
    icon: 'people-outline' as const,
    tint: 'primary' as const,
  },
  {
    id: 'review',
    titleKey: 'rewards.earn.review',
    points: '+25',
    icon: 'star-outline' as const,
    tint: 'muted' as const,
  },
];

export const MOCK_REDEEM_OPTIONS = [
  {
    id: 'r1',
    omrDiscount: 2,
    cost: 400,
    icon: 'pricetag-outline' as const,
  },
  {
    id: 'r2',
    titleKey: 'rewards.redeemOffers.priority',
    cost: 600,
    icon: 'rocket-outline' as const,
  },
  {
    id: 'r3',
    titleKey: 'rewards.redeemOffers.donate',
    cost: 500,
    icon: 'heart-outline' as const,
  },
];

export type MockRewardActivity = {
  id: string;
  labelKey: string;
  points: number;
  dateKey: string;
};

export const MOCK_REWARD_ACTIVITY: MockRewardActivity[] = [
  { id: 'a1', labelKey: 'rewards.activity.neeb', points: 50, dateKey: 'dates.today' },
  { id: 'a2', labelKey: 'rewards.activity.a2', points: 30, dateKey: 'dates.yesterday' },
  { id: 'a3', labelKey: 'rewards.activity.a3', points: 15, dateKey: 'dates.mar21' },
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ord-1',
    storeId: 'neeb',
    bagId: 'neeb-pastry-surprise',
    storeName: 'Neeb',
    bagTitle: 'Pastry surprise box',
    price: 4.25,
    pickupWindow: 'Tonight 8:00–9:00 PM',
    status: 'upcoming',
    dateLabel: 'Mar 23',
  },
  {
    id: 'ord-2',
    storeId: 'kucu',
    bagId: 'kucu-combo-bag',
    storeName: 'Kucu',
    bagTitle: 'Combo surplus bag',
    price: 4.99,
    pickupWindow: 'Picked up',
    status: 'completed',
    dateLabel: 'Mar 20',
  },
  {
    id: 'ord-3',
    storeId: 'lovera',
    bagId: 'lov-dessert-magic',
    storeName: 'Lovera',
    bagTitle: 'Dessert magic box',
    price: 5.49,
    pickupWindow: 'Picked up',
    status: 'completed',
    dateLabel: 'Mar 18',
  },
];

/** Partner-facing: incoming customer orders to prepare (mock). */
export type StoreOwnerIncomingOrderStatus = 'new' | 'preparing' | 'ready';

export type StoreOwnerIncomingOrder = {
  id: string;
  customerLabel: string;
  itemsSummary: string;
  qty: number;
  totalOmr: number;
  pickupWindow: string;
  status: StoreOwnerIncomingOrderStatus;
  placedAt: string;
};

export type StoreOwnerMessageThread = {
  id: string;
  customerLabel: string;
  preview: string;
  timeLabel: string;
  unread: boolean;
};

const GENERIC_OWNER_ORDERS: StoreOwnerIncomingOrder[] = [
  {
    id: 'in-1',
    customerLabel: 'Ahmed K.',
    itemsSummary: 'Cinnamon pastry cake',
    qty: 2,
    totalOmr: 2.24,
    pickupWindow: 'Today 7:00–9:00 PM',
    status: 'new',
    placedAt: '12 min ago',
  },
  {
    id: 'in-2',
    customerLabel: 'Sara M.',
    itemsSummary: 'Brunch rolls platter',
    qty: 1,
    totalOmr: 1.15,
    pickupWindow: 'Today 9:00–10:00 AM',
    status: 'preparing',
    placedAt: '34 min ago',
  },
  {
    id: 'in-3',
    customerLabel: 'Omar H.',
    itemsSummary: 'Chicken sandwich combo',
    qty: 1,
    totalOmr: 1.2,
    pickupWindow: 'Today 8:30–10:00 PM',
    status: 'ready',
    placedAt: '1 hr ago',
  },
];

const GENERIC_OWNER_THREADS: StoreOwnerMessageThread[] = [
  {
    id: 'th-1',
    customerLabel: 'Ahmed K.',
    preview: 'Can I pick up 10 minutes late?',
    timeLabel: '5m',
    unread: true,
  },
  {
    id: 'th-2',
    customerLabel: 'Nimah support',
    preview: 'Your listing was approved.',
    timeLabel: '1d',
    unread: false,
  },
];

export function resolveOwnerStoreIdFromHint(hint?: string): string {
  const list = MOCK_STORES;
  if (!hint?.trim()) return list[0]?.id ?? 'neeb';
  const t = hint.trim().toLowerCase();
  const byId = list.find((s) => s.id === t);
  if (byId) return byId.id;
  const byName = list.find(
    (s) => s.name.toLowerCase().includes(t) || t.includes(s.name.toLowerCase())
  );
  return byName?.id ?? list[0]?.id ?? 'neeb';
}

export function getStoreOwnerIncomingOrders(storeId: string): StoreOwnerIncomingOrder[] {
  return GENERIC_OWNER_ORDERS;
}

export function getStoreOwnerMessageThreads(_storeId: string): StoreOwnerMessageThread[] {
  return GENERIC_OWNER_THREADS;
}
