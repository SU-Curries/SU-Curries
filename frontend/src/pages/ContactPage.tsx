import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccess(true);
    setLoading(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We'd love to hear from you. Get in touch with us for any questions or inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPinIcon className="h-6 w-6 text-accent-color mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    123 Food Street<br />
                    Flavor Town<br />
                    12345
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <PhoneIcon className="h-6 w-6 text-accent-color mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 234 567 890</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="h-6 w-6 text-accent-color mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">info@sufoods.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <ClockIcon className="h-6 w-6 text-accent-color mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                  <div className="text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 10:00 PM</p>
                    <p>Saturday - Sunday: 11:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Interactive Map Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white shadow rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="catering">Catering Services</option>
                      <option value="products">Product Information</option>
                      <option value="booking">Table Booking</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;