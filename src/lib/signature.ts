// Digital signatures with the platform's Web Crypto: ECDSA on the P-256 curve with SHA-256.
// Bitcoin and Ethereum use the secp256k1 curve, which Web Crypto does not offer; the idea is the
// same. Keys are created in memory for the demo, the private key cannot be exported, and nothing
// is stored or sent anywhere.

import { fromHex, toHex, utf8 } from './sha256.ts';

const ALGORITHM = { name: 'ECDSA', namedCurve: 'P-256' } as const;
const SIGN_PARAMS = { name: 'ECDSA', hash: 'SHA-256' } as const;

export function generateKeyPair(): Promise<CryptoKeyPair> {
  // extractable: false keeps the private key inside the crypto engine; the public key can
  // always be exported.
  return globalThis.crypto.subtle.generateKey(ALGORITHM, false, ['sign', 'verify']);
}

/** The public key in uncompressed form (04 || x || y), 130 hex characters. */
export async function publicKeyHex(publicKey: CryptoKey): Promise<string> {
  return toHex(new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', publicKey)));
}

/** Imports a public key from its uncompressed hex form, so a signature can be checked by anyone. */
export function importPublicKeyHex(hex: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey('raw', fromHex(hex), ALGORITHM, true, ['verify']);
}

/** The signature as r || s, 128 hex characters. */
export async function sign(privateKey: CryptoKey, message: string): Promise<string> {
  return toHex(
    new Uint8Array(await globalThis.crypto.subtle.sign(SIGN_PARAMS, privateKey, utf8(message))),
  );
}

export async function verify(
  publicKey: CryptoKey,
  message: string,
  signatureHex: string,
): Promise<boolean> {
  let signature: Uint8Array<ArrayBuffer>;
  try {
    signature = fromHex(signatureHex);
  } catch {
    return false;
  }
  return globalThis.crypto.subtle.verify(SIGN_PARAMS, publicKey, signature, utf8(message));
}
