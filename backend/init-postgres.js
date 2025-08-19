const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  console.log('🚀 Initializing PostgreSQL database...');

  // First, connect as superuser to create database and user
  const superClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres', // Default postgres password
    database: 'postgres'
  });

  try {
    await superClient.connect();
    console.log('✅ Connected to PostgreSQL as superuser');

    // Create database if it doesn't exist
    try {
      await superClient.query('CREATE DATABASE su_foods_db');
      console.log('✅ Database "su_foods_db" created');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('ℹ️  Database "su_foods_db" already exists');
      } else {
        throw error;
      }
    }

    // Create user if it doesn't exist
    try {
      await superClient.query(`
        CREATE USER su_foods_user WITH PASSWORD 'su_foods_password'
      `);
      console.log('✅ User "su_foods_user" created');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️  User "su_foods_user" already exists');
      } else {
        throw error;
      }
    }

    // Grant privileges
    await superClient.query(`
      GRANT ALL PRIVILEGES ON DATABASE su_foods_db TO su_foods_user
    `);
    
    // Connect to the new database to grant schema privileges
    await superClient.end();
    
    const dbClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'su_foods_db'
    });
    
    await dbClient.connect();
    
    await dbClient.query(`
      GRANT ALL ON SCHEMA public TO su_foods_user;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO su_foods_user;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO su_foods_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO su_foods_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO su_foods_user;
    `);
    
    await dbClient.end();
    console.log('✅ Schema privileges granted to su_foods_user');

    await superClient.end();

    // Now connect to the application database
    const appClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'su_foods_user',
      password: 'su_foods_password',
      database: 'su_foods_db'
    });

    await appClient.connect();
    console.log('✅ Connected to su_foods_db as application user');

    // Create tables
    const createTablesSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'customer',
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Categories table
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        compare_at_price DECIMAL(10,2),
        sku VARCHAR(100) UNIQUE NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        category_id UUID REFERENCES categories(id),
        images TEXT[], -- Array of image URLs
        featured_image VARCHAR(500),
        status VARCHAR(20) DEFAULT 'active',
        is_featured BOOLEAN DEFAULT false,
        slug VARCHAR(255) UNIQUE NOT NULL,
        metadata JSONB, -- For flexible attributes like ingredients, dietary info
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Addresses table
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) DEFAULT 'Germany',
        phone VARCHAR(20),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Orders table
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        shipping_amount DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'EUR',
        shipping_address JSONB NOT NULL,
        billing_address JSONB NOT NULL,
        payment_method VARCHAR(50),
        payment_status VARCHAR(20) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Order items table
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        product_name VARCHAR(255) NOT NULL,
        product_sku VARCHAR(100),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Bookings table
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_number VARCHAR(50) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        guest_count INTEGER NOT NULL,
        table_number VARCHAR(20),
        special_requests TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    `;

    await appClient.query(createTablesSQL);
    console.log('✅ Database tables created successfully');

    // Insert sample data
    await insertSampleData(appClient);

    await appClient.end();
    console.log('🎉 Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function insertSampleData(client) {
  console.log('📝 Inserting sample data...');

  // Insert admin user
  const adminPassword = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PqhEyC'; // password: admin123
  const userPassword = '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // password: user123

  await client.query(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, email_verified)
    VALUES 
      ('550e8400-e29b-41d4-a716-446655440000', 'admin@sucurries.com', $1, 'Admin', 'User', 'admin', true, true),
      ('550e8400-e29b-41d4-a716-446655440001', 'user@sucurries.com', $2, 'John', 'Doe', 'customer', true, true)
    ON CONFLICT (email) DO NOTHING
  `, [adminPassword, userPassword]);

  // Insert categories
  await client.query(`
    INSERT INTO categories (id, name, description, slug, is_active, sort_order)
    VALUES 
      ('550e8400-e29b-41d4-a716-446655440010', 'Curry Bases', 'Rich and aromatic curry bases', 'curry-bases', true, 1),
      ('550e8400-e29b-41d4-a716-446655440011', 'Gravies', 'Versatile gravies for various dishes', 'gravies', true, 2),
      ('550e8400-e29b-41d4-a716-446655440012', 'Spice Mixes', 'Authentic spice blends', 'spice-mixes', true, 3),
      ('550e8400-e29b-41d4-a716-446655440013', 'Special Combos', 'Complete meal solutions', 'special-combos', true, 4)
    ON CONFLICT (slug) DO NOTHING
  `);

  // Insert products
  await client.query(`
    INSERT INTO products (id, name, description, price, sku, stock_quantity, category_id, featured_image, status, is_featured, slug, metadata)
    VALUES 
      ('550e8400-e29b-41d4-a716-446655440020', 'Spicy Curry Base', 'A rich and aromatic base for your favorite curry dishes. Made with traditional spices and herbs.', 5.99, 'SCB-001', 50, '550e8400-e29b-41d4-a716-446655440010', '/images/products/curry-base-spicy.jpg', 'active', true, 'spicy-curry-base', '{"spiceLevel": 3, "dietaryTags": ["vegetarian", "gluten-free"]}'),
      ('550e8400-e29b-41d4-a716-446655440021', 'Mild Curry Base', 'Perfect for those who prefer milder flavors. Creamy and aromatic.', 5.99, 'MCB-002', 45, '550e8400-e29b-41d4-a716-446655440010', '/images/products/curry-base-mild.jpg', 'active', false, 'mild-curry-base', '{"spiceLevel": 1, "dietaryTags": ["vegetarian"]}'),
      ('550e8400-e29b-41d4-a716-446655440022', 'Tomato Gravy', 'Rich tomato-based gravy perfect for various dishes.', 4.99, 'TG-003', 30, '550e8400-e29b-41d4-a716-446655440011', '/images/products/tomato-gravy.jpg', 'active', true, 'tomato-gravy', '{"spiceLevel": 2, "dietaryTags": ["vegan", "gluten-free"]}'),
      ('550e8400-e29b-41d4-a716-446655440023', 'Garam Masala Mix', 'Traditional blend of aromatic spices.', 3.99, 'GMM-004', 100, '550e8400-e29b-41d4-a716-446655440012', '/images/products/garam-masala.jpg', 'active', false, 'garam-masala-mix', '{"spiceLevel": 2, "dietaryTags": ["vegan", "gluten-free"]}')
    ON CONFLICT (sku) DO NOTHING
  `);

  // Insert sample orders
  await client.query(`
    INSERT INTO orders (id, user_id, order_number, status, subtotal, tax_amount, shipping_amount, total_amount, shipping_address, billing_address, payment_method, payment_status)
    VALUES 
      ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'ORD-2024-001', 'pending', 11.98, 1.20, 5.00, 18.18, 
       '{"firstName": "John", "lastName": "Doe", "addressLine1": "123 Main St", "city": "Berlin", "state": "Berlin", "postalCode": "10115", "country": "Germany", "phone": "+49123456789"}',
       '{"firstName": "John", "lastName": "Doe", "addressLine1": "123 Main St", "city": "Berlin", "state": "Berlin", "postalCode": "10115", "country": "Germany", "phone": "+49123456789"}',
       'credit_card', 'paid'),
      ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'ORD-2024-002', 'processing', 15.97, 1.60, 0, 17.57,
       '{"firstName": "John", "lastName": "Doe", "addressLine1": "456 Oak Ave", "city": "Munich", "state": "Bavaria", "postalCode": "80331", "country": "Germany", "phone": "+49987654321"}',
       '{"firstName": "John", "lastName": "Doe", "addressLine1": "456 Oak Ave", "city": "Munich", "state": "Bavaria", "postalCode": "80331", "country": "Germany", "phone": "+49987654321"}',
       'credit_card', 'paid')
    ON CONFLICT (order_number) DO NOTHING
  `);

  // Insert order items
  await client.query(`
    INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, price, total_price)
    VALUES 
      ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440020', 'Spicy Curry Base', 'SCB-001', 2, 5.99, 11.98),
      ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', 'Mild Curry Base', 'MCB-002', 1, 5.99, 5.99),
      ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440022', 'Tomato Gravy', 'TG-003', 2, 4.99, 9.98)
  `);

  console.log('✅ Sample data inserted successfully');
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };