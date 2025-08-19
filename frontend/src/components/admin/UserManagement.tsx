import React, { useState, useEffect } from 'react';
import { userService, UserProfile } from '../../services/user.service';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAdminUsers();
      setUsers(response.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await userService.updateUser(userId, { role: newRole } as any);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await userService.updateUser(userId, { status: newStatus } as any);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || (user as any).role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button variant="primary" className="flex items-center">
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add User
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-accent-color flex items-center justify-center text-white font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={(user as any).role || 'customer'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusToggle(user.id, (user as any).status || 'active')}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ((user as any).status || 'active') === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {((user as any).status || 'active') === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default UserManagement;