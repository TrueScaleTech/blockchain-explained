import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  generateKeyPair,
  importPublicKeyHex,
  publicKeyHex,
  sign,
  verify,
} from '../src/lib/signature.ts';

// RFC 6979, appendix A.2.5: the P-256 key and the signature of "sample" with SHA-256.
// ECDSA signatures are random, so only a published signature can pin down the exact algorithm.
const RFC6979_PUBLIC_KEY =
  '04' +
  '60fed4ba255a9d31c961eb74c6356d68c049b8923b61fa6ce669622e60f29fb6' +
  '7903fe1008b8bc99a41ae9e95628bc64f2f1b20c2d7e9f5177a3c294d4462299';
const RFC6979_SIGNATURE =
  'efd48b2aacb6a8fd1140dd9cd45e81d69d2c877b56aaf991c34d0ea84eaf3716' +
  'f7cb1c942d657c41d436c7a1b6e29f65f3e900dbb9aff4064dc4ab2f843acda8';

test('verifies the published RFC 6979 signature of "sample"', async () => {
  const publicKey = await importPublicKeyHex(RFC6979_PUBLIC_KEY);
  assert.equal(await publicKeyHex(publicKey), RFC6979_PUBLIC_KEY);
  assert.ok(await verify(publicKey, 'sample', RFC6979_SIGNATURE));
  assert.ok(!(await verify(publicKey, 'test', RFC6979_SIGNATURE)));
});

test('a signature verifies with the matching public key', async () => {
  const { privateKey, publicKey } = await generateKeyPair();
  const signature = await sign(privateKey, 'Pay Bob 5');
  assert.match(signature, /^[0-9a-f]{128}$/);
  assert.ok(await verify(publicKey, 'Pay Bob 5', signature));
});

test('a changed message fails verification', async () => {
  const { privateKey, publicKey } = await generateKeyPair();
  const signature = await sign(privateKey, 'Pay Bob 5');
  assert.ok(!(await verify(publicKey, 'Pay Bob 50', signature)));
});

test('another key fails verification', async () => {
  const alice = await generateKeyPair();
  const mallory = await generateKeyPair();
  const signature = await sign(alice.privateKey, 'Pay Bob 5');
  assert.ok(!(await verify(mallory.publicKey, 'Pay Bob 5', signature)));
});

test('a changed or malformed signature fails verification', async () => {
  const { privateKey, publicKey } = await generateKeyPair();
  const signature = await sign(privateKey, 'Pay Bob 5');
  const flipped = (signature[0] === '0' ? '1' : '0') + signature.slice(1);
  assert.ok(!(await verify(publicKey, 'Pay Bob 5', flipped)));
  assert.ok(!(await verify(publicKey, 'Pay Bob 5', 'not hex')));
});

test('the public key is exported, the private key cannot be', async () => {
  const { privateKey, publicKey } = await generateKeyPair();
  assert.match(await publicKeyHex(publicKey), /^04[0-9a-f]{128}$/);
  await assert.rejects(globalThis.crypto.subtle.exportKey('pkcs8', privateKey));
});
