import { 
  shopifyClient, 
  GET_PRODUCTS_QUERY, 
  GET_PRODUCT_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  CART_SET_BUYER_IDENTITY_MUTATION
} from './shopify';

// Types for Shopify data
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice: {
          amount: string;
          currencyCode: string;
        } | null;
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        image: {
          id: string;
          url: string;
          altText: string | null;
          width: number;
          height: number;
        } | null;
      };
    }>;
  };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount: {
      amount: string;
      currencyCode: string;
    } | null;
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        cost: {
          totalAmount: {
            amount: string;
            currencyCode: string;
          };
        };
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          product: {
            id: string;
            title: string;
            handle: string;
            images: {
              edges: Array<{
                node: {
                  id: string;
                  url: string;
                  altText: string | null;
                };
              }>;
            };
          };
        };
      };
    }>;
  };
}

export interface ShopifyError {
  field: string[];
  message: string;
}

// Service class for Shopify operations
export class ShopifyService {
  // Get products with pagination
  static async getProducts(first: number = 20, after?: string) {
    try {
      const response = await shopifyClient.request(GET_PRODUCTS_QUERY, {
        variables: { first, after }
      });
      
      if (response.data?.products) {
        return {
          products: response.data.products.edges.map(edge => edge.node),
          pageInfo: response.data.products.pageInfo
        };
      }
      
      throw new Error('No products found');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by handle
  static async getProduct(handle: string) {
    try {
      const response = await shopifyClient.request(GET_PRODUCT_QUERY, {
        variables: { handle }
      });
      
      if (response.data?.product) {
        return response.data.product;
      }
      
      throw new Error('Product not found');
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create a new cart
  static async createCart(lines?: Array<{ merchandiseId: string; quantity: number }>) {
    try {
      const response = await shopifyClient.request(CREATE_CART_MUTATION, {
        variables: { 
          input: { 
            lines: lines || []
          }
        }
      });
      
      if (response.data?.cartCreate?.cart) {
        return response.data.cartCreate.cart;
      }
      
      if (response.data?.cartCreate?.userErrors?.length > 0) {
        throw new Error(response.data.cartCreate.userErrors[0].message);
      }
      
      throw new Error('Failed to create cart');
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  // Add items to cart
  static async addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
    try {
      const response = await shopifyClient.request(ADD_TO_CART_MUTATION, {
        variables: { 
          cartId,
          lines
        }
      });
      
      if (response.data?.cartLinesAdd?.cart) {
        return response.data.cartLinesAdd.cart;
      }
      
      if (response.data?.cartLinesAdd?.userErrors?.length > 0) {
        throw new Error(response.data.cartLinesAdd.userErrors[0].message);
      }
      
      throw new Error('Failed to add to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Update cart items
  static async updateCart(cartId: string, lines: Array<{ id: string; quantity: number }>) {
    try {
      const response = await shopifyClient.request(UPDATE_CART_MUTATION, {
        variables: { 
          cartId,
          lines
        }
      });
      
      if (response.data?.cartLinesUpdate?.cart) {
        return response.data.cartLinesUpdate.cart;
      }
      
      if (response.data?.cartLinesUpdate?.userErrors?.length > 0) {
        throw new Error(response.data.cartLinesUpdate.userErrors[0].message);
      }
      
      throw new Error('Failed to update cart');
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  // Remove items from cart
  static async removeFromCart(cartId: string, lineIds: string[]) {
    try {
      const response = await shopifyClient.request(REMOVE_FROM_CART_MUTATION, {
        variables: { 
          cartId,
          lineIds
        }
      });
      
      if (response.data?.cartLinesRemove?.cart) {
        return response.data.cartLinesRemove.cart;
      }
      
      if (response.data?.cartLinesRemove?.userErrors?.length > 0) {
        throw new Error(response.data.cartLinesRemove.userErrors[0].message);
      }
      
      throw new Error('Failed to remove from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Attach customer to cart so orders are linked to their account
  static async attachCustomerToCart(cartId: string) {
    try {
      // Call via backend proxy so it injects the customerAccessToken from session
      const resp = await fetch('/api/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: CART_SET_BUYER_IDENTITY_MUTATION,
          variables: {
            cartId,
            input: {}
          }
        })
      });
      if (!resp.ok) throw new Error('Failed to attach customer to cart');
      const data = await resp.json();
      const userErrors = data?.data?.cartBuyerIdentityUpdate?.userErrors;
      if (userErrors && userErrors.length) throw new Error(userErrors[0].message);
      return data?.data?.cartBuyerIdentityUpdate?.cart;
    } catch (error) {
      console.error('Error attaching customer to cart:', error);
      // Non-fatal: proceed without attachment
      return null;
    }
  }

  // Helper function to convert Shopify product to our Product type
  static convertToProduct(shopifyProduct: ShopifyProduct) {
    const variant = shopifyProduct.variants.edges[0]?.node;
    if (!variant) {
      throw new Error('Product has no variants');
    }

    const image = shopifyProduct.images.edges[0]?.node;
    // Collect all unique image URLs from product and variants
    const imageUrlSet = new Set<string>();
    for (const edge of shopifyProduct.images.edges) {
      const url = edge?.node?.url;
      if (url) imageUrlSet.add(url);
    }
    for (const vEdge of shopifyProduct.variants.edges) {
      const vUrl = vEdge?.node?.image?.url;
      if (vUrl) imageUrlSet.add(vUrl);
    }
    const allImages = Array.from(imageUrlSet);
    
    return {
      id: shopifyProduct.id.split('/').pop() || shopifyProduct.id, // Use the numeric part or full ID
      name: shopifyProduct.title,
      category: shopifyProduct.productType.toUpperCase(),
      price: parseFloat(variant.price.amount),
      originalPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
      rating: 4.5, // Default rating since Shopify doesn't provide this
      reviewCount: 0, // Default review count
      image: image?.url || '/placeholder.svg',
      images: allImages,
      badges: shopifyProduct.tags.slice(0, 3), // Use tags as badges
      tags: shopifyProduct.tags,
      handle: shopifyProduct.handle,
      description: shopifyProduct.description,
      variants: shopifyProduct.variants.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        price: parseFloat(edge.node.price.amount),
        availableForSale: edge.node.availableForSale,
        image: edge.node.image?.url || image?.url || '/placeholder.svg'
      }))
    };
  }
}
