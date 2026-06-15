import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const keyLength = 64;

export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, keyLength);

  return {
    passwordHash: derivedKey.toString('hex'),
    passwordSalt: salt,
  };
};

export const verifyPassword = async (password, passwordHash, passwordSalt) => {
  const derivedKey = await scrypt(password, passwordSalt, keyLength);
  const storedKey = Buffer.from(passwordHash, 'hex');

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
};
