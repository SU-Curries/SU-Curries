/**
 * Email service for handling transactional emails
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface EmailData {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  variables?: Record<string, any>;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
}

export interface EmailResponse {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  timestamp: Date;
}

export interface EmailPreferences {
  orderConfirmations: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  newsletterSubscription: boolean;
  bookingConfirmations: boolean;
  securityAlerts: boolean;
}

class EmailService {
  private static instance: EmailService;
  private apiBaseUrl: string;
  private apiKey: string;

  private constructor() {
    this.apiBaseUrl = process.env.REACT_APP_EMAIL_SERVICE_URL || 'http://localhost:3001/api/email';
    this.apiKey = process.env.REACT_APP_EMAIL_API_KEY || '';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send a transactional email
   */
  public async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      // In development, simulate email sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email Simulation:', {
          to: emailData.to,
          subject: emailData.subject,
          template: emailData.templateId,
          variables: emailData.variables
        });

        return {
          messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'sent',
          timestamp: new Date()
        };
      }

      // Production email sending
      const response = await fetch(`${this.apiBaseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`Email service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Send order confirmation email
   */
  public async sendOrderConfirmation(orderData: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    orderItems: any[];
    totalAmount: number;
    estimatedDelivery?: string;
  }): Promise<EmailResponse> {
    return this.sendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      templateId: 'order-confirmation',
      variables: {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        orderItems: orderData.orderItems,
        totalAmount: orderData.totalAmount,
        estimatedDelivery: orderData.estimatedDelivery || 'TBD',
        orderDate: new Date().toLocaleDateString(),
        supportEmail: 'support@sucurries.com',
        trackingUrl: `${window.location.origin}/orders/${orderData.orderNumber}`
      }
    });
  }

  /**
   * Send order status update email
   */
  public async sendOrderStatusUpdate(updateData: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    newStatus: string;
    statusMessage?: string;
    trackingInfo?: string;
  }): Promise<EmailResponse> {
    return this.sendEmail({
      to: updateData.customerEmail,
      subject: `Order Update - ${updateData.orderNumber}`,
      templateId: 'order-status-update',
      variables: {
        customerName: updateData.customerName,
        orderNumber: updateData.orderNumber,
        newStatus: updateData.newStatus,
        statusMessage: updateData.statusMessage || '',
        trackingInfo: updateData.trackingInfo || '',
        updateDate: new Date().toLocaleDateString(),
        trackingUrl: `${window.location.origin}/orders/${updateData.orderNumber}`
      }
    });
  }

  /**
   * Send booking confirmation email
   */
  public async sendBookingConfirmation(bookingData: {
    customerEmail: string;
    customerName: string;
    bookingNumber: string;
    bookingDate: string;
    bookingTime: string;
    guestCount: number;
    specialRequests?: string;
  }): Promise<EmailResponse> {
    return this.sendEmail({
      to: bookingData.customerEmail,
      subject: `Table Booking Confirmation - ${bookingData.bookingNumber}`,
      templateId: 'booking-confirmation',
      variables: {
        customerName: bookingData.customerName,
        bookingNumber: bookingData.bookingNumber,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        guestCount: bookingData.guestCount,
        specialRequests: bookingData.specialRequests || 'None',
        restaurantAddress: '123 Curry Street, Food City, FC 12345',
        restaurantPhone: '+1 (555) 123-CURRY',
        confirmationDate: new Date().toLocaleDateString()
      }
    });
  }

  /**
   * Send password reset email
   */
  public async sendPasswordReset(resetData: {
    customerEmail: string;
    customerName: string;
    resetToken: string;
    expiryTime: string;
  }): Promise<EmailResponse> {
    return this.sendEmail({
      to: resetData.customerEmail,
      subject: 'Password Reset Request - SU Curries',
      templateId: 'password-reset',
      variables: {
        customerName: resetData.customerName,
        resetUrl: `${window.location.origin}/reset-password?token=${resetData.resetToken}`,
        expiryTime: resetData.expiryTime,
        requestDate: new Date().toLocaleDateString(),
        supportEmail: 'support@sucurries.com'
      }
    });
  }

  /**
   * Send welcome email for new users
   */
  public async sendWelcomeEmail(userData: {
    customerEmail: string;
    customerName: string;
    verificationToken?: string;
  }): Promise<EmailResponse> {
    return this.sendEmail({
      to: userData.customerEmail,
      subject: 'Welcome to SU Curries!',
      templateId: 'welcome',
      variables: {
        customerName: userData.customerName,
        verificationUrl: userData.verificationToken 
          ? `${window.location.origin}/verify-email?token=${userData.verificationToken}`
          : null,
        storeUrl: `${window.location.origin}/store`,
        profileUrl: `${window.location.origin}/profile`,
        joinDate: new Date().toLocaleDateString()
      }
    });
  }

  /**
   * Send promotional email
   */
  public async sendPromotionalEmail(promoData: {
    customerEmail: string;
    customerName: string;
    promoTitle: string;
    promoDescription: string;
    promoCode?: string;
    expiryDate?: string;
    ctaUrl?: string;
  }): Promise<EmailResponse> {
    return this.sendEmail({
      to: promoData.customerEmail,
      subject: promoData.promoTitle,
      templateId: 'promotional',
      variables: {
        customerName: promoData.customerName,
        promoTitle: promoData.promoTitle,
        promoDescription: promoData.promoDescription,
        promoCode: promoData.promoCode || '',
        expiryDate: promoData.expiryDate || '',
        ctaUrl: promoData.ctaUrl || `${window.location.origin}/store`,
        unsubscribeUrl: `${window.location.origin}/unsubscribe`
      }
    });
  }

  /**
   * Get email templates
   */
  public async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/templates`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch email templates');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get email templates:', error);
      // Return default templates for development
      return this.getDefaultTemplates();
    }
  }

  /**
   * Update email preferences
   */
  public async updateEmailPreferences(
    userId: string, 
    preferences: EmailPreferences
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update email preferences');
      }
    } catch (error) {
      console.error('Failed to update email preferences:', error);
      throw error;
    }
  }

  /**
   * Get email preferences for a user
   */
  public async getEmailPreferences(userId: string): Promise<EmailPreferences> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/preferences/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get email preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get email preferences:', error);
      // Return default preferences
      return {
        orderConfirmations: true,
        orderUpdates: true,
        promotionalEmails: false,
        newsletterSubscription: false,
        bookingConfirmations: true,
        securityAlerts: true
      };
    }
  }

  /**
   * Default email templates for development
   */
  private getDefaultTemplates(): EmailTemplate[] {
    return [
      {
        id: 'order-confirmation',
        name: 'Order Confirmation',
        subject: 'Order Confirmation - {{orderNumber}}',
        htmlContent: `
          <h1>Thank you for your order, {{customerName}}!</h1>
          <p>Your order #{{orderNumber}} has been confirmed.</p>
          <p>Total: €{{totalAmount}}</p>
          <p>Estimated delivery: {{estimatedDelivery}}</p>
        `,
        textContent: 'Thank you for your order, {{customerName}}! Your order #{{orderNumber}} has been confirmed.',
        variables: ['customerName', 'orderNumber', 'totalAmount', 'estimatedDelivery']
      },
      {
        id: 'order-status-update',
        name: 'Order Status Update',
        subject: 'Order Update - {{orderNumber}}',
        htmlContent: `
          <h1>Order Status Update</h1>
          <p>Hi {{customerName}},</p>
          <p>Your order #{{orderNumber}} status has been updated to: {{newStatus}}</p>
          <p>{{statusMessage}}</p>
        `,
        textContent: 'Hi {{customerName}}, your order #{{orderNumber}} status: {{newStatus}}',
        variables: ['customerName', 'orderNumber', 'newStatus', 'statusMessage']
      }
    ];
  }
}

export const emailService = EmailService.getInstance();