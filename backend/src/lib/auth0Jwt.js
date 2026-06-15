import crypto from 'crypto';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN, AUTH0_ISSUER } from '../config/env.js';

const encoder = new TextEncoder();
const keyCache = new Map();

const toBase64 = (value) => value.replace(/-/g, '+').replace(/_/g, '/');

const decodeBase64Url = (value) => {
  const padded = value.padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Buffer.from(toBase64(padded), 'base64');
};

const parseToken = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token JWT inválido.');
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = JSON.parse(decodeBase64Url(headerPart).toString('utf8'));
  const payload = JSON.parse(decodeBaseUrl(payloadPart));

  return {
    header,
    payload,
    signature: decodeBase64Url(signaturePart),
    signingInput: encoder.encode(`${headerPart}.${payloadPart}`),
  };
};

const decodeBaseUrl = (value) => decodeBase64Url(value).toString('utf8');

const loadKey = async (kid) => {
  if (!AUTH0_DOMAIN) {
    throw new Error('Falta AUTH0_DOMAIN en variables de entorno del backend.');
  }

  if (keyCache.has(kid)) {
    return keyCache.get(kid);
  }

  const response = await fetch(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`);
  if (!response.ok) {
    throw new Error('No fue posible descargar el JWKS de Auth0.');
  }

  const { keys = [] } = await response.json();
  const jwk = keys.find((candidate) => candidate.kid === kid);

  if (!jwk) {
    throw new Error('No se encontró una llave pública válida para el token.');
  }

  const publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  keyCache.set(kid, publicKey);

  return publicKey;
};

const validateClaims = (payload) => {
  const now = Math.floor(Date.now() / 1000);

  if (!payload.exp || payload.exp <= now) {
    throw new Error('El token está expirado.');
  }

  if (payload.nbf && payload.nbf > now) {
    throw new Error('El token todavía no es válido.');
  }

  if (!AUTH0_ISSUER || payload.iss !== AUTH0_ISSUER) {
    throw new Error('Issuer de token inválido.');
  }

  if (!AUTH0_AUDIENCE) {
    throw new Error('Falta AUTH0_AUDIENCE en variables de entorno del backend.');
  }

  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(AUTH0_AUDIENCE)) {
    throw new Error('Audience de token inválido.');
  }
};

export const verifyAuth0Token = async (token) => {
  const { header, payload, signature, signingInput } = parseToken(token);

  if (header.alg !== 'RS256' || !header.kid) {
    throw new Error('Algoritmo JWT no soportado.');
  }

  const key = await loadKey(header.kid);

  const verified = crypto.verify('RSA-SHA256', signingInput, key, signature);
  if (!verified) {
    throw new Error('Firma de token inválida.');
  }

  validateClaims(payload);

  return payload;
};
