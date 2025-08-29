export const DIETARY_FILTERS = [
  {
    id: 'veg',
    label: 'Vegetarian',
    icon: 'Leaf',
    color: 'green',
    description: 'Contains no meat, fish, or poultry'
  },
  {
    id: 'non-veg',
    label: 'Non-Vegetarian',
    icon: 'Drumstick',
    color: 'red',
    description: 'Contains meat, fish, or poultry'
  },
  {
    id: 'jain',
    label: 'Jain',
    icon: 'Heart',
    color: 'orange',
    description: 'No onion, garlic, potatoes, or root vegetables'
  },
  {
    id: 'allergen-free',
    label: 'Allergen-Free',
    icon: 'Shield',
    color: 'blue',
    description: 'Free from common allergens'
  }
];

export const filterMenuByDietary = (menu, activeFilters) => {
  if (!activeFilters || activeFilters.length === 0) return menu;
  
  return menu.filter(item => {
    return activeFilters.some(filter => {
      switch (filter) {
        case 'veg':
          return item.dietary?.includes('veg');
        case 'non-veg':
          return item.dietary?.includes('non-veg');
        case 'jain':
          return item.dietary?.includes('jain');
        case 'allergen-free':
          return !item.allergens || item.allergens.length === 0;
        default:
          return true;
      }
    });
  });
};

export const getAllergenWarning = (allergens) => {
  if (!allergens || allergens.length === 0) return null;
  
  const commonAllergens = {
    'gluten': 'Contains wheat/gluten',
    'dairy': 'Contains milk/dairy products',
    'nuts': 'Contains tree nuts',
    'peanuts': 'Contains peanuts',
    'soy': 'Contains soy products',
    'eggs': 'Contains eggs',
    'fish': 'Contains fish',
    'shellfish': 'Contains shellfish',
    'sesame': 'Contains sesame seeds'
  };
  
  return allergens.map(allergen => 
    commonAllergens[allergen.toLowerCase()] || `Contains ${allergen}`
  ).join(', ');
};