/**
 * Partner imagery. Official Instagram avatars can’t be fetched reliably for bundling;
 * use curated stock heroes per brand, or add `assets/stores/{id}.jpg` and register below.
 */
import { foodImages } from './foodAssets';

const STORE_PARTNER_OVERRIDES: Record<string, any> = {
  neeb: require('../assets/cover/neeb.jpg'),
  kucu: require('../assets/cover/kucu.jpg'),
  'omani-house': require('../assets/cover/omani house.jpg'),
  lovera: require('../assets/cover/lovera.png'),
  gregandi: require('../assets/cover/gregandi.png'),
  ladh: require('../assets/cover/ladh.jpg'),
  'green-cart-market': require('../assets/partners/green-cart-market.jpg'),
};

const partnerStockHero: Record<string, any> = {
  neeb: foodImages.cuisines.coffeePastry,
  kucu: foodImages.cuisines.americanBurger,
  'omani-house': foodImages.cuisines.middleEasternRice,
  lovera: foodImages.cuisines.bakeryCroissant,
  gregandi: foodImages.cuisines.italianPizza,
  'bloom-stem': foodImages.grocery.fruitStand,
  'green-cart-market': foodImages.grocery.freshProduce,
};

export function heroForStore(storeId: string): any {
  if (STORE_PARTNER_OVERRIDES[storeId] != null) return STORE_PARTNER_OVERRIDES[storeId];
  return partnerStockHero[storeId] ?? foodImages.famousFood;
}
