import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a1a1a] shadow rounded-lg overflow-hidden border border-[#404040]">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment providers)</li>
                  <li>Order history and preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Provide customer support</li>
                  <li>Send you promotional communications (with your consent)</li>
                  <li>Improve our products and services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except as described in this policy:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Service providers who assist us in operating our business</li>
                  <li>Payment processors for transaction processing</li>
                  <li>Shipping companies for order fulfillment</li>
                  <li>Legal requirements or to protect our rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of promotional communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, 
                  analyze site traffic, and personalize content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: privacy@sufoods.com<br />
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

export default PrivacyPolicyPage;