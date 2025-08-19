import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';
import NotificationModal from '../common/NotificationModal';
import { dataStore } from '../../store/dataStore';
import {
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const loadUsers = () => {
    try {
      setLoading(true);
      const allUsers = dataStore.getUsers();
      const orders = dataStore.getOrders();

      // Calculate user statistics
      const usersWithStats = allUsers.map(user => {
        const userOrders = orders.filter(order => order.userId === user.id);
        const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || 'N/A',
          role: user.role === 'customer' ? 'Customer' : user.role === 'admin' ? 'Admin' : user.role === 'driver' ? 'Driver' : 'Customer',
          status: user.isActive ? 'Active' : 'Suspended',
          joinDate: user.createdAt,
          lastLogin: user.updatedAt,
          orders: userOrders.length,
          totalSpent: totalSpent
        };
      });

      setUsers(usersWithStats);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role.toLowerCase() === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status.toLowerCase() === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-900 text-green-300 border-green-500';
      case 'Suspended': return 'bg-red-900 text-red-300 border-red-500';
      case 'Pending': return 'bg-yellow-900 text-yellow-300 border-yellow-500';
      case 'Banned': return 'bg-red-900 text-red-300 border-red-500';
      default: return 'bg-gray-900 text-gray-300 border-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-900 text-purple-300 border-purple-500';
      case 'Driver': return 'bg-blue-900 text-blue-300 border-blue-500';
      case 'Customer': return 'bg-gray-900 text-gray-300 border-gray-500';
      default: return 'bg-gray-900 text-gray-300 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Suspended': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'Pending': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'Banned': return <XCircleIcon className="h-4 w-4" />;
      default: return <CheckCircleIcon className="h-4 w-4" />;
    }
  };

  const viewUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setSelectedUser(user);
      setShowUserModal(true);
    }
  };

  const suspendUser = (id: string) => {
    const user = users.find(u => u.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Suspend User',
      message: `Are you sure you want to suspend ${user?.name}?`,
      type: 'warning',
      onConfirm: () => {
        setUsers(prev => prev.map(user =>
          user.id === id ? { ...user, status: 'Suspended' } : user
        ));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setNotificationModal({
          isOpen: true,
          title: 'Success',
          message: 'User suspended successfully',
          type: 'success'
        });
      }
    });
  };

  const activateUser = (id: string) => {
    setUsers(prev => prev.map(user =>
      user.id === id ? { ...user, status: 'Active' } : user
    ));
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      setNotificationModal({
        isOpen: true,
        title: 'No Selection',
        message: 'Please select users first',
        type: 'warning'
      });
      return;
    }

    switch (action) {
      case 'activate':
        setConfirmModal({
          isOpen: true,
          title: 'Activate Users',
          message: `Are you sure you want to activate ${selectedUsers.length} users?`,
          type: 'info',
          onConfirm: () => {
            setLoading(true);
            setTimeout(() => {
              setUsers(prev => prev.map(user =>
                selectedUsers.includes(user.id) ? { ...user, status: 'Active' } : user
              ));
              setSelectedUsers([]);
              setLoading(false);
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
              setNotificationModal({
                isOpen: true,
                title: 'Success',
                message: `${selectedUsers.length} users activated successfully`,
                type: 'success'
              });
            }, 1000);
          }
        });
        break;
      case 'suspend':
        setConfirmModal({
          isOpen: true,
          title: 'Suspend Users',
          message: `Are you sure you want to suspend ${selectedUsers.length} users?`,
          type: 'warning',
          onConfirm: () => {
            setLoading(true);
            setTimeout(() => {
              setUsers(prev => prev.map(user =>
                selectedUsers.includes(user.id) ? { ...user, status: 'Suspended' } : user
              ));
              setSelectedUsers([]);
              setLoading(false);
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
              setNotificationModal({
                isOpen: true,
                title: 'Success',
                message: `${selectedUsers.length} users suspended successfully`,
                type: 'success'
              });
            }, 1000);
          }
        });
        break;
      case 'delete':
        setConfirmModal({
          isOpen: true,
          title: 'Delete Users',
          message: `Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`,
          type: 'danger',
          onConfirm: () => {
            setLoading(true);
            setTimeout(() => {
              setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
              setSelectedUsers([]);
              setLoading(false);
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
              setNotificationModal({
                isOpen: true,
                title: 'Success',
                message: `${selectedUsers.length} users deleted successfully`,
                type: 'success'
              });
            }, 1000);
          }
        });
        break;
      case 'export':
        setNotificationModal({
          isOpen: true,
          title: 'Export Started',
          message: 'Exporting selected users...',
          type: 'info'
        });
        break;
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    );
  };

  const sendEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setNotificationModal({
      isOpen: true,
      title: 'Email Client',
      message: `Opening email client to send message to ${user?.email}`,
      type: 'info'
    });
  };

  const callUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setNotificationModal({
      isOpen: true,
      title: 'Phone Call',
      message: `Calling ${user?.phone}`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Users Management</h2>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            Export Users
          </Button>
          <Button variant="primary" className="flex items-center">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#2d2d2d] p-4 rounded-lg shadow border border-[#404040]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder-[#cccccc]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
            <option value="driver">Drivers</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
            <option value="banned">Banned</option>
          </select>
          <div className="text-sm text-[#cccccc] flex items-center">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-[#ff6b35]/20 p-4 rounded-lg border border-[#ff6b35]">
          <div className="flex items-center justify-between">
            <span className="text-white">{selectedUsers.length} users selected</span>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleBulkAction('activate')}
                disabled={loading}
              >
                Activate
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleBulkAction('suspend')}
                disabled={loading}
              >
                Suspend
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleBulkAction('export')}
                disabled={loading}
              >
                Export
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleBulkAction('delete')}
                disabled={loading}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#2d2d2d] shadow overflow-x-auto sm:rounded-md border border-[#404040]">
        <table className="w-full divide-y divide-[#404040]">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#404040] bg-[#1a1a1a] text-[#ff6b35]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Activity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className={selectedUsers.includes(user.id) ? 'bg-[#1a1a1a]' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-[#404040] bg-[#1a1a1a] text-[#ff6b35]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-[#404040] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-sm text-[#cccccc]">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-white">{user.email}</div>
                    <div className="text-sm text-[#cccccc]">{user.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                    {user.role === 'Admin' && <ShieldCheckIcon className="h-3 w-3 mr-1" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    <span className="ml-1">{user.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-white">Joined: {new Date(user.joinDate).toLocaleDateString()}</div>
                    <div className="text-sm text-[#cccccc]">Last: {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {user.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  €{user.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => viewUser(user.id)}
                      title="View Profile"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => sendEmail(user.id)}
                      title="Send Email"
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => callUser(user.id)}
                      title="Call User"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </Button>
                    {user.status === 'Active' ? (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => suspendUser(user.id)}
                        title="Suspend User"
                        className="text-red-400 hover:text-red-300"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => activateUser(user.id)}
                        title="Activate User"
                        className="text-green-400 hover:text-green-300"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#cccccc] text-lg">No users found</div>
            <div className="text-[#cccccc] text-sm mt-2 opacity-70">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* Enhanced User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2d2d2d] p-6 rounded-lg max-w-4xl w-full mx-4 border border-[#404040] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">User Profile</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-[#cccccc] hover:text-white"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <p className="text-white">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <p className="text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                      <p className="text-white">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">Account Activity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Join Date</label>
                      <p className="text-white">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Last Login</label>
                      <p className="text-white">{selectedUser.lastLogin === 'Never' ? 'Never' : new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Total Orders</label>
                      <p className="text-white">{selectedUser.orders}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Total Spent</label>
                      <p className="text-white">€{selectedUser.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">Account Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedUser.status)}`}>
                        {getStatusIcon(selectedUser.status)}
                        <span className="ml-1">{selectedUser.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="secondary" size="small" className="w-full justify-start">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="secondary" size="small" className="w-full justify-start">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Call User
                    </Button>
                    <Button variant="secondary" size="small" className="w-full justify-start">
                      View Order History
                    </Button>
                    {selectedUser.status === 'Active' ? (
                      <Button variant="secondary" size="small" className="w-full justify-start text-red-400">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Suspend Account
                      </Button>
                    ) : (
                      <Button variant="secondary" size="small" className="w-full justify-start text-green-400">
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Activate Account
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="primary" onClick={() => setShowUserModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        loading={loading}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
      />
    </div>
  );
};

export default UsersManagement;