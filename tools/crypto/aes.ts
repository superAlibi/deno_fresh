export class AESCBC {
  #key: ArrayBuffer | Uint8Array;
  #cryptoKey?: CryptoKey;
  constructor(key: ArrayBuffer | Uint8Array) {
    this.#key = key;
  }
  private async initCryptoKey() {
    this.#cryptoKey = await crypto.subtle.importKey(
      "raw",
      this.#key,
      { name: "AES-CBC", length: 128 },
      true,
      ["encrypt", "decrypt"],
    );
  }
  async encrypt(plaintext: ArrayBuffer | Uint8Array, iv: ArrayBuffer | Uint8Array) {
    if (!this.#cryptoKey) {
      await this.initCryptoKey();
    }
    return crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      this.#cryptoKey!,
      plaintext,
    );
  }
   
  async decrypt(ciphertext: ArrayBuffer | Uint8Array, iv: ArrayBuffer | Uint8Array) {
    if (!this.#cryptoKey) {
      await this.initCryptoKey();
    }
    return crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      this.#cryptoKey!,
      ciphertext,
    );
  }
}
