# Shopify Customer Account Integration

This guide shows how to implement secure customer account integration using Shopify's Storefront API (GraphQL) with `customerAccessToken` authentication.

## Features

- ✅ Customer signup and login forms
- ✅ Secure authentication with `customerAccessToken`
- ✅ Customer profile management
- ✅ Order history viewing
- ✅ Address management
- ✅ Password reset functionality
- ✅ Token renewal and session management
- ✅ TypeScript support

## Files Created

1. **`src/lib/shopifyCustomerAPI.ts`** - Core API service with GraphQL queries
2. **`src/components/CustomerAuthForms.tsx`** - Login, signup, and password reset forms
3. **`src/components/CustomerProfile.tsx`** - Customer profile management component
4. **`src/hooks/useCustomerAuth.ts`** - React hook for authentication state
5. **`src/pages/CustomerAccount.tsx`** - Complete customer account page

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
VITE_SHOPIFY_API_VERSION=2024-01
```

### 2. Install Required Dependencies

```bash
npm install @tanstack/react-query
```

### 3. Update Your ShopifyService

Make sure your `ShopifyService` has the `executeQuery` method:

```typescript
// In src/lib/shopifyService.ts
export class ShopifyService {
  static async executeQuery(query: string, variables: any = {}) {
    const response = await fetch('/api/shopify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}
```

## Usage Examples

### Basic Authentication

```typescript
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

function MyComponent() {
  const { 
    customer, 
    loading, 
    isLoggedIn, 
    login, 
    logout, 
    signup 
  } = useCustomerAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result.success) {
      console.log('Logged in successfully');
    }
  };

  const handleSignup = async () => {
    const result = await signup({
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      acceptsMarketing: true
    });
  };

  if (loading) return <div>Loading...</div>;
  
  if (!isLoggedIn) {
    return <button onClick={handleLogin}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {customer?.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using the Auth Forms Component

```typescript
import { CustomerAuthForms } from '@/components/CustomerAuthForms';

function LoginPage() {
  const handleAuthSuccess = (customer: any) => {
    console.log('Customer logged in:', customer);
    // Redirect or update UI
  };

  return (
    <CustomerAuthForms 
      onSuccess={handleAuthSuccess}
      onClose={() => console.log('Modal closed')}
    />
  );
}
```

### Using the Profile Component

```typescript
import { CustomerProfile } from '@/components/CustomerProfile';

function ProfilePage() {
  const handleLogout = () => {
    // Handle logout
  };

  return (
    <CustomerProfile 
      onLogout={handleLogout}
      onOrdersClick={() => console.log('View orders')}
      onWishlistClick={() => console.log('View wishlist')}
    />
  );
}
```

## GraphQL Queries Used

### Customer Login
```graphql
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      field
      message
    }
  }
}
```

### Customer Signup
```graphql
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
    }
    customerUserErrors {
      field
      message
    }
  }
}
```

### Get Customer Profile
```graphql
query customer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    firstName
    lastName
    phone
    acceptsMarketing
    createdAt
    defaultAddress {
      id
      firstName
      lastName
      address1
      city
      province
      country
      zip
      phone
    }
  }
}
```

### Update Customer Profile
```graphql
mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
  customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
    customer {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
    }
    customerUserErrors {
      field
      message
    }
  }
}
```

## Security Features

### 1. Secure Token Storage
- Tokens are stored in `localStorage` with expiry checking
- Automatic token renewal when expired
- Secure logout with token deletion

### 2. Input Validation
- Email format validation
- Password strength requirements
- Form validation before submission

### 3. Error Handling
- Comprehensive error messages
- Graceful fallbacks for network issues
- User-friendly error display

### 4. Session Management
- Automatic token renewal
- Session persistence across page reloads
- Secure logout functionality

## Integration with Existing App

### 1. Add Route
```typescript
// In App.tsx
import CustomerAccount from './pages/CustomerAccount';

<Route path="/customer-account" element={<CustomerAccount />} />
```

### 2. Update Header Component
```typescript
// Add customer account link to header
<Link to="/customer-account">
  <User className="w-5 h-5" />
  My Account
</Link>
```

### 3. Protect Routes
```typescript
// Create protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useCustomerAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  
  return <>{children}</>;
}
```

## Testing

### 1. Test Customer Signup
```typescript
const result = await ShopifyCustomerAPI.signup({
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
});
```

### 2. Test Customer Login
```typescript
const result = await ShopifyCustomerAPI.login('test@example.com', 'password123');
```

### 3. Test Profile Update
```typescript
const result = await ShopifyCustomerAPI.updateProfile({
  firstName: 'Updated Name',
  phone: '+1234567890'
});
```

## Troubleshooting

### Common Issues

1. **"No access token found"**
   - Ensure customer is logged in
   - Check if token has expired
   - Verify token storage in localStorage

2. **"Invalid credentials"**
   - Check email/password format
   - Verify customer exists in Shopify
   - Check Storefront API permissions

3. **"Network error"**
   - Verify backend server is running
   - Check API endpoint configuration
   - Ensure CORS is properly configured

### Debug Mode

Enable debug logging:
```typescript
// Add to your component
useEffect(() => {
  console.log('Customer auth state:', { customer, isLoggedIn, loading });
}, [customer, isLoggedIn, loading]);
```

## Best Practices

1. **Always validate input** on both client and server
2. **Handle errors gracefully** with user-friendly messages
3. **Implement proper loading states** for better UX
4. **Use TypeScript** for type safety
5. **Test thoroughly** with different scenarios
6. **Follow Shopify's rate limits** and best practices
7. **Keep tokens secure** and implement proper logout

## Next Steps

1. **Add address management** functionality
2. **Implement order tracking** features
3. **Add wishlist management** with Shopify
4. **Create admin panel** for customer management
5. **Add email notifications** for account events
6. **Implement two-factor authentication** if needed

This integration provides a complete, secure, and user-friendly customer account system using Shopify's Storefront API with proper authentication and session management.
