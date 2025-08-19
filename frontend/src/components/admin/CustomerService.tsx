import React, { useState } from 'react';
import Button from '../common/Button';
import { 
  ChatBubbleLeftRightIcon, 
  TicketIcon, 
  StarIcon
} from '@heroicons/react/24/outline';

const CustomerService: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets] = useState([
    { 
      id: 1, 
      customer: 'John Doe', 
      subject: 'Order delivery issue', 
      status: 'Open', 
      priority: 'High',
      created: '2024-01-15 10:30',
      lastUpdate: '2024-01-15 14:20'
    },
    { 
      id: 2, 
      customer: 'Jane Smith', 
      subject: 'Product quality concern', 
      status: 'In Progress', 
      priority: 'Medium',
      created: '2024-01-14 16:45',
      lastUpdate: '2024-01-15 09:15'
    },
    { 
      id: 3, 
      customer: 'Peter Jones', 
      subject: 'Refund request', 
      status: 'Resolved', 
      priority: 'Low',
      created: '2024-01-13 11:20',
      lastUpdate: '2024-01-14 13:30'
    }
  ]);

  const [reviews] = useState([
    { 
      id: 1, 
      customer: 'Alice Brown', 
      product: 'Spicy Curry Base', 
      rating: 5, 
      comment: 'Excellent product! Very authentic taste.',
      status: 'Published',
      date: '2024-01-15'
    },
    { 
      id: 2, 
      customer: 'Bob Wilson', 
      product: 'Tikka Masala Combo', 
      rating: 4, 
      comment: 'Good quality but could use more spice.',
      status: 'Pending',
      date: '2024-01-14'
    }
  ]);

  const tabs = [
    { id: 'tickets', name: 'Support Tickets', icon: TicketIcon },
    { id: 'chat', name: 'Live Chat', icon: ChatBubbleLeftRightIcon },
    { id: 'reviews', name: 'Reviews', icon: StarIcon }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Customer Service Hub</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-[#cccccc]">
            {tickets.filter(t => t.status === 'Open').length} open tickets
          </div>
          <Button variant="primary">
            New Ticket
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#404040]">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#ff6b35] text-[#ff6b35]'
                  : 'border-transparent text-[#cccccc] hover:text-white hover:border-[#404040]'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
            <table className="min-w-full divide-y divide-[#404040]">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Last Update</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      #{ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#cccccc]">
                      {ticket.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#cccccc]">
                      {ticket.lastUpdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2">
                        View
                      </Button>
                      <Button variant="secondary" size="small">
                        Reply
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Live Chat Sessions</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-[#cccccc]">3 active chats</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border border-[#404040] rounded-lg p-4 bg-[#1a1a1a]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">Sarah Johnson</span>
                <span className="text-sm text-[#cccccc]">2 minutes ago</span>
              </div>
              <p className="text-sm text-[#cccccc]">Hi, I need help with my recent order...</p>
              <Button variant="primary" size="small" className="mt-2">
                Join Chat
              </Button>
            </div>
            <div className="border border-[#404040] rounded-lg p-4 bg-[#1a1a1a]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">Mike Davis</span>
                <span className="text-sm text-[#cccccc]">5 minutes ago</span>
              </div>
              <p className="text-sm text-[#cccccc]">Question about cooking instructions...</p>
              <Button variant="primary" size="small" className="mt-2">
                Join Chat
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
            <table className="min-w-full divide-y divide-[#404040]">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {review.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#cccccc]">
                      {review.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white max-w-xs truncate">
                      {review.comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        review.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2">
                        {review.status === 'Published' ? 'Hide' : 'Approve'}
                      </Button>
                      <Button variant="secondary" size="small">
                        Reply
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerService;