export class AESCBC{
  constructor(
    private key: ArrayBuffer | Uint8Array,
    private iv: ArrayBuffer | Uint8Array,
  ) {
    this.key = key;
    this.iv = iv;
  }
 /*  async encrypt(data: ArrayBuffer | Uint8Array)
  async decrypt(data: ArrayBuffer | Uint8Array)
  private async initCryptoKey(force = false)
  private async initCryptoKey()
  getKey()
  getIV()
  getKeyAndIV() */
}