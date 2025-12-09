/**
 * Mock data for testing
 * بيانات وهمية للاختبار
 */

// Mock User Data
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  avatar: 'https://example.com/avatar.jpg',
};

// Mock Product Data
export const mockProduct = {
  id: 1,
  name: 'Test Product',
  title: 'Test Product Title',
  description: 'Test Product Description',
  price: 10.99,
  base_price: 10.99,
  image: 'https://example.com/product.jpg',
  image_url: 'https://example.com/product.jpg',
  has_sizes: true,
  has_option_groups: false,
  sizes: [
    { id: 1, name: 'Small', price: 8.99 },
    { id: 2, name: 'Large', price: 12.99 },
  ],
  ingredients: [
    { id: 1, name: 'Ingredient 1', price: 1.50 },
    { id: 2, name: 'Ingredient 2', price: 2.00 },
  ],
  option_groups: [],
};

// Mock Product with Option Groups
export const mockProductWithOptions = {
  ...mockProduct,
  id: 2,
  has_option_groups: true,
  option_groups: [
    {
      id: 1,
      name: 'Toppings',
      is_required: true,
      min_selection: 1,
      max_selection: 3,
      options: [
        { id: 1, name: 'Option 1', price: 1.00 },
        { id: 2, name: 'Option 2', price: 1.50 },
      ],
    },
  ],
};

// Mock Cart Item
export const mockCartItem = {
  id: 1,
  name: 'Test Product',
  price: 10.99,
  quantity: 1,
  image: 'https://example.com/product.jpg',
  size_id: 1,
  size_name: 'Small',
  ingredients: [],
  selected_options: null,
};

// Mock Branch Data
export const mockBranch = {
  id: 1,
  name: 'Test Branch',
  address: '123 Test Street',
  city: 'Test City',
  country: 'Test Country',
  latitude: 40.7128,
  longitude: -74.0060,
  phone: '+1234567890',
  email: 'branch@example.com',
};

// Mock Order Data
export const mockOrder = {
  id: 1,
  order_number: 'ORD-001',
  status: 'pending',
  total: 25.99,
  items: [mockCartItem],
  created_at: '2024-01-01T00:00:00Z',
};

// Mock API Responses
export const mockAuthResponse = {
  success: true,
  data: {
    user: mockUser,
    token: 'mock-jwt-token',
  },
};

export const mockMenuResponse = {
  success: true,
  data: {
    menu_items: [mockProduct],
  },
};

export const mockBranchesResponse = {
  success: true,
  data: {
    branches: [mockBranch],
  },
};

export const mockOrderResponse = {
  success: true,
  data: {
    order: mockOrder,
  },
};

// Mock Error Response
export const mockErrorResponse = {
  success: false,
  message: 'Test error message',
  errors: {
    email: ['Email is required'],
  },
};

