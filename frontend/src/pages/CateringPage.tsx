import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { menuItems, menuCategories } from '../data/menuItems';

const CateringPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    date: '',
    budget: '',
    details: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    console.log(formData);
    alert('Your catering inquiry has been submitted!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">Catering Services</h1>
      <p className="text-center text-text-secondary mb-12">
        Planning an event? Let us take care of the food. Browse our menu and get a quote.
      </p>
      
      {/* Menu Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-text-primary">{item.name}</h3>
                  <span className="text-lg font-bold text-accent-color">€{item.price}</span>
                </div>
                <p className="text-text-secondary text-sm mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-secondary-bg px-2 py-1 rounded">{item.category}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.spiceLevel === 'Hot' ? 'bg-red-100 text-red-700' :
                    item.spiceLevel === 'Medium' ? 'bg-orange-100 text-orange-700' :
                    item.spiceLevel === 'Mild' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{item.spiceLevel}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Card className="p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full p-2 rounded-md bg-secondary-bg border border-border-color">
              <option value="">Select Event Type</option>
              <option value="birthday">Birthday</option>
              <option value="corporate">Corporate</option>
              <option value="wedding">Wedding</option>
              <option value="other">Other</option>
            </select>
            <Input
              type="number"
              name="guestCount"
              placeholder="Number of Guests"
              value={formData.guestCount}
              onChange={handleChange}
              min="1"
              required
            />
            <Input
              type="text"
              name="budget"
              placeholder="Budget (optional)"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>
          <textarea
            name="details"
            placeholder="Tell us more about your event..."
            value={formData.details}
            onChange={handleChange}
            rows={6}
            className="w-full p-2 rounded-md bg-secondary-bg border border-border-color focus:outline-none focus:ring-2 focus:ring-accent-color"
          />
          <Button type="submit" variant="primary" className="w-full">
            Get a Quote
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CateringPage; 