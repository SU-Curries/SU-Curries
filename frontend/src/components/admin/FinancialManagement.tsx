import React, { useState } from 'react';
import Button from '../common/Button';
import { CurrencyEuroIcon, DocumentArrowDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const FinancialManagement: React.FC = () => {
  const [financialData] = useState({
    totalRevenue: 45230.75,
    monthlyRevenue: 12450.50,
    totalExpenses: 8750.25,
    netProfit: 36480.50,
    transactions: [
      { id: 1, type: 'Sale', description: 'Order #ORD-2024-001', amount: 78.50, date: '2024-01-15' },
      { id: 2, type: 'Expense', description: 'Ingredient Purchase', amount: -245.00, date: '2024-01-14' },
      { id: 3, type: 'Sale', description: 'Order #ORD-2024-002', amount: 125.75, date: '2024-01-14' },
      { id: 4, type: 'Expense', description: 'Utility Bill', amount: -180.50, date: '2024-01-13' }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Financial Management</h2>
        <Button variant="primary" className="flex items-center">
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <CurrencyEuroIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">€{financialData.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">Monthly Revenue</p>
              <p className="text-2xl font-bold text-blue-400">€{financialData.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <CurrencyEuroIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">€{financialData.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <CurrencyEuroIcon className="h-8 w-8 text-[#ff6b35]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">Net Profit</p>
              <p className="text-2xl font-bold text-[#ff6b35]">€{financialData.netProfit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-primary-bg shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-border-color">
          <h3 className="text-lg font-semibold text-text-primary">Recent Transactions</h3>
        </div>
        <table className="min-w-full divide-y divide-border-color">
          <thead className="bg-secondary-bg">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-primary-bg divide-y divide-border-color">
            {financialData.transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                    €{Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {transaction.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialManagement;