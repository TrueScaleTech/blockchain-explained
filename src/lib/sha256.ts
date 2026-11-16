// SHA-256 through the platform's Web Crypto (the browser's, or Node's in the tests).
// No DOM, no third-party code: these helpers are pure apart from the hashing itself.

const encoder = new TextEncoder();

export function utf8(text: string): Uint8Array<ArrayBuffer> {
  return encoder.encode(text);
}

export function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const byte of bytes) out += byte.toString(16).padStart(2, '0');
  return out;
}

export function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  if (hex.length % 2 !== 0 || !/^[0-9a-f]*$/i.test(hex)) {
    throw new Error(`not a hex string: ${hex}`);
  }
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

export async function sha256Bytes(data: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', data));
}

/** SHA-256 of the UTF-8 bytes of a text, as 64 lowercase hex characters. */
export async function sha256Hex(text: string): Promise<string> {
  return toHex(await sha256Bytes(utf8(text)));
}

/** For each hex character position, whether the two digests differ there. */
export function changedHexPositions(a: string, b: string): boolean[] {
  if (a.length !== b.length) throw new Error('digests must have the same length');
  return [...a].map((char, i) => char !== b[i]);
}

/** How many of the bits differ between two hex digests of the same length (the avalanche effect). */
export function differingBits(a: string, b: string): number {
  const x = fromHex(a);
  const y = fromHex(b);
  if (x.length !== y.length) throw new Error('digests must have the same length');
  let count = 0;
  for (let i = 0; i < x.length; i++) {
    let v = x[i]! ^ y[i]!;
    while (v) {
      count += v & 1;
      v >>= 1;
    }
  }
  return count;
}
