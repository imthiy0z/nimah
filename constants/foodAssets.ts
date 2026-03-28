/**
 * Local food photos under assets/food/ (cuisines / grocery / items).
 * Photos from Unsplash (https://unsplash.com/license) — free to use in apps.
 */
export const foodImages = {
  famousFood: require('../assets/food/famous-food.jpg'),
  fullEnglishBreakfast: require('../assets/food/full-english-breakfast-FT-Recipe0225-0bab8edfd24a44b087a3548254dbb409.jpeg'),
  smashBurger: require('../assets/food/MSG-Smash-Burger-FT-RECIPE0124-d9682401f3554ef683e24311abdf342b.jpg'),

  cuisines: {
    americanBurger: require('../assets/food/cuisines/american-burger.jpg'),
    italianPizza: require('../assets/food/cuisines/italian-pizza.jpg'),
    japaneseSushi: require('../assets/food/cuisines/japanese-sushi.jpg'),
    indianCurry: require('../assets/food/cuisines/indian-curry.jpg'),
    mexicanTacos: require('../assets/food/cuisines/mexican-tacos.jpg'),
    thaiBowl: require('../assets/food/cuisines/thai-bowl.jpg'),
    lebaneseMezze: require('../assets/food/cuisines/lebanese-mezze.jpg'),
    breakfastPancakes: require('../assets/food/cuisines/breakfast-pancakes.jpg'),
    bakeryCroissant: require('../assets/food/cuisines/bakery-croissant.jpg'),
    seafoodPlate: require('../assets/food/cuisines/seafood-plate.jpg'),
    veganBowl: require('../assets/food/cuisines/vegan-bowl.jpg'),
    steakDinner: require('../assets/food/cuisines/steak-dinner.jpg'),
    ramen: require('../assets/food/cuisines/ramen.jpg'),
    shawarmaWrap: require('../assets/food/cuisines/shawarma-wrap.jpg'),
    coffeePastry: require('../assets/food/cuisines/coffee-pastry.jpg'),
    middleEasternRice: require('../assets/food/cuisines/middle-eastern-rice.jpg'),
  },
  grocery: {
    freshProduce: require('../assets/food/grocery/fresh-produce.jpg'),
    fruitStand: require('../assets/food/grocery/fruit-stand.jpg'),
    breadGrocery: require('../assets/food/grocery/bread-grocery.jpg'),
    dairyYogurt: require('../assets/food/grocery/dairy-yogurt.jpg'),
  },
  items: {
    pastryBox: require('../assets/food/items/pastry-box.jpg'),
    sandwichPlate: require('../assets/food/items/sandwich-plate.jpg'),
    saladMeal: require('../assets/food/items/salad-meal.jpg'),
    riceBowl: require('../assets/food/items/rice-bowl.jpg'),
  },
} as const;

/** Flat list for rotating hero / fallbacks */
export const FOOD_IMAGE_LIST = [
  foodImages.cuisines.italianPizza,
  foodImages.cuisines.americanBurger,
  foodImages.cuisines.thaiBowl,
  foodImages.grocery.freshProduce,
  foodImages.cuisines.bakeryCroissant,
  foodImages.cuisines.shawarmaWrap,
] as const;
