import React from 'react';
import { menu } from '../data/menu';
import Card from '../components/common/Card';

const MenuPage = () => {
  const menuCategories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">Our Menu</h1>
      {menuCategories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-bold text-accent-color mb-6">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menu
              .filter((item) => item.category === category)
              .map((item) => (
                <Card key={item.name} className="flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-text-primary">{item.name}</h3>
                    <p className="text-text-secondary text-sm my-2">{item.description}</p>
                    <p className="text-lg font-semibold text-accent-color">${item.price.toFixed(2)}</p>
                  </div>
                </Card>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuPage; 