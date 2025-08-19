import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a1a1a] shadow rounded-lg overflow-hidden border border-[#404040]">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">About SU Foods</h1>
            
            <div className="prose max-w-none">
              <div className="mb-8">
                <img
                  src="/Assets/su_curries_logo.png"
                  alt="SU Foods"
                  className="h-24 w-auto mx-auto mb-6"
                />
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  SU Foods was founded with a passion for bringing authentic Indian cuisine to food lovers everywhere. 
                  Our journey began with a simple mission: to share the rich flavors and traditional recipes that have 
                  been passed down through generations.
                </p>
                <p className="text-gray-700 mb-4">
                  What started as a small family business has grown into a comprehensive food experience, offering 
                  everything from premium curry bases and spice blends to restaurant dining and catering services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Premium Products</h3>
                    <p className="text-gray-600">
                      Authentic curry bases, spice mixes, and ready-to-cook meal solutions made with traditional recipes.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Restaurant Dining</h3>
                    <p className="text-gray-600">
                      Experience our authentic Indian cuisine in a warm, welcoming atmosphere with table booking available.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Catering Services</h3>
                    <p className="text-gray-600">
                      Professional catering for events, parties, and corporate functions with customizable menus.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Authenticity:</strong> We use traditional recipes and high-quality ingredients</li>
                  <li><strong>Quality:</strong> Every product is carefully crafted to meet our high standards</li>
                  <li><strong>Customer Service:</strong> We're committed to providing exceptional service</li>
                  <li><strong>Innovation:</strong> We continuously improve our offerings while respecting tradition</li>
                  <li><strong>Community:</strong> We believe food brings people together</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Visit Us</h3>
                      <p className="text-gray-700">
                        123 Food Street<br />
                        Flavor Town<br />
                        Phone: +1 234 567 890<br />
                        Email: info@sufoods.com
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Business Hours</h3>
                      <p className="text-gray-700">
                        Monday - Friday: 9:00 AM - 10:00 PM<br />
                        Saturday - Sunday: 11:00 AM - 11:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;