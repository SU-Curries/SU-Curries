import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, template: EmailTemplate) {
    try {
      // In development, just log the email instead of sending it
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📧 Email would be sent to: ${to}`);
        console.log(`📧 Subject: ${template.subject}`);
        return { success: true, messageId: 'dev-mode-' + Date.now() };
      }

      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', 'SU Curries <noreply@sucurries.com>'),
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send email: ${error.message}`);
    }
  }

  async sendOrderConfirmation(order: Order) {
    const template = this.generateOrderConfirmationTemplate(order);
    return this.sendEmail(order.customerEmail, template);
  }

  async sendOrderStatusUpdate(order: Order) {
    const template = this.generateOrderStatusUpdateTemplate(order);
    return this.sendEmail(order.customerEmail, template);
  }

  async sendWelcomeEmail(user: User) {
    const template = this.generateWelcomeTemplate(user);
    return this.sendEmail(user.email, template);
  }

  async sendPasswordResetEmail(user: User, resetToken: string) {
    const template = this.generatePasswordResetTemplate(user, resetToken);
    return this.sendEmail(user.email, template);
  }

  async sendLowStockAlert(productName: string, currentStock: number, threshold: number) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    if (!adminEmail) return;

    const template = this.generateLowStockAlertTemplate(productName, currentStock, threshold);
    return this.sendEmail(adminEmail, template);
  }

  async sendBookingConfirmation(booking: any) {
    const template = this.generateBookingConfirmationTemplate(booking);
    return this.sendEmail(booking.customerEmail, template);
  }

  async sendBookingStatusUpdate(booking: any) {
    const template = this.generateBookingStatusUpdateTemplate(booking);
    return this.sendEmail(booking.customerEmail, template);
  }

  async sendBookingCancellation(booking: any) {
    const template = this.generateBookingCancellationTemplate(booking);
    return this.sendEmail(booking.customerEmail, template);
  }



  private generateOrderConfirmationTemplate(order: Order): EmailTemplate {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.productName}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          €${item.unitPrice.toFixed(2)}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          €${item.totalPrice.toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - SU Curries</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706;">SU Curries</h1>
            <h2 style="color: #374151;">Order Confirmation</h2>
          </div>
          
          <p>Dear ${order.customerFirstName},</p>
          
          <p>Thank you for your order! We've received your order and are preparing it with care.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="text-align: right; margin: 20px 0;">
            <p><strong>Subtotal: €${order.subtotal.toFixed(2)}</strong></p>
            <p><strong>Tax: €${order.taxAmount.toFixed(2)}</strong></p>
            <p><strong>Shipping: €${order.shippingAmount.toFixed(2)}</strong></p>
            <p style="font-size: 18px; color: #d97706;"><strong>Total: €${order.totalAmount.toFixed(2)}</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>
              [Shipping Address]<br>
              [Address details will be shown here]<br>
              [Country]
            </p>
          </div>
          
          <p>We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.</p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280;">Thank you for choosing SU Curries!</p>
            <p style="color: #6b7280; font-size: 14px;">
              Visit us at <a href="https://sucurries.com" style="color: #d97706;">sucurries.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `Order Confirmation - ${order.orderNumber}`,
      html,
      text: `Order Confirmation - ${order.orderNumber}\n\nDear ${order.customerFirstName},\n\nThank you for your order! Order Number: ${order.orderNumber}\nTotal: €${order.totalAmount.toFixed(2)}\n\nWe'll send you another email when your order ships.`,
    };
  }

  private generateOrderStatusUpdateTemplate(order: Order): EmailTemplate {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      preparing: 'Your order is currently being prepared with care.',
      ready: 'Your order is ready for pickup/delivery!',
      delivered: 'Your order has been delivered. We hope you enjoy your SU Curries products!',
      cancelled: 'Your order has been cancelled. If you have any questions, please contact us.',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Update - SU Curries</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706;">SU Curries</h1>
            <h2 style="color: #374151;">Order Update</h2>
          </div>
          
          <p>Dear ${order.customerFirstName},</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Status Update</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>New Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          </div>
          
          <p>${statusMessages[order.status] || 'Your order status has been updated.'}</p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280;">Thank you for choosing SU Curries!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `Order Update - ${order.orderNumber}`,
      html,
      text: `Order Update - ${order.orderNumber}\n\nDear ${order.customerFirstName},\n\nYour order status has been updated to: ${order.status}\n\n${statusMessages[order.status] || 'Your order status has been updated.'}`,
    };
  }

  private generateWelcomeTemplate(user: User): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to SU Curries</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706;">Welcome to SU Curries!</h1>
          </div>
          
          <p>Dear ${user.firstName},</p>
          
          <p>Welcome to the SU Curries family! We're excited to have you join our community of curry enthusiasts.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul>
              <li>Explore our premium curry bases and spice blends</li>
              <li>Join our cooking classes to master authentic techniques</li>
              <li>Follow us for recipes and cooking tips</li>
              <li>Enjoy free shipping on orders over €50</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sucurries.com/products" style="background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Shop Now</a>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280;">Happy cooking!</p>
            <p style="color: #6b7280; font-size: 14px;">The SU Curries Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: 'Welcome to SU Curries!',
      html,
      text: `Welcome to SU Curries!\n\nDear ${user.firstName},\n\nWelcome to the SU Curries family! We're excited to have you join our community of curry enthusiasts.\n\nExplore our products at https://sucurries.com/products\n\nHappy cooking!\nThe SU Curries Team`,
    };
  }

  private generatePasswordResetTemplate(user: User, resetToken: string): EmailTemplate {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - SU Curries</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706;">SU Curries</h1>
            <h2 style="color: #374151;">Password Reset</h2>
          </div>
          
          <p>Dear ${user.firstName},</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this password reset, please ignore this email. The link will expire in 1 hour.</p>
          
          <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser: ${resetUrl}</p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280;">The SU Curries Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: 'Password Reset - SU Curries',
      html,
      text: `Password Reset - SU Curries\n\nDear ${user.firstName},\n\nWe received a request to reset your password. Click this link to create a new password: ${resetUrl}\n\nIf you didn't request this password reset, please ignore this email. The link will expire in 1 hour.`,
    };
  }

  private generateLowStockAlertTemplate(productName: string, currentStock: number, threshold: number): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Low Stock Alert - SU Curries Admin</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626;">Low Stock Alert</h1>
          </div>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Stock Alert</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Current Stock:</strong> ${currentStock}</p>
            <p><strong>Threshold:</strong> ${threshold}</p>
          </div>
          
          <p>The product "${productName}" is running low on stock. Please consider restocking soon to avoid stockouts.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.configService.get<string>('ADMIN_URL')}/products" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Manage Inventory</a>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `Low Stock Alert: ${productName}`,
      html,
      text: `Low Stock Alert: ${productName}\n\nThe product "${productName}" is running low on stock.\nCurrent Stock: ${currentStock}\nThreshold: ${threshold}\n\nPlease consider restocking soon.`,
    };
  }

  private generateBookingConfirmationTemplate(booking: any): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation - SU Curries</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706;">SU Curries</h1>
            <h2 style="color: #374151;">Booking Confirmation</h2>
          </div>
          
          <p>Dear ${booking.customerName},</p>
          
          <p>Your booking has been confirmed! We're looking forward to serving you.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.bookingTime}</p>
            <p><strong>Party Size:</strong> ${booking.guestCount || booking.partySize} guests</p>
            ${booking.tableNumber ? `<p><strong>Table:</strong> ${booking.tableNumber}</p>` : ''}
          </div>
          
          ${booking.specialRequests ? `
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Special Requests</h3>
            <p>${booking.specialRequests}</p>
          </div>
          ` : ''}
          
          <p>If you need to make any changes or cancel your booking, please contact us at least 2 hours in advance.</p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280;">We look forward to seeing you!</p>
            <p style="color: #6b7280; font-size: 14px;">The SU Curries Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `Booking Confirmation - ${booking.bookingNumber}`,
      html,
      text: `Booking Confirmation - ${booking.bookingNumber}\n\nDear ${booking.customerName},\n\nYour booking has been confirmed!\n\nDate: ${new Date(booking.bookingDate).toLocaleDateString()}\nTime: ${booking.bookingTime}\nParty Size: ${booking.guestCount || booking.partySize} guests\n\nWe look forward to seeing you!`,
    };
  }

  private generateBookingStatusUpdateTemplate(booking: any): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Update - SU Curries</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706;">SU Curries</h1>
            <h2 style="color: #374151;">Booking Update</h2>
          </div>
          
          <p>Dear ${booking.customerName},</p>
          
          <p>Your booking status has been updated.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Updated Booking Details</h3>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Status:</strong> ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
            <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.bookingTime}</p>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280;">Thank you for choosing SU Curries!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `Booking Update - ${booking.bookingNumber}`,
      html,
      text: `Booking Update - ${booking.bookingNumber}\n\nDear ${booking.customerName},\n\nYour booking status has been updated to: ${booking.status}\n\nDate: ${new Date(booking.bookingDate).toLocaleDateString()}\nTime: ${booking.bookingTime}`,
    };
  }

  private generateBookingCancellationTemplate(booking: any): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Cancelled - SU Curries</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97706;">SU Curries</h1>
            <h2 style="color: #374151;">Booking Cancelled</h2>
          </div>
          
          <p>Dear ${booking.customerName},</p>
          
          <p>Your booking has been cancelled as requested.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Cancelled Booking Details</h3>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.bookingTime}</p>
            <p><strong>Party Size:</strong> ${booking.guestCount || booking.partySize} guests</p>
          </div>
          
          <p>We're sorry to see you go! We hope to serve you again in the future.</p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280;">Thank you for considering SU Curries!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `Booking Cancelled - ${booking.bookingNumber}`,
      html,
      text: `Booking Cancelled - ${booking.bookingNumber}\n\nDear ${booking.customerName},\n\nYour booking has been cancelled as requested.\n\nDate: ${new Date(booking.bookingDate).toLocaleDateString()}\nTime: ${booking.bookingTime}\n\nWe hope to serve you again in the future!`,
    };
  }


}