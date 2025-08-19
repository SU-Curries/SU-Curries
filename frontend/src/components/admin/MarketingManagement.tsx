import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { mockCampaigns, mockPromotions } from '../../data/extensiveMockData';
import { PlusIcon, EnvelopeIcon, MegaphoneIcon, GiftIcon } from '@heroicons/react/24/outline';

const MarketingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketingData();
  }, []);

  const loadMarketingData = () => {
    try {
      setLoading(true);
      // Load campaigns and promotions from mock data
      setCampaigns(mockCampaigns);
      setPromotions(mockPromotions);
    } catch (error) {
      console.error('Failed to load marketing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'campaigns', name: 'Campaigns', icon: MegaphoneIcon },
    { id: 'promotions', name: 'Promotions', icon: GiftIcon },
    { id: 'reviews', name: 'Reviews', icon: EnvelopeIcon }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Marketing & Promotions</h2>
        <Button variant="primary" className="flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-accent-color text-accent-color'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
            <table className="min-w-full divide-y divide-[#404040]">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Sent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Opened</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-[#cccccc]">
                      Loading campaigns...
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-[#cccccc]">
                      No campaigns found
                    </td>
                  </tr>
                ) : campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {campaign.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        campaign.status === 'Active' ? 'bg-green-900 text-green-300 border-green-500' :
                        campaign.status === 'Scheduled' ? 'bg-yellow-900 text-yellow-300 border-yellow-500' :
                        'bg-gray-900 text-gray-300 border-gray-500'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {campaign.sent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {campaign.opened.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2">
                        Edit
                      </Button>
                      <Button variant="secondary" size="small">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <div className="space-y-4">
          <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
            <table className="min-w-full divide-y divide-[#404040]">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-[#cccccc]">
                      Loading promotions...
                    </td>
                  </tr>
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-[#cccccc]">
                      No promotions found
                    </td>
                  </tr>
                ) : promotions.map((promo) => (
                  <tr key={promo.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {promo.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {promo.discount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {promo.usage}/{promo.limit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {promo.expires}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2">
                        Edit
                      </Button>
                      <Button variant="secondary" size="small">
                        Disable
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <h3 className="text-lg font-semibold mb-4 text-white">Customer Reviews Management</h3>
          <p className="text-[#cccccc]">Review management functionality coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default MarketingManagement;