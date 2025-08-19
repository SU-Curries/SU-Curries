import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  trace?: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly isDevelopment: boolean;
  private readonly logLevel: LogLevel;

  constructor(private configService: ConfigService) {
    this.isDevelopment = configService.get('NODE_ENV') === 'development';
    this.logLevel = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const level = this.configService.get('LOG_LEVEL', 'info').toLowerCase();
    return Object.values(LogLevel).includes(level as LogLevel) 
      ? (level as LogLevel) 
      : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatLog(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    const userId = entry.userId ? `[User:${entry.userId}]` : '';
    const requestId = entry.requestId ? `[Req:${entry.requestId}]` : '';
    
    let logMessage = `${timestamp} [${entry.level.toUpperCase()}] ${context}${userId}${requestId} ${entry.message}`;
    
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      logMessage += ` | Metadata: ${JSON.stringify(entry.metadata)}`;
    }
    
    if (entry.trace && this.isDevelopment) {
      logMessage += `\n${entry.trace}`;
    }
    
    return logMessage;
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formattedLog = this.formatLog(entry);
    
    // In production, you would send logs to external service
    // For now, we'll use console with appropriate methods
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      default:
        console.log(formattedLog);
    }

    // Store in database for audit trail (implement as needed)
    this.storeLogEntry(entry);
  }

  private async storeLogEntry(entry: LogEntry): Promise<void> {
    // TODO: Implement database storage for audit logs
    // This would typically store in a logs table for audit purposes
  }

  log(message: string, context?: string, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      context,
      metadata,
    });
  }

  error(message: string, trace?: string, context?: string, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      context,
      trace,
      metadata,
    });
  }

  warn(message: string, context?: string, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      context,
      metadata,
    });
  }

  debug(message: string, context?: string, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      context,
      metadata,
    });
  }

  verbose(message: string, context?: string): void {
    this.debug(message, context);
  }

  // Enhanced logging methods
  logUserAction(userId: string, action: string, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.INFO,
      message: `User action: ${action}`,
      timestamp: new Date(),
      context: 'UserAction',
      userId,
      metadata,
    });
  }

  logApiRequest(method: string, url: string, userId?: string, requestId?: string, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.INFO,
      message: `API Request: ${method} ${url}`,
      timestamp: new Date(),
      context: 'API',
      userId,
      requestId,
      metadata,
    });
  }

  logSecurityEvent(event: string, userId?: string, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.WARN,
      message: `Security event: ${event}`,
      timestamp: new Date(),
      context: 'Security',
      userId,
      metadata,
    });
  }

  logPerformance(operation: string, duration: number, metadata?: Record<string, any>): void {
    this.writeLog({
      level: LogLevel.INFO,
      message: `Performance: ${operation} took ${duration}ms`,
      timestamp: new Date(),
      context: 'Performance',
      metadata,
    });
  }
}