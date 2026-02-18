const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const redirectUri =
  import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin;

const stateKey = 'auth0_state';
const verifierKey = 'auth0_code_verifier';

const asBase64Url = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const generateRandomString = (length = 64) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) => charset[value % charset.length]).join('');
};

const ensureConfig = () => {
  const missing = [
    !domain && 'VITE_AUTH0_DOMAIN',
    !clientId && 'VITE_AUTH0_CLIENT_ID',
    !audience && 'VITE_AUTH0_AUDIENCE',
  ].filter(Boolean);

  if (missing.length) {
    throw new Error(`Faltan variables Auth0 en frontend: ${missing.join(', ')}`);
  }
};

const createCodeChallenge = async (verifier) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return asBase64Url(digest);
};

export const loginWithRedirect = async () => {
  ensureConfig();

  const verifier = generateRandomString(96);
  const challenge = await createCodeChallenge(verifier);
  const state = generateRandomString(32);

  sessionStorage.setItem(verifierKey, verifier);
  sessionStorage.setItem(stateKey, state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    audience,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
  });

  window.location.assign(`https://${domain}/authorize?${params.toString()}`);
};

export const exchangeCodeForToken = async (code, incomingState) => {
  ensureConfig();

  const savedState = sessionStorage.getItem(stateKey);
  const verifier = sessionStorage.getItem(verifierKey);

  if (!savedState || incomingState !== savedState || !verifier) {
    throw new Error('No se pudo validar el estado de autenticación (state/PKCE).');
  }

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al intercambiar el código de Auth0 por tokens.');
  }

  sessionStorage.removeItem(stateKey);
  sessionStorage.removeItem(verifierKey);

  return response.json();
};

export const logoutWithRedirect = () => {
  ensureConfig();

  const params = new URLSearchParams({
    client_id: clientId,
    returnTo: window.location.origin,
  });

  window.location.assign(`https://${domain}/v2/logout?${params.toString()}`);
};

export const parseJwtPayload = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');

  try {
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};
