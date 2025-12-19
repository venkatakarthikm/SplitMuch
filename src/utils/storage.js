import { encryptData, decryptData } from './encryption';
import config from '../config/config';

export const saveToken = (token) => {
  const encrypted = encryptData(token);
  localStorage.setItem(config.TOKEN_KEY, encrypted);
  
  // Also save in cookie
  document.cookie = `${config.TOKEN_KEY}=${encrypted}; max-age=${6 * 60 * 60}; path=/; secure; samesite=strict`;
};

export const getToken = () => {
  const encrypted = localStorage.getItem(config.TOKEN_KEY);
  return decryptData(encrypted);
};

export const saveUser = (user) => {
  const encrypted = encryptData(user);
  localStorage.setItem(config.USER_KEY, encrypted);
};

export const getUser = () => {
  const encrypted = localStorage.getItem(config.USER_KEY);
  return decryptData(encrypted);
};

export const clearStorage = () => {
  localStorage.removeItem(config.TOKEN_KEY);
  localStorage.removeItem(config.USER_KEY);
  document.cookie = `${config.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};