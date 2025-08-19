# Google OAuth Setup Guide for SU Curries

## Overview
This guide will help you set up Google OAuth authentication for the SU Curries restaurant management system.

## Prerequisites
- Google Cloud Console account
- SU Curries project running locally

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: `SU Curries`
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email addresses for testing)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Configure:
   - Name: `SU Curries Web Client`
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3001/auth/google/callback`

## Step 4: Update Environment Variables

### Backend (.env)
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

### Frontend (.env.development)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=your_actual_google_client_id
```

## Step 5: Test the Integration

1. Start both backend and frontend servers
2. Navigate to the login page
3. Click "Continue with Google"
4. Complete the OAuth flow
5. Verify successful login and redirection

## Features Added

### Backend Features
- Google OAuth strategy using Passport.js
- Automatic user creation for new Google users
- JWT token generation for authenticated users
- Secure callback handling

### Frontend Features
- Google login button component
- OAuth success page for handling callbacks
- Seamless integration with existing auth system
- Automatic redirection based on user role

## Security Considerations

1. **Environment Variables**: Never commit actual credentials to version control
2. **HTTPS in Production**: Use HTTPS URLs for production deployment
3. **Token Validation**: JWT tokens are validated on each request
4. **User Data**: Only necessary user data is stored from Google profile

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure callback URL in Google Console matches backend configuration
   - Check for trailing slashes and exact URL matching

2. **Client ID Not Found**
   - Verify environment variables are loaded correctly
   - Check for typos in client ID

3. **Scope Permissions**
   - Ensure email and profile scopes are requested
   - Check OAuth consent screen configuration

### Testing Tips

1. Use incognito/private browsing for testing
2. Clear browser cache if experiencing issues
3. Check browser developer tools for network errors
4. Verify backend logs for authentication errors

## Production Deployment

For production deployment:

1. Update redirect URIs to production URLs
2. Use environment-specific configuration
3. Enable HTTPS for all OAuth endpoints
4. Consider implementing refresh token rotation
5. Add proper error handling and logging

## API Endpoints

### New Google OAuth Endpoints

- `GET /auth/google` - Initiates Google OAuth flow
- `GET /auth/google/callback` - Handles OAuth callback
- `GET /auth/google/success` - Frontend success page

### Existing Endpoints (still available)

- `POST /auth/login` - Traditional email/password login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

## User Experience

1. Users can choose between traditional login or Google OAuth
2. New Google users are automatically registered
3. Existing users can link Google accounts (future enhancement)
4. Seamless redirection based on user role (admin/customer)

## Next Steps

Consider implementing:
1. Account linking for existing users
2. Multiple OAuth providers (Facebook, Apple)
3. Two-factor authentication
4. Social login analytics
5. User preference management

---

**Note**: This implementation provides a secure and user-friendly Google OAuth integration that enhances the existing authentication system without breaking current functionality.