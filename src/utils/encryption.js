import CryptoJS from 'crypto-js';
import config from '../config/config';

const SECRET_KEY = config.JWT_SECRET;

export const encryptData = (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};