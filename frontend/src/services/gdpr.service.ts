/**
 * GDPR Compliance Service
 * Handles data protection, privacy rights, and consent management
 */

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'cookies' | 'marketing' | 'analytics' | 'data_processing';
  granted: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  version: string; // Privacy policy version
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiryDate?: Date;
}

export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestDate: Date;
  scheduledDeletionDate: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
}

export interface PrivacySettings {
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  analyticsConsent: boolean;
  cookieConsent: boolean;
  dataRetentionPeriod: number; // in days
  autoDeleteAfterInactivity: boolean;
  shareDataWithPartners: boolean;
}

export interface CookieConsent {
  necessary: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: Date;
  version: string;
}

class GDPRService {
  private static instance: GDPRService;
  private apiBaseUrl: string;

  private constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
  }

  public static getInstance(): GDPRService {
    if (!GDPRService.instance) {
      GDPRService.instance = new GDPRService();
    }
    return GDPRService.instance;
  }

  /**
   * Record user consent
   */
  public async recordConsent(consent: Omit<ConsentRecord, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>): Promise<ConsentRecord> {
    try {
      const consentRecord: ConsentRecord = {
        ...consent,
        id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ipAddress: await this.getUserIP(),
        userAgent: navigator.userAgent
      };

      // Store in localStorage for demo (in production, send to API)
      if (process.env.NODE_ENV === 'development') {
        const existingConsents = this.getStoredConsents();
        existingConsents.push(consentRecord);
        localStorage.setItem('gdpr_consents', JSON.stringify(existingConsents));
        
        console.log('📋 GDPR Consent Recorded:', consentRecord);
        return consentRecord;
      }

      const response = await fetch(`${this.apiBaseUrl}/gdpr/consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(consentRecord)
      });

      if (!response.ok) {
        throw new Error('Failed to record consent');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  }

  /**
   * Get user's consent history
   */
  public async getConsentHistory(userId: string): Promise<ConsentRecord[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const consents = this.getStoredConsents();
        return consents.filter(c => c.userId === userId);
      }

      const response = await fetch(`${this.apiBaseUrl}/gdpr/consent/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get consent history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get consent history:', error);
      return [];
    }
  }

  /**
   * Update privacy settings
   */
  public async updatePrivacySettings(userId: string, settings: PrivacySettings): Promise<void> {
    try {
      // Record consent changes
      await this.recordConsent({
        userId,
        consentType: 'data_processing',
        granted: settings.dataProcessingConsent,
        version: '1.0'
      });

      if (process.env.NODE_ENV === 'development') {
        localStorage.setItem(`privacy_settings_${userId}`, JSON.stringify(settings));
        console.log('🔒 Privacy Settings Updated:', settings);
        return;
      }

      const response = await fetch(`${this.apiBaseUrl}/gdpr/privacy-settings/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw error;
    }
  }

  /**
   * Get privacy settings
   */
  public async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const stored = localStorage.getItem(`privacy_settings_${userId}`);
        if (stored) {
          return JSON.parse(stored);
        }
      }

      const response = await fetch(`${this.apiBaseUrl}/gdpr/privacy-settings/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get privacy settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get privacy settings:', error);
      // Return default settings
      return {
        dataProcessingConsent: false,
        marketingConsent: false,
        analyticsConsent: false,
        cookieConsent: false,
        dataRetentionPeriod: 365,
        autoDeleteAfterInactivity: false,
        shareDataWithPartners: false
      };
    }
  }

  /**
   * Request data export (Right to Data Portability)
   */
  public async requestDataExport(userId: string): Promise<DataExportRequest> {
    try {
      const exportRequest: DataExportRequest = {
        id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        requestDate: new Date(),
        status: 'pending'
      };

      if (process.env.NODE_ENV === 'development') {
        // Simulate processing
        setTimeout(() => {
          exportRequest.status = 'completed';
          exportRequest.downloadUrl = '/api/data-export/download/' + exportRequest.id;
          exportRequest.expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        }, 2000);

        console.log('📦 Data Export Requested:', exportRequest);
        return exportRequest;
      }

      const response = await fetch(`${this.apiBaseUrl}/gdpr/data-export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to request data export');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to request data export:', error);
      throw error;
    }
  }

  /**
   * Request data deletion (Right to be Forgotten)
   */
  public async requestDataDeletion(userId: string, reason?: string): Promise<DataDeletionRequest> {
    try {
      const deletionRequest: DataDeletionRequest = {
        id: `deletion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        requestDate: new Date(),
        scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days grace period
        status: 'scheduled',
        reason
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ Data Deletion Requested:', deletionRequest);
        return deletionRequest;
      }

      const response = await fetch(`${this.apiBaseUrl}/gdpr/data-deletion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, reason })
      });

      if (!response.ok) {
        throw new Error('Failed to request data deletion');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to request data deletion:', error);
      throw error;
    }
  }

  /**
   * Cancel data deletion request
   */
  public async cancelDataDeletion(requestId: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Data Deletion Cancelled:', requestId);
        return;
      }

      const response = await fetch(`${this.apiBaseUrl}/gdpr/data-deletion/${requestId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel data deletion');
      }
    } catch (error) {
      console.error('Failed to cancel data deletion:', error);
      throw error;
    }
  }

  /**
   * Set cookie consent
   */
  public setCookieConsent(consent: CookieConsent): void {
    const consentData = {
      ...consent,
      timestamp: new Date(),
      version: '1.0'
    };

    localStorage.setItem('cookie_consent', JSON.stringify(consentData));
    
    // Record consent in GDPR system
    this.recordConsent({
      userId: this.getCurrentUserId() || 'anonymous',
      consentType: 'cookies',
      granted: consent.necessary && consent.functional,
      version: '1.0'
    });

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: consentData 
    }));
  }

  /**
   * Get cookie consent
   */
  public getCookieConsent(): CookieConsent | null {
    try {
      const stored = localStorage.getItem('cookie_consent');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to get cookie consent:', error);
    }
    return null;
  }

  /**
   * Check if cookie consent is required
   */
  public isCookieConsentRequired(): boolean {
    const consent = this.getCookieConsent();
    if (!consent) return true;
    
    // Check if consent is older than 1 year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return new Date(consent.timestamp) < oneYearAgo;
  }

  /**
   * Generate data export file (for development)
   */
  public async generateDataExport(userId: string): Promise<any> {
    // This would typically be handled by the backend
    const userData = {
      personalInfo: {
        userId,
        email: 'user@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        createdAt: new Date().toISOString()
      },
      orders: [],
      bookings: [],
      preferences: await this.getPrivacySettings(userId),
      consentHistory: await this.getConsentHistory(userId)
    };

    return userData;
  }

  /**
   * Helper methods
   */
  private async getUserIP(): Promise<string> {
    try {
      // In production, this would be handled by the backend
      return '127.0.0.1';
    } catch {
      return 'unknown';
    }
  }

  private getCurrentUserId(): string | null {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user).id;
      }
    } catch {
      // Ignore error
    }
    return null;
  }

  private getStoredConsents(): ConsentRecord[] {
    try {
      const stored = localStorage.getItem('gdpr_consents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export const gdprService = GDPRService.getInstance();