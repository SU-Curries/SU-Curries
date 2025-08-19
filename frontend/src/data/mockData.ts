import { Product, Category } from '../services/product.service';
import { Order } from '../services/order.service';
import { Booking } from '../services/booking.service';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Curry Bases',
    description: 'Rich and aromatic curry bases',
    slug: 'curry-bases',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'cat-2',
    name: 'Gravies',
    description: 'Versatile gravies for various dishes',
    slug: 'gravies',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'cat-3',
    name: 'Spice Mixes',
    description: 'Authentic spice blends',
    slug: 'spice-mixes',
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'cat-4',
    name: 'Special Combos',
    description: 'Complete meal solutions',
    slug: 'special-combos',
    isActive: true,
    sortOrder: 4
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Spicy Curry Base',
    description: 'A rich and aromatic base for your favorite curry dishes. Made with traditional spices and herbs.',
    price: 5.99,
    sku: 'SCB-001',
    stockQuantity: 50,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    featuredImage: '/images/products/curry-base-spicy.jpg',
    status: 'active',
    isFeatured: true,
    slug: 'spicy-curry-base',
    categoryId: 'cat-1',
    category: 'Curry Bases',
    rating: 4.5,
    reviewCount: 23,
    inStock: true,
    ingredients: 'Onions, tomatoes, ginger, garlic, cumin, coriander, turmeric, chili powder',
    nutritionalInfo: 'Per 100g: Calories 45, Fat 2g, Carbs 8g, Protein 2g',
    cookingInstructions: 'Heat the curry base in a pan, add your choice of protein or vegetables, simmer for 15-20 minutes.'
  },
  {
    id: 'prod-2',
    name: 'Tomato Gravy',
    description: 'A versatile gravy perfect for a variety of Indian recipes. Rich in flavor and easy to use.',
    price: 4.49,
    sku: 'TG-001',
    stockQuantity: 75,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
    featuredImage: '/images/products/tomato-gravy.jpg',
    status: 'active',
    isFeatured: true,
    slug: 'tomato-gravy',
    categoryId: 'cat-2',
    category: 'Gravies',
    rating: 4.8,
    reviewCount: 31,
    inStock: true,
    ingredients: 'Tomatoes, onions, ginger, garlic, spices',
    nutritionalInfo: 'Per 100g: Calories 35, Fat 1g, Carbs 7g, Protein 1g',
    cookingInstructions: 'Use as a base for curries, add vegetables or meat and cook until tender.'
  },
  {
    id: 'prod-3',
    name: 'Biryani Spice Mix',
    description: 'An authentic blend of spices for a perfect biryani every time. Premium quality spices.',
    price: 6.99,
    sku: 'BSM-001',
    stockQuantity: 30,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    featuredImage: '/images/products/biryani-spice-mix.jpg',
    status: 'active',
    isFeatured: true,
    slug: 'biryani-spice-mix',
    categoryId: 'cat-3',
    category: 'Spice Mixes',
    rating: 4.9,
    reviewCount: 45,
    inStock: true,
    ingredients: 'Basmati rice spices, saffron, cardamom, cinnamon, cloves, bay leaves',
    nutritionalInfo: 'Per 10g: Calories 25, Fat 1g, Carbs 4g, Protein 1g',
    cookingInstructions: 'Mix with rice and meat/vegetables while cooking biryani for authentic flavor.'
  },
  {
    id: 'prod-4',
    name: 'Tikka Masala Combo',
    description: 'Everything you need to make a delicious chicken tikka masala. Complete meal kit.',
    price: 9.99,
    sku: 'TMC-001',
    stockQuantity: 25,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',
    featuredImage: '/images/products/tikka-masala-combo.jpg',
    status: 'active',
    isFeatured: true,
    slug: 'tikka-masala-combo',
    categoryId: 'cat-4',
    category: 'Special Combos',
    rating: 4.7,
    reviewCount: 38,
    inStock: true,
    ingredients: 'Tikka marinade, masala sauce, spices, instructions',
    nutritionalInfo: 'Complete meal serves 4 people',
    cookingInstructions: 'Follow the included recipe card for step-by-step instructions.'
  },
  {
    id: 'prod-5',
    name: 'Mild Curry Base',
    description: 'A flavorful yet not-so-spicy base for a gentle curry experience.',
    price: 5.99,
    sku: 'MCB-001',
    stockQuantity: 45,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    featuredImage: '/images/products/curry-base-mild.jpg',
    status: 'active',
    isFeatured: false,
    slug: 'mild-curry-base',
    categoryId: 'cat-1',
    category: 'Curry Bases',
    rating: 4.3,
    reviewCount: 18,
    inStock: true,
    ingredients: 'Onions, tomatoes, ginger, garlic, mild spices',
    nutritionalInfo: 'Per 100g: Calories 40, Fat 2g, Carbs 7g, Protein 2g',
    cookingInstructions: 'Heat the curry base in a pan, add your choice of protein or vegetables, simmer for 15-20 minutes.'
  },
  {
    id: 'prod-6',
    name: 'Onion-Tomato Gravy',
    description: 'The essential gravy for many North Indian dishes.',
    price: 4.99,
    sku: 'OTG-001',
    stockQuantity: 60,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
    featuredImage: '/images/products/onion-gravy.jpg',
    status: 'active',
    isFeatured: false,
    slug: 'onion-tomato-gravy',
    categoryId: 'cat-2',
    category: 'Gravies',
    rating: 4.6,
    reviewCount: 27,
    inStock: true,
    ingredients: 'Onions, tomatoes, ginger, garlic, spices',
    nutritionalInfo: 'Per 100g: Calories 38, Fat 1.5g, Carbs 7g, Protein 1.5g',
    cookingInstructions: 'Use as a base for curries, add vegetables or meat and cook until tender.'
  },
  {
    id: 'prod-7',
    name: 'Butter Chicken Sauce',
    description: 'Creamy and rich butter chicken sauce ready to use.',
    price: 7.99,
    sku: 'BCS-001',
    stockQuantity: 40,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',
    status: 'active',
    isFeatured: true,
    slug: 'butter-chicken-sauce',
    categoryId: 'cat-2',
    category: 'Gravies',
    rating: 4.8,
    reviewCount: 52,
    inStock: true
  },
  {
    id: 'prod-8',
    name: 'Garam Masala Blend',
    description: 'Traditional garam masala spice blend for authentic Indian flavors.',
    price: 3.99,
    sku: 'GMB-001',
    stockQuantity: 80,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    status: 'active',
    isFeatured: false,
    slug: 'garam-masala-blend',
    categoryId: 'cat-3',
    category: 'Spice Mixes',
    rating: 4.6,
    reviewCount: 34,
    inStock: true
  },
  {
    id: 'prod-9',
    name: 'Dal Tadka Mix',
    description: 'Complete mix for making delicious dal tadka at home.',
    price: 5.49,
    sku: 'DTM-001',
    stockQuantity: 35,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    status: 'active',
    isFeatured: true,
    slug: 'dal-tadka-mix',
    categoryId: 'cat-4',
    category: 'Special Combos',
    rating: 4.4,
    reviewCount: 28,
    inStock: true
  }
];

// Restaurant table booking data (replacing cooking classes)
export const mockRestaurantTables = [
  {
    id: 'table-1',
    tableNumber: 'T01',
    capacity: 2,
    location: 'Window Side',
    status: 'available',
    isActive: true
  },
  {
    id: 'table-2',
    tableNumber: 'T02',
    capacity: 4,
    location: 'Main Dining',
    status: 'available',
    isActive: true
  },
  {
    id: 'table-3',
    tableNumber: 'T03',
    capacity: 6,
    location: 'Private Corner',
    status: 'available',
    isActive: true
  }
];

// Cooking classes removed - restaurant table bookings only

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    status: 'pending',
    items: [
      {
        productId: 'prod-1',
        productName: 'Spicy Curry Base',
        quantity: 2,
        price: 5.99,
        totalPrice: 11.98
      }
    ],
    subtotal: 11.98,
    taxAmount: 1.20,
    shippingAmount: 5.00,
    discountAmount: 0,
    totalAmount: 18.18,
    currency: 'EUR',
    shippingAddress: {
      id: 'addr-1',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
      phone: '+49123456789'
    },
    billingAddress: {
      id: 'addr-1',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
      phone: '+49123456789'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-002',
    status: 'processing',
    items: [
      {
        productId: 'prod-2',
        productName: 'Mild Curry Base',
        quantity: 1,
        price: 5.99,
        totalPrice: 5.99
      },
      {
        productId: 'prod-3',
        productName: 'Tomato Gravy',
        quantity: 2,
        price: 4.99,
        totalPrice: 9.98
      }
    ],
    subtotal: 15.97,
    taxAmount: 1.60,
    shippingAmount: 0,
    discountAmount: 0,
    totalAmount: 17.57,
    currency: 'EUR',
    shippingAddress: {
      id: 'addr-2',
      firstName: 'Jane',
      lastName: 'Smith',
      addressLine1: '456 Oak Avenue',
      city: 'Munich',
      state: 'Bavaria',
      postalCode: '80331',
      country: 'Germany',
      phone: '+49987654321'
    },
    billingAddress: {
      id: 'addr-2',
      firstName: 'Jane',
      lastName: 'Smith',
      addressLine1: '456 Oak Avenue',
      city: 'Munich',
      state: 'Bavaria',
      postalCode: '80331',
      country: 'Germany',
      phone: '+49987654321'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2024-003',
    status: 'shipped',
    items: [
      {
        productId: 'prod-4',
        productName: 'Garam Masala Mix',
        quantity: 3,
        price: 3.99,
        totalPrice: 11.97
      }
    ],
    subtotal: 11.97,
    taxAmount: 1.20,
    shippingAmount: 5.00,
    discountAmount: 0,
    totalAmount: 18.17,
    currency: 'EUR',
    shippingAddress: {
      id: 'addr-3',
      firstName: 'Mike',
      lastName: 'Johnson',
      addressLine1: '789 Pine Street',
      city: 'Hamburg',
      state: 'Hamburg',
      postalCode: '20095',
      country: 'Germany',
      phone: '+49555123456'
    },
    billingAddress: {
      id: 'addr-3',
      firstName: 'Mike',
      lastName: 'Johnson',
      addressLine1: '789 Pine Street',
      city: 'Hamburg',
      state: 'Hamburg',
      postalCode: '20095',
      country: 'Germany',
      phone: '+49555123456'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    bookingNumber: 'BK-001',
    status: 'confirmed',
    bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bookingTime: '19:30',
    guestCount: 2,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+49123456789',
    specialRequests: 'Window table preferred',
    tableNumber: 'Table 5',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    restaurantTableId: 'table-1',
    partySize: 2,
    totalAmount: 0
  }
];