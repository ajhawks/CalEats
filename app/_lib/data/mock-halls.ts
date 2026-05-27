// ---------------------------------------------------------------------------
// Cal Eats — Static mock data for Phase 4.2 (no backend calls)
// Replace with real Supabase queries in Phase 5.
// ---------------------------------------------------------------------------

export type DietaryLabel = 'vegan' | 'vegetarian' | 'halal' | 'kosher' | 'gluten-free'
export type Allergen =
  | 'milk' | 'egg' | 'fish' | 'shellfish'
  | 'tree-nuts' | 'wheat' | 'peanuts' | 'soybeans' | 'sesame'
export type CarbonFootprint = 'low' | 'medium' | 'high' | null
export type MealPeriodName = 'Breakfast' | 'Lunch' | 'Dinner' | 'All Day'

export interface MockMenuItem {
  name: string
  dietaryLabels: DietaryLabel[]
  allergens: Allergen[]
  carbonFootprint: CarbonFootprint
}

export interface MockMenuSection {
  name: string
  items: MockMenuItem[]
}

export interface MockMealPeriod {
  period: MealPeriodName
  sections: MockMenuSection[]
}

export interface MockHall {
  slug: string
  name: string
  location: string
  type: 'commons' | 'restaurant'
  isOpen: boolean
  currentPeriod: MealPeriodName | null
  closesAt: string | null
  meals: MockMealPeriod[]
}

// ---------------------------------------------------------------------------
// Hall data
// ---------------------------------------------------------------------------

const MOCK_HALLS: MockHall[] = [
  {
    slug: 'cafe-3',
    name: 'Café 3',
    location: 'Hearst & Euclid Ave',
    type: 'commons',
    isOpen: true,
    currentPeriod: 'Lunch',
    closesAt: '2:00 PM',
    meals: [
      {
        period: 'Breakfast',
        sections: [
          {
            name: 'Scramble Station',
            items: [
              { name: 'Cage-Free Scrambled Eggs', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['egg'], carbonFootprint: 'low' },
              { name: 'Veggie Frittata', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['egg', 'milk'], carbonFootprint: 'low' },
              { name: 'Breakfast Sausage', dietaryLabels: [], allergens: [], carbonFootprint: 'high' },
            ],
          },
          {
            name: 'Grill',
            items: [
              { name: 'Pancakes', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'low' },
              { name: 'French Toast', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'low' },
              { name: 'Turkey Bacon', dietaryLabels: ['halal'], allergens: [], carbonFootprint: 'medium' },
            ],
          },
          {
            name: 'Bakery',
            items: [
              { name: 'Blueberry Muffin', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'low' },
              { name: 'Everything Bagel', dietaryLabels: ['vegan'], allergens: ['wheat', 'sesame'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
      {
        period: 'Lunch',
        sections: [
          {
            name: 'Grill',
            items: [
              { name: 'Grilled Chicken Breast', dietaryLabels: ['halal', 'gluten-free'], allergens: [], carbonFootprint: 'medium' },
              { name: 'Beyond Burger Patty', dietaryLabels: ['vegan'], allergens: ['soybeans'], carbonFootprint: 'low' },
              { name: 'Smash Burger', dietaryLabels: [], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'high' },
            ],
          },
          {
            name: 'Pizza',
            items: [
              { name: 'Margherita Flatbread', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'low' },
              { name: 'Pepperoni Pizza', dietaryLabels: [], allergens: ['wheat', 'milk'], carbonFootprint: 'medium' },
              { name: 'Vegan Cheese Flatbread', dietaryLabels: ['vegan'], allergens: ['wheat'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Plant Forward',
            items: [
              { name: 'Roasted Cauliflower Tikka Masala', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Lentil Shepherd\'s Pie', dietaryLabels: ['vegan'], allergens: [], carbonFootprint: 'low' },
              { name: 'Quinoa Tabbouleh', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Salad Bar',
            items: [
              { name: 'Mixed Greens', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Caesar Salad', dietaryLabels: ['vegetarian'], allergens: ['milk', 'egg', 'fish', 'wheat'], carbonFootprint: 'low' },
              { name: 'Greek Salad', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['milk'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Soup',
            items: [
              { name: 'Tomato Bisque', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['milk'], carbonFootprint: 'low' },
              { name: 'Chicken Noodle Soup', dietaryLabels: ['halal'], allergens: ['wheat'], carbonFootprint: 'medium' },
            ],
          },
        ],
      },
      {
        period: 'Dinner',
        sections: [
          {
            name: 'Grill',
            items: [
              { name: 'Pan-Seared Salmon', dietaryLabels: ['gluten-free', 'halal'], allergens: ['fish'], carbonFootprint: 'medium' },
              { name: 'Herb-Roasted Chicken Thigh', dietaryLabels: ['halal', 'gluten-free'], allergens: [], carbonFootprint: 'medium' },
              { name: 'Portobello Mushroom Steak', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Entrées',
            items: [
              { name: 'Beef Lasagna', dietaryLabels: [], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'high' },
              { name: 'Vegetable Curry', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Shrimp Stir Fry', dietaryLabels: ['gluten-free'], allergens: ['shellfish', 'soybeans'], carbonFootprint: 'medium' },
            ],
          },
          {
            name: 'Sides',
            items: [
              { name: 'Roasted Garlic Mashed Potatoes', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['milk'], carbonFootprint: 'low' },
              { name: 'Steamed Brown Rice', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Honey-Glazed Carrots', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'crossroads',
    name: 'Crossroads',
    location: 'Unit 1, Northside',
    type: 'commons',
    isOpen: true,
    currentPeriod: 'Lunch',
    closesAt: '2:00 PM',
    meals: [
      {
        period: 'Breakfast',
        sections: [
          {
            name: 'Omelets & Eggs',
            items: [
              { name: 'Build-Your-Own Omelet', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['egg', 'milk'], carbonFootprint: 'low' },
              { name: 'Hard Boiled Eggs', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['egg'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Hot Bar',
            items: [
              { name: 'Steel-Cut Oatmeal', dietaryLabels: ['vegan'], allergens: ['wheat'], carbonFootprint: 'low' },
              { name: 'Hash Browns', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Chicken Apple Sausage', dietaryLabels: ['gluten-free'], allergens: [], carbonFootprint: 'medium' },
            ],
          },
        ],
      },
      {
        period: 'Lunch',
        sections: [
          {
            name: 'Global Kitchen',
            items: [
              { name: 'Pasta Primavera', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'low' },
              { name: 'BBQ Pulled Pork Sandwich', dietaryLabels: [], allergens: ['wheat'], carbonFootprint: 'high' },
              { name: 'Pad Thai', dietaryLabels: ['vegan'], allergens: ['soybeans', 'peanuts', 'wheat'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Deli',
            items: [
              { name: 'Turkey Club Wrap', dietaryLabels: [], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'medium' },
              { name: 'Hummus & Veggie Wrap', dietaryLabels: ['vegan'], allergens: ['wheat', 'sesame'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Soup',
            items: [
              { name: 'Tomato Soup', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['milk'], carbonFootprint: 'low' },
              { name: 'Minestrone', dietaryLabels: ['vegan'], allergens: ['wheat'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
      {
        period: 'Dinner',
        sections: [
          {
            name: 'Feature Station',
            items: [
              { name: 'Teriyaki Glazed Tofu', dietaryLabels: ['vegan'], allergens: ['soybeans', 'wheat'], carbonFootprint: 'low' },
              { name: 'Grilled Flank Steak', dietaryLabels: ['gluten-free'], allergens: [], carbonFootprint: 'high' },
            ],
          },
          {
            name: 'Sides',
            items: [
              { name: 'Jasmine Rice', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Roasted Broccoli', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'foothill',
    name: 'Foothill',
    location: 'Foothill / Stern Hall',
    type: 'commons',
    isOpen: false,
    currentPeriod: null,
    closesAt: null,
    meals: [
      {
        period: 'Breakfast',
        sections: [
          {
            name: 'Hot Bar',
            items: [
              { name: 'Scrambled Eggs', dietaryLabels: ['vegetarian', 'gluten-free'], allergens: ['egg'], carbonFootprint: 'low' },
              { name: 'Waffles', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
      {
        period: 'Lunch',
        sections: [
          {
            name: 'Grill',
            items: [
              { name: 'Cheeseburger', dietaryLabels: [], allergens: ['wheat', 'milk'], carbonFootprint: 'high' },
              { name: 'Veggie Burger', dietaryLabels: ['vegan'], allergens: ['wheat', 'soybeans'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
      {
        period: 'Dinner',
        sections: [
          {
            name: 'Entrées',
            items: [
              { name: 'Baked Ziti', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'medium' },
              { name: 'Lemon Herb Chicken', dietaryLabels: ['halal', 'gluten-free'], allergens: [], carbonFootprint: 'medium' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'clark-kerr',
    name: 'Clark Kerr',
    location: 'Clark Kerr Campus',
    type: 'commons',
    isOpen: true,
    currentPeriod: 'Lunch',
    closesAt: '2:00 PM',
    meals: [
      {
        period: 'Breakfast',
        sections: [
          {
            name: 'Morning Classics',
            items: [
              { name: 'Buttermilk Pancakes', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'low' },
              { name: 'Breakfast Burrito', dietaryLabels: [], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'medium' },
            ],
          },
        ],
      },
      {
        period: 'Lunch',
        sections: [
          {
            name: 'Grill',
            items: [
              { name: 'Fish Tacos', dietaryLabels: ['halal'], allergens: ['fish', 'wheat', 'milk'], carbonFootprint: 'medium' },
              { name: 'Street Corn Quesadilla', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Plant Forward',
            items: [
              { name: 'Lentil Dal', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Roasted Vegetable Grain Bowl', dietaryLabels: ['vegan'], allergens: [], carbonFootprint: 'low' },
            ],
          },
        ],
      },
      {
        period: 'Dinner',
        sections: [
          {
            name: 'Feature',
            items: [
              { name: 'Chicken Marsala', dietaryLabels: ['halal'], allergens: ['wheat', 'milk'], carbonFootprint: 'medium' },
              { name: 'Eggplant Parmesan', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'golden-bear-cafe',
    name: 'Golden Bear Café',
    location: 'MLK Student Union',
    type: 'restaurant',
    isOpen: true,
    currentPeriod: 'All Day',
    closesAt: '4:00 PM',
    meals: [
      {
        period: 'All Day',
        sections: [
          {
            name: 'Coffee & Drinks',
            items: [
              { name: 'Drip Coffee', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Oat Milk Latte', dietaryLabels: ['vegan'], allergens: [], carbonFootprint: 'low' },
              { name: 'Matcha Latte', dietaryLabels: ['vegetarian'], allergens: ['milk'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Sandwiches',
            items: [
              { name: 'Turkey & Avocado Sandwich', dietaryLabels: [], allergens: ['wheat', 'milk', 'egg'], carbonFootprint: 'medium' },
              { name: 'Caprese Panini', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Snacks',
            items: [
              { name: 'Banana', dietaryLabels: ['vegan', 'gluten-free'], allergens: [], carbonFootprint: 'low' },
              { name: 'Kind Bar', dietaryLabels: ['vegan'], allergens: ['tree-nuts'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'browns',
    name: 'Browns',
    location: 'Bancroft Way',
    type: 'restaurant',
    isOpen: false,
    currentPeriod: null,
    closesAt: null,
    meals: [
      {
        period: 'Lunch',
        sections: [
          {
            name: 'Pizza',
            items: [
              { name: 'Cheese Pizza Slice', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'medium' },
              { name: 'Pepperoni Pizza Slice', dietaryLabels: [], allergens: ['wheat', 'milk'], carbonFootprint: 'high' },
            ],
          },
          {
            name: 'Calzones',
            items: [
              { name: 'Spinach & Ricotta Calzone', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'medium' },
            ],
          },
        ],
      },
      {
        period: 'Dinner',
        sections: [
          {
            name: 'Pizza',
            items: [
              { name: 'BBQ Chicken Pizza', dietaryLabels: [], allergens: ['wheat', 'milk'], carbonFootprint: 'high' },
              { name: 'Veggie Supreme Pizza', dietaryLabels: ['vegetarian'], allergens: ['wheat', 'milk'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'student-union',
    name: 'The Eateries',
    location: 'MLK Student Union',
    type: 'restaurant',
    isOpen: true,
    currentPeriod: 'All Day',
    closesAt: '3:00 PM',
    meals: [
      {
        period: 'All Day',
        sections: [
          {
            name: 'Bowls',
            items: [
              { name: 'Chipotle Burrito Bowl', dietaryLabels: ['gluten-free'], allergens: ['milk'], carbonFootprint: 'medium' },
              { name: 'Teriyaki Chicken Bowl', dietaryLabels: ['halal'], allergens: ['soybeans', 'wheat'], carbonFootprint: 'medium' },
              { name: 'Tofu Buddha Bowl', dietaryLabels: ['vegan', 'gluten-free'], allergens: ['soybeans'], carbonFootprint: 'low' },
            ],
          },
          {
            name: 'Wraps & Sandwiches',
            items: [
              { name: 'BLT Wrap', dietaryLabels: [], allergens: ['wheat', 'egg'], carbonFootprint: 'medium' },
              { name: 'Falafel Wrap', dietaryLabels: ['vegan'], allergens: ['wheat', 'sesame'], carbonFootprint: 'low' },
            ],
          },
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

export function getMockHall(slug: string): MockHall | undefined {
  return MOCK_HALLS.find((h) => h.slug === slug)
}

export function getAllMockHalls(): MockHall[] {
  return MOCK_HALLS
}
