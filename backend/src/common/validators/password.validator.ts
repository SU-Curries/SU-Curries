import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // At least 8 characters
          if (value.length < 8) return false;
          
          // At least one uppercase letter
          if (!/[A-Z]/.test(value)) return false;
          
          // At least one lowercase letter
          if (!/[a-z]/.test(value)) return false;
          
          // At least one number
          if (!/\d/.test(value)) return false;
          
          // At least one special character
          if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return false;
          
          // No common passwords
          const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', 'monkey'
          ];
          if (commonPasswords.includes(value.toLowerCase())) return false;
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        },
      },
    });
  };
}