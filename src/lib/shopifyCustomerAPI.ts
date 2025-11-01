// Shopify Storefront API Customer Integration
// This file contains all GraphQL mutations and queries for customer account management

import { ShopifyService } from './shopifyService';

// GraphQL Queries and Mutations
export const CUSTOMER_QUERIES = {
  // Customer login mutation
  CUSTOMER_ACCESS_TOKEN_CREATE: `
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
  `,

  // Customer signup mutation
  CUSTOMER_CREATE: `
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
  `,

  // Get customer profile
  CUSTOMER: `
    query customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        createdAt
        updatedAt
        defaultAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              company
              address1
              address2
              city
              province
              country
              zip
              phone
            }
          }
        }
      }
    }
  `,

  // Update customer profile
  CUSTOMER_UPDATE: `
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
  `,

  // Get customer orders
  CUSTOMER_ORDERS: `
    query customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: 20) {
          edges {
            node {
              id
              orderNumber
              processedAt
              totalPrice {
                amount
                currencyCode
              }
              fulfillmentStatus
              financialStatus
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      title
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  // Customer access token renewal
  CUSTOMER_ACCESS_TOKEN_RENEW: `
    mutation customerAccessTokenRenew($customerAccessToken: String!) {
      customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // Customer logout
  CUSTOMER_ACCESS_TOKEN_DELETE: `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `,

  // Password reset request
  CUSTOMER_RECOVER: `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
        }
      }
    }
  `,

  // Reset password
  CUSTOMER_RESET_BY_URL: `
    mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
      customerResetByUrl(resetUrl: $resetUrl, password: $password) {
        customer {
          id
          email
          firstName
          lastName
        }
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
  `
};

// Customer API Service Class
export class ShopifyCustomerAPI {
  private static readonly STORAGE_KEY = 'shopify_customer_token';
  private static readonly TOKEN_EXPIRY_KEY = 'shopify_customer_token_expiry';

  /**
   * Store customer access token securely
   */
  private static storeToken(token: string, expiresAt: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiresAt);
  }

  /**
   * Get stored customer access token
   */
  private static getStoredToken(): string | null {
    const token = localStorage.getItem(this.STORAGE_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) return null;
    
    // Check if token is expired
    if (new Date(expiry) <= new Date()) {
      this.clearToken();
      return null;
    }
    
    return token;
  }

  /**
   * Clear stored token
   */
  private static clearToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Check if customer is logged in
   */
  static isLoggedIn(): boolean {
    return this.getStoredToken() !== null;
  }

  /**
   * Customer Signup
   */
  static async signup(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }) {
    try {
      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER_CREATE,
          variables: {
            input: {
              email: input.email,
              password: input.password,
              firstName: input.firstName,
              lastName: input.lastName,
              phone: input.phone,
              acceptsMarketing: input.acceptsMarketing || false
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create customer account');
      }

      const data = await response.json();

      if (data.data?.customerCreate?.customerUserErrors?.length > 0) {
        throw new Error(data.data.customerCreate.customerUserErrors[0].message);
      }

      return {
        success: true,
        customer: data.data?.customerCreate?.customer
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed'
      };
    }
  }

  /**
   * Customer Login
   */
  static async login(email: string, password: string) {
    try {
      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER_ACCESS_TOKEN_CREATE,
          variables: {
            input: {
              email,
              password
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();

      if (data.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
        throw new Error(data.data.customerAccessTokenCreate.customerUserErrors[0].message);
      }

      const { accessToken, expiresAt } = data.data?.customerAccessTokenCreate?.customerAccessToken || {};
      
      if (accessToken) {
        this.storeToken(accessToken, expiresAt);
        
        // Get customer profile after login
        const profile = await this.getProfile();
        
        return {
          success: true,
          customer: profile.customer,
          accessToken
        };
      }

      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  /**
   * Get Customer Profile
   */
  static async getProfile() {
    try {
      const token = this.getStoredToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER,
          variables: {
            customerAccessToken: token
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get customer profile');
      }

      const data = await response.json();

      return {
        success: true,
        customer: data.data?.customer
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile'
      };
    }
  }

  /**
   * Update Customer Profile
   */
  static async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }) {
    try {
      const token = this.getStoredToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER_UPDATE,
          variables: {
            customerAccessToken: token,
            customer: updates
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update customer profile');
      }

      const data = await response.json();

      if (data.data?.customerUpdate?.customerUserErrors?.length > 0) {
        throw new Error(data.data.customerUpdate.customerUserErrors[0].message);
      }

      return {
        success: true,
        customer: data.data?.customerUpdate?.customer
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }

  /**
   * Get Customer Orders
   */
  static async getOrders() {
    try {
      const token = this.getStoredToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER_ORDERS,
          variables: {
            customerAccessToken: token
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get customer orders');
      }

      const data = await response.json();

      return {
        success: true,
        orders: data.data?.customer?.orders?.edges?.map((edge: any) => edge.node) || []
      };
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get orders'
      };
    }
  }

  /**
   * Request Password Reset
   */
  static async requestPasswordReset(email: string) {
    try {
      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER_RECOVER,
          variables: {
            email
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to request password reset');
      }

      const data = await response.json();

      if (data.data?.customerRecover?.customerUserErrors?.length > 0) {
        throw new Error(data.data.customerRecover.customerUserErrors[0].message);
      }

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send password reset'
      };
    }
  }

  /**
   * Reset Password
   */
  static async resetPassword(resetUrl: string, newPassword: string) {
    try {
      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER_RESET_BY_URL,
          variables: {
            resetUrl,
            password: newPassword
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const data = await response.json();

      if (data.data?.customerResetByUrl?.customerUserErrors?.length > 0) {
        throw new Error(data.data.customerResetByUrl.customerUserErrors[0].message);
      }

      const { customer, customerAccessToken } = data.data?.customerResetByUrl || {};
      
      if (customerAccessToken) {
        this.storeToken(customerAccessToken.accessToken, customerAccessToken.expiresAt);
      }

      return {
        success: true,
        customer,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset password'
      };
    }
  }

  /**
   * Renew Access Token
   */
  static async renewToken() {
    try {
      const token = this.getStoredToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CUSTOMER_QUERIES.CUSTOMER_ACCESS_TOKEN_RENEW,
          variables: {
            customerAccessToken: token
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to renew token');
      }

      const data = await response.json();

      if (data.data?.customerAccessTokenRenew?.userErrors?.length > 0) {
        throw new Error(data.data.customerAccessTokenRenew.userErrors[0].message);
      }

      const { accessToken, expiresAt } = data.data?.customerAccessTokenRenew?.customerAccessToken || {};
      
      if (accessToken) {
        this.storeToken(accessToken, expiresAt);
        return { success: true };
      }

      throw new Error('Token renewal failed');
    } catch (error) {
      console.error('Token renewal error:', error);
      this.logout();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token renewal failed'
      };
    }
  }

  /**
   * Customer Logout
   */
  static async logout() {
    try {
      const token = this.getStoredToken();
      if (token) {
        await fetch('/api/shopify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            query: CUSTOMER_QUERIES.CUSTOMER_ACCESS_TOKEN_DELETE,
            variables: {
              customerAccessToken: token
            }
          })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }
}
