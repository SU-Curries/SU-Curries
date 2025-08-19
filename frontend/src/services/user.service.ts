import { apiService } from './api.service';
import { Address } from './order.service';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  marketingConsent?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * User service for handling user profile operations
 */
export class UserService {
  private static instance: UserService;

  private constructor() {}

  /**
   * Get singleton instance of UserService
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get current user profile
   */
  public async getProfile(): Promise<UserProfile> {
    try {
      // For demo purposes, return mock profile
      return {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@sucurries.com',
        phone: '+49123456789',
        addresses: [],
        defaultShippingAddressId: 'addr-1',
        defaultBillingAddressId: 'addr-1',
        marketingConsent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      return apiService.patch<UserProfile>('/users/profile', data);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  public async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      return apiService.post<void>('/users/change-password', data);
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  /**
   * Get user addresses
   */
  public async getAddresses(): Promise<Address[]> {
    try {
      // For demo purposes, return mock addresses
      return [
        {
          id: 'addr-1',
          firstName: 'John',
          lastName: 'Doe',
          addressLine1: '123 Main Street',
          city: 'Berlin',
          state: 'Berlin',
          postalCode: '10115',
          country: 'Germany',
          phone: '+49123456789'
        }
      ];
    } catch (error) {
      console.error('Failed to fetch user addresses:', error);
      throw error;
    }
  }

  /**
   * Add a new address
   */
  public async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    try {
      return apiService.post<Address>('/users/addresses', address);
    } catch (error) {
      console.error('Failed to add address:', error);
      throw error;
    }
  }

  /**
   * Update an address
   */
  public async updateAddress(id: string, address: Partial<Address>): Promise<Address> {
    try {
      return apiService.patch<Address>(`/users/addresses/${id}`, address);
    } catch (error) {
      console.error(`Failed to update address with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an address
   */
  public async deleteAddress(id: string): Promise<void> {
    try {
      return apiService.delete<void>(`/users/addresses/${id}`);
    } catch (error) {
      console.error(`Failed to delete address with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Set default shipping address
   */
  public async setDefaultShippingAddress(id: string): Promise<UserProfile> {
    try {
      return apiService.post<UserProfile>(`/users/addresses/${id}/default-shipping`, {});
    } catch (error) {
      console.error(`Failed to set default shipping address with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Set default billing address
   */
  public async setDefaultBillingAddress(id: string): Promise<UserProfile> {
    try {
      return apiService.post<UserProfile>(`/users/addresses/${id}/default-billing`, {});
    } catch (error) {
      console.error(`Failed to set default billing address with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all users for admin
   */
  public async getAdminUsers(): Promise<{ users: UserProfile[] }> {
    try {
      // Get real users from dataStore
      const { dataStore } = await import('../store/dataStore');
      const allUsers = dataStore.getUsers();
      
      const userProfiles: UserProfile[] = allUsers.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        addresses: [], // Would be populated from user addresses in real app
        marketingConsent: false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      
      return { users: userProfiles };
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      throw error;
    }
  }

  /**
   * Update a user (admin only)
   */
  public async updateUser(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // For demo purposes, return updated user
      const mockUser: UserProfile = {
        id,
        firstName: data.firstName || 'User',
        lastName: data.lastName || 'Name',
        email: data.email || 'user@example.com',
        addresses: [],
        marketingConsent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      return mockUser;
    } catch (error) {
      console.error(`Failed to update user with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userService = UserService.getInstance();