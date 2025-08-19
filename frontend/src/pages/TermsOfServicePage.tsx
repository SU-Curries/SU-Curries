import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using SU Foods website and services, you accept and agree to be bound 
                  by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Products and Services</h2>
                <p className="text-gray-700 mb-4">
                  SU Foods offers authentic Indian food products, restaurant dining, and catering services. 
                  We reserve the right to modify or discontinue any product or service without notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Orders and Payment</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment must be made at the time of order</li>
                  <li>We accept major credit cards and other payment methods as displayed</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Shipping and Delivery</h2>
                <p className="text-gray-700 mb-4">
                  We will make every effort to deliver products within the estimated timeframe. 
                  However, delivery times are estimates and not guaranteed.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Returns and Refunds</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Food products may be returned within 24 hours if unopened and refrigerated</li>
                  <li>Refunds will be processed within 5-7 business days</li>
                  <li>Custom orders and perishable items are non-refundable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  You are responsible for maintaining the confidentiality of your account information 
                  and for all activities that occur under your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Uses</h2>
                <p className="text-gray-700 mb-4">
                  You may not use our service:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  SU Foods shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                  or other intangible losses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
                <p className="text-gray-700 mb-4">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which 
                  SU Foods operates.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  Questions about the Terms of Service should be sent to us at:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: legal@sufoods.com<br />
                    Phone: +1 234 567 890<br />
                    Address: 123 Food Street, Flavor Town
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;