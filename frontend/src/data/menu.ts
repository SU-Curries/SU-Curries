export type MenuItem = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages';
  dietary?: ('vegan' | 'gluten-free')[];
  spiceLevel?: 1 | 2 | 3;
};

export const menu: MenuItem[] = [
  // Appetizers
  {
    name: 'Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    price: 5.99,
    image: 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=Samosa',
    category: 'Appetizers',
    dietary: ['vegan'],
    spiceLevel: 1,
  },
  {
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese skewers grilled to perfection.',
    price: 8.99,
    image: 'https://via.placeholder.com/300x200/2d2d2d/ffffff?text=Paneer+Tikka',
    category: 'Appetizers',
    dietary: ['gluten-free'],
    spiceLevel: 2,
  },
  // Main Course
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in a creamy tomato-based sauce.',
    price: 15.99,
    image: 'https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Butter+Chicken',
    category: 'Main Course',
    spiceLevel: 1,
  },
  {
    name: 'Palak Paneer',
    description: 'Cottage cheese in a smooth spinach gravy.',
    price: 13.99,
    image: 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=Palak+Paneer',
    category: 'Main Course',
    dietary: ['gluten-free'],
    spiceLevel: 1,
  },
  // Desserts
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid balls soaked in a sweet syrup.',
    price: 4.99,
    image: 'https://via.placeholder.com/300x200/2d2d2d/ffffff?text=Gulab+Jamun',
    category: 'Desserts',
  },
  // Beverages
  {
    name: 'Mango Lassi',
    description: 'A refreshing yogurt-based mango smoothie.',
    price: 3.99,
    image: 'https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Mango+Lassi',
    category: 'Beverages',
    dietary: ['gluten-free'],
  },
]; 