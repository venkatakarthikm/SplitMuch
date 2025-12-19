const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET || 'your_frontend_encryption_key',
  TOKEN_KEY: 'expense_app_token',
  USER_KEY: 'expense_app_user',
};

export default config;