import { apiService } from './api.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dataProcessingConsent: boolean;
  marketingConsent?: boolean;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  preferredLanguage?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Authentication service for handling user login, registration, etc.
 */
export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  /**
   * Get singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with email and password
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // For development/demo purposes only - remove in production
      if (process.env.NODE_ENV === 'development') {
        const demoCredentials = this.getDemoCredentials();
        const demoUser = demoCredentials.find((cred: any) => 
          cred.email === credentials.email && cred.password === credentials.password
        );
        
        if (demoUser) {
          const demoResponse: AuthResponse = {
            token: `demo-token-${Date.now()}`,
            user: demoUser.user
          };
          
          // Store token and user data
          localStorage.setItem('token', demoResponse.token);
          localStorage.setItem('user', JSON.stringify(demoResponse.user));
          
          return demoResponse;
        }
      }
      
      // Production authentication via API
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  public async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Additional cleanup if needed
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!(token && token !== 'undefined' && token !== 'null');
  }

  /**
   * Get current user data
   */
  public getCurrentUser(): UserData | null {
    const userData = localStorage.getItem('user');
    if (!userData || userData === 'undefined' || userData === 'null') {
      return null;
    }
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  }

  /**
   * Check if user is an admin
   */
  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
  
  /**
   * Check if user has a specific role
   */
  public hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Get demo credentials for development environment only
   * This method should be removed in production
   */
  private getDemoCredentials() {
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }
    
    // Import mock users dynamically to avoid circular dependencies
    const { mockUsers } = require('../data/extensiveMockData');
    
    return mockUsers.map((user: any) => ({
      email: user.email,
      password: user.password,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      }
    }));
  }

  /**
   * Request password reset
   */
  public async requestPasswordReset(data: ResetPasswordData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/forgot-password', data);
  }

  /**
   * Change user password
   */
  public async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/change-password', data);
  }

  /**
   * Refresh authentication token
   */
  public async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/refresh');
      
      // Update stored token
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout(); // Force logout on refresh failure
      throw error;
    }
  }
}

// Export a singleton instance
export const authService = AuthService.getInstance();