export class RSAOAEP {
  #cryptoKeyPair?: CryptoKeyPair;

  private async initCryptKey() {
    this.#cryptoKeyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",

        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
          name: "SHA-256",
        },
      },
      true,
      ["encrypt", "decrypt"],
    );
  }
  getPublickey(format: "jwk" | "pkcs8" | "spki" = "spki") {
    return crypto.subtle.exportKey(format, this.#cryptoKeyPair!.publicKey);
  }
  get publicKey() {
    return this.#cryptoKeyPair?.publicKey;
  }
  async encrypt(data: ArrayBuffer, publickKey?: CryptoKey) {
    if (!this.#cryptoKeyPair) {
      await this.initCryptKey();
    }
    return crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publickKey || this.#cryptoKeyPair!.publicKey,
      data,
    );
  }
  async decrypt(data: ArrayBuffer) {
    if (!this.#cryptoKeyPair) {
      await this.initCryptKey();
    }
    return crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      this.#cryptoKeyPair!.privateKey,
      data,
    );
  }
  async sign(data: ArrayBuffer) {
    if (!this.#cryptoKeyPair) {
      await this.initCryptKey();
    }
    return sign(
      this.#cryptoKeyPair!.privateKey,
      data,
    );
  }
  async verify(data: ArrayBuffer, signature: ArrayBuffer) {
    if (!this.#cryptoKeyPair) {
      await this.initCryptKey();
    }
    return verify(
      this.#cryptoKeyPair!.publicKey,
      signature,
      data,
    );
  }
}
/**
 * 解析私钥
 * @param privateKey
 * @returns
 */
function parsePrivateKey(privateKey: ArrayBuffer | Uint8Array) {
  return crypto.subtle.importKey(
    "pkcs8",
    privateKey,
    {
      name: "RSA-PSS",
      hash: `SHA-256`,
    },
    false,
    ["sign"],
  );
}

/**
 * 生成签名
 * @param data
 * @returns
 */
export async function sign(
  privateKey: ArrayBuffer | Uint8Array | CryptoKey,
  data: ArrayBuffer | Uint8Array,
) {
  if (privateKey instanceof ArrayBuffer) {
    privateKey = await parsePrivateKey(privateKey);
  }
  const signature = await crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32, // 根据PSS标准设置盐长度
    },
    privateKey as CryptoKey, // 私钥
    data,
  );
  return signature;
}
/**
 * 解析公钥
 */
function parsePublickKey(publicKey: ArrayBuffer | Uint8Array) {
  return crypto.subtle.importKey(
    "spki",
    publicKey,
    {
      name: "RSA-PSS",
      hash: `SHA-256`,
    },
    false,
    ["verify"],
  );
}
/**
 * 验证签名
 * @param data
 * @param signature
 * @param publicKey
 * @returns
 */
export async function verify(
  publicKey: ArrayBuffer | Uint8Array | CryptoKey,
  signature: ArrayBuffer | Uint8Array,
  data: ArrayBuffer | Uint8Array,
) {
  if (publicKey instanceof ArrayBuffer) {
    publicKey = await parsePublickKey(publicKey);
  }
  const isValid = await crypto.subtle.verify(
    {
      name: "RSA-PSS",
      saltLength: 32, // 根据PSS标准设置盐长度
    },
    publicKey as CryptoKey, // 私钥
    signature,
    data,
  );
  return isValid;
}
