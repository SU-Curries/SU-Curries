import { Order, OrderStatus, PaymentStatus } from '../services/order.service';
import { Booking } from '../services/booking.service';

// Mock Users Data
export const mockUsers = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+49123456789',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+49987654321',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 'user-3',
    email: 'mike.johnson@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    phone: '+49555123456',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString()
  },
  {
    id: 'user-4',
    email: 'sarah.wilson@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    phone: '+49777888999',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2024-04-12').toISOString(),
    updatedAt: new Date('2024-04-12').toISOString()
  },
  {
    id: 'user-5',
    email: 'david.brown@example.com',
    password: 'password123',
    firstName: 'David',
    lastName: 'Brown',
    phone: '+49333444555',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2024-05-20').toISOString(),
    updatedAt: new Date('2024-05-20').toISOString()
  },
  {
    id: 'admin-1',
    email: 'admin@sucurries.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+49111222333',
    role: 'admin',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'driver-1',
    email: 'driver@sucurries.com',
    password: 'driver123',
    firstName: 'Driver',
    lastName: 'One',
    phone: '+49666777888',
    role: 'driver',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString()
  }
];

// Generate 100 orders with proper user relationships
export const generateExtensiveOrders = (): Order[] => {
  const orders: Order[] = [];
  const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded'];
  const customerUsers = mockUsers.filter(user => user.role === 'customer');
  
  const addresses = [
    {
      id: 'addr-1',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main Street',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
      phone: '+49123456789'
    },
    {
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
    {
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
    {
      id: 'addr-4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      addressLine1: '321 Elm Road',
      city: 'Frankfurt',
      state: 'Hesse',
      postalCode: '60311',
      country: 'Germany',
      phone: '+49777888999'
    },
    {
      id: 'addr-5',
      firstName: 'David',
      lastName: 'Brown',
      addressLine1: '654 Maple Lane',
      city: 'Cologne',
      state: 'North Rhine-Westphalia',
      postalCode: '50667',
      country: 'Germany',
      phone: '+49333444555'
    }
  ];

  const products = [
    { id: 'prod-1', name: 'Spicy Curry Base', price: 5.99 },
    { id: 'prod-2', name: 'Tomato Gravy', price: 4.49 },
    { id: 'prod-3', name: 'Biryani Spice Mix', price: 6.99 },
    { id: 'prod-4', name: 'Tikka Masala Combo', price: 9.99 },
    { id: 'prod-5', name: 'Mild Curry Base', price: 5.99 },
    { id: 'prod-6', name: 'Onion-Tomato Gravy', price: 4.99 },
    { id: 'prod-7', name: 'Butter Chicken Sauce', price: 7.99 },
    { id: 'prod-8', name: 'Garam Masala Blend', price: 3.99 },
    { id: 'prod-9', name: 'Dal Tadka Mix', price: 5.49 }
  ];

  for (let i = 1; i <= 100; i++) {
    const randomUser = customerUsers[Math.floor(Math.random() * customerUsers.length)];
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPaymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    
    // Generate random items for the order
    const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items
    const orderItems = [];
    let subtotal = 0;
    
    for (let j = 0; j < numItems; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      const totalPrice = randomProduct.price * quantity;
      
      orderItems.push({
        productId: randomProduct.id,
        productName: randomProduct.name,
        quantity,
        price: randomProduct.price,
        totalPrice
      });
      
      subtotal += totalPrice;
    }
    
    const taxAmount = subtotal * 0.19; // 19% VAT
    const shippingAmount = subtotal > 50 ? 0 : 5.99;
    const discountAmount = Math.random() > 0.8 ? subtotal * 0.1 : 0; // 20% chance of 10% discount
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
    
    // Generate dates over the last 6 months
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setHours(updatedDate.getHours() + Math.floor(Math.random() * 48));

    orders.push({
      id: `order-${i.toString().padStart(3, '0')}`,
      userId: randomUser.id,
      orderNumber: `ORD-2024-${i.toString().padStart(3, '0')}`,
      status: randomStatus,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      shippingAmount: Math.round(shippingAmount * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      currency: 'EUR',
      shippingAddress: randomAddress,
      billingAddress: randomAddress,
      paymentMethod: Math.random() > 0.5 ? 'credit_card' : 'paypal',
      paymentStatus: randomPaymentStatus,
      notes: Math.random() > 0.7 ? 'Please ring the doorbell twice' : undefined,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString()
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate bookings
export const generateExtensiveBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const customerUsers = mockUsers.filter(user => user.role === 'customer');
  const statuses = ['confirmed', 'pending', 'cancelled', 'completed'];
  
  for (let i = 1; i <= 25; i++) {
    const randomUser = customerUsers[Math.floor(Math.random() * customerUsers.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate dates for the next 30 days and past 30 days
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + Math.floor(Math.random() * 60) - 30);
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));

    bookings.push({
      id: `booking-${i.toString().padStart(3, '0')}`,
      bookingNumber: `BK-${i.toString().padStart(3, '0')}`,
      status: randomStatus as any,
      bookingDate: bookingDate.toISOString().split('T')[0],
      bookingTime: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'][Math.floor(Math.random() * 6)],
      guestCount: Math.floor(Math.random() * 6) + 2, // 2-7 guests
      customerName: `${randomUser.firstName} ${randomUser.lastName}`,
      customerEmail: randomUser.email,
      customerPhone: randomUser.phone,
      specialRequests: Math.random() > 0.6 ? ['Window table preferred', 'Quiet corner please', 'Birthday celebration', 'Anniversary dinner'][Math.floor(Math.random() * 4)] : '',
      tableNumber: `Table ${Math.floor(Math.random() * 20) + 1}`,
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString(),
      restaurantTableId: `table-${Math.floor(Math.random() * 10) + 1}`,
      partySize: Math.floor(Math.random() * 6) + 2,
      totalAmount: 0
    });
  }

  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const extensiveMockOrders = generateExtensiveOrders();
export const extensiveMockBookings = generateExtensiveBookings();

// Marketing Campaigns Data
export const mockCampaigns = [
  { 
    id: 'camp-1', 
    name: 'Winter Special 2024', 
    type: 'Email', 
    status: 'Active', 
    sent: 1847, 
    opened: 523,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  { 
    id: 'camp-2', 
    name: 'New Curry Collection', 
    type: 'SMS', 
    status: 'Scheduled', 
    sent: 0, 
    opened: 0,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  },
  { 
    id: 'camp-3', 
    name: 'Customer Appreciation', 
    type: 'Push', 
    status: 'Completed', 
    sent: 1234, 
    opened: 456,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString()
  },
  { 
    id: 'camp-4', 
    name: 'Holiday Feast Promotion', 
    type: 'Email', 
    status: 'Active', 
    sent: 2156, 
    opened: 789,
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString()
  }
];

// Promotions Data
export const mockPromotions = [
  { 
    id: 'promo-1', 
    code: 'WINTER25', 
    discount: '25%', 
    usage: 67, 
    limit: 100, 
    expires: '2024-03-31',
    createdAt: new Date('2024-01-01').toISOString()
  },
  { 
    id: 'promo-2', 
    code: 'FIRSTORDER', 
    discount: '15%', 
    usage: 34, 
    limit: 50, 
    expires: '2024-12-31',
    createdAt: new Date('2024-01-15').toISOString()
  },
  { 
    id: 'promo-3', 
    code: 'BULK15', 
    discount: '15%', 
    usage: 123, 
    limit: 200, 
    expires: '2024-06-30',
    createdAt: new Date('2024-01-10').toISOString()
  },
  { 
    id: 'promo-4', 
    code: 'LOYALTY10', 
    discount: '10%', 
    usage: 89, 
    limit: 150, 
    expires: '2024-09-30',
    createdAt: new Date('2024-01-20').toISOString()
  }
];