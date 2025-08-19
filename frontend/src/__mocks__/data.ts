/**
 * Comprehensive Mock Data for Testing
 * Centralized mock data to ensure consistency across all tests
 */

export const mockProducts = [
  {
    id: '1',
    name: 'Chicken Curry',
    description: 'Delicious chicken curry with aromatic spices',
    price: 12.99,
    compareAtPrice: 15.99,
    sku: 'CC001',
    stockQuantity: 10,
    image: '/images/chicken-curry.jpg',
    featuredImage: '/images/chicken-curry.jpg',
    images: ['/images/chicken-curry.jpg'],
    status: 'active' as const,
    isFeatured: true,
    slug: 'chicken-curry',
    categoryId: 'cat-1',
    category: 'Main Dishes',
    spiceLevel: 3,
    dietaryTags: ['gluten-free'],
    rating: 4.5,
    averageRating: 4.5,
    reviewCount: 25,
    inStock: true,
    ingredients: 'Chicken, tomatoes, onions, spices',
    nutritionalInfo: 'Calories: 450, Protein: 25g',
    cookingInstructions: 'Heat and serve'
  },
  {
    id: '2',
    name: 'Vegetable Biryani',
    description: 'Aromatic vegetable biryani with basmati rice',
    price: 10.99,
    compareAtPrice: 12.99,
    sku: 'VB001',
    stockQuantity: 15,
    image: '/images/veg-biryani.jpg',
    featuredImage: '/images/veg-biryani.jpg',
    images: ['/images/veg-biryani.jpg'],
    status: 'active' as const,
    isFeatured: false,
    slug: 'vegetable-biryani',
    categoryId: 'cat-1',
    category: 'Main Dishes',
    spiceLevel: 2,
    dietaryTags: ['vegetarian', 'vegan'],
    rating: 4.2,
    averageRating: 4.2,
    reviewCount: 18,
    inStock: true,
    ingredients: 'Basmati rice, vegetables, spices',
    nutritionalInfo: 'Calories: 380, Protein: 12g',
    cookingInstructions: 'Heat and serve'
  }
];

export const mockCategories = [
  {
    id: 'cat-1',
    name: 'Main Dishes',
    description: 'Main course items',
    image: '/images/main-dishes.jpg',
    slug: 'main-dishes',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'cat-2',
    name: 'Appetizers',
    description: 'Starter items',
    image: '/images/appetizers.jpg',
    slug: 'appetizers',
    isActive: true,
    sortOrder: 2
  }
];

export const mockCartItems = [
  {
    productId: '1',
    quantity: 2
  },
  {
    productId: '2',
    quantity: 1
  }
];

export const mockCartCalculation = {
  items: [
    {
      productId: '1',
      quantity: 2,
      product: mockProducts[0]
    },
    {
      productId: '2',
      quantity: 1,
      product: mockProducts[1]
    }
  ],
  subtotal: 36.97,
  taxAmount: 3.70,
  shippingAmount: 5.99,
  discountAmount: 0,
  totalAmount: 46.66,
  currency: 'EUR'
};

export const mockOrders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-001',
    userId: 'user-1',
    customerId: 'user-1',
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    items: [
      {
        id: 'item-1',
        productId: '1',
        name: 'Chicken Curry',
        price: 12.99,
        quantity: 2,
        product: mockProducts[0]
      }
    ],
    subtotal: 25.98,
    tax: 2.60,
    taxAmount: 2.60,
    deliveryFee: 3.99,
    shippingAmount: 3.99,
    discount: 0,
    discountAmount: 0,
    total: 32.57,
    totalAmount: 32.57,
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
    paymentMethod: 'card',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        note: 'Order placed'
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      firstName: 'Test',
      lastName: 'User',
      addressLine1: '123 Test St',
      addressLine2: '',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      phone: '+1234567890'
    },
    billingAddress: {
      id: 'addr-1',
      firstName: 'Test',
      lastName: 'User',
      addressLine1: '123 Test St',
      addressLine2: '',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      phone: '+1234567890'
    }
  }
];

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'customer' as const,
  isEmailVerified: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z')
};

export const mockAdminUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin' as const,
  isEmailVerified: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z')
};

export const mockAddresses = [
  {
    id: 'addr-1',
    firstName: 'Test',
    lastName: 'User',
    addressLine1: '123 Test St',
    addressLine2: 'Apt 4B',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    country: 'Test Country',
    phone: '+1234567890'
  }
];

// Generate large dataset for performance testing
export const generateMockProducts = (count: number = 100) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `product-${index + 1}`,
    name: `Product ${index + 1}`,
    description: `Description for product ${index + 1}`,
    price: 10.99 + (index * 0.5),
    compareAtPrice: 12.99 + (index * 0.5),
    sku: `PROD${String(index + 1).padStart(3, '0')}`,
    stockQuantity: 10 + index,
    image: `/images/product-${index + 1}.jpg`,
    featuredImage: `/images/product-${index + 1}.jpg`,
    images: [`/images/product-${index + 1}.jpg`],
    status: 'active' as const,
    isFeatured: index < 5,
    slug: `product-${index + 1}`,
    categoryId: index % 2 === 0 ? 'cat-1' : 'cat-2',
    category: index % 2 === 0 ? 'Main Dishes' : 'Appetizers',
    spiceLevel: (index % 5) + 1,
    dietaryTags: index % 3 === 0 ? ['vegetarian'] : [],
    rating: 3.5 + (index % 3) * 0.5,
    averageRating: 3.5 + (index % 3) * 0.5,
    reviewCount: 10 + (index % 20),
    inStock: true,
    ingredients: `Ingredients for product ${index + 1}`,
    nutritionalInfo: `Calories: ${300 + index * 10}`,
    cookingInstructions: 'Heat and serve'
  }));
};

export const generateMockCartItems = (count: number = 50) => {
  return Array.from({ length: count }, (_, index) => ({
    productId: `product-${index + 1}`,
    quantity: (index % 3) + 1
  }));
};

export const generateMockOrders = (count: number = 10) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `order-${index + 1}`,
    orderNumber: `ORD-${String(index + 1).padStart(3, '0')}`,
    userId: 'user-1',
    customerId: 'user-1',
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    items: [
      {
        id: `item-${index + 1}`,
        productId: `product-${(index % 10) + 1}`,
        name: `Product ${(index % 10) + 1}`,
        price: 10.99 + (index * 0.5),
        quantity: (index % 3) + 1
      }
    ],
    subtotal: (10.99 + (index * 0.5)) * ((index % 3) + 1),
    tax: ((10.99 + (index * 0.5)) * ((index % 3) + 1)) * 0.1,
    taxAmount: ((10.99 + (index * 0.5)) * ((index % 3) + 1)) * 0.1,
    deliveryFee: 3.99,
    shippingAmount: 3.99,
    discount: 0,
    discountAmount: 0,
    total: ((10.99 + (index * 0.5)) * ((index % 3) + 1)) * 1.1 + 3.99,
    totalAmount: ((10.99 + (index * 0.5)) * ((index % 3) + 1)) * 1.1 + 3.99,
    status: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'][index % 5] as any,
    paymentStatus: ['pending', 'paid', 'failed'][index % 3] as any,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
    updatedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
    statusHistory: [],
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0]
  }));
};