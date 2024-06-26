import { AlipaySdk } from "alipaysdk";

const urlObj = new URL(import.meta.url);
const query = Object.fromEntries(urlObj.searchParams.entries());

/**
 * 如果当前是测试模式,需要自动加载环境变量
 */
if ("test" in query) {
  await import("$std/dotenv/load.ts");
}
let alipaySdk: AlipaySdk;
export function getAlipaySDKInstane() {
  if (alipaySdk) {
    return alipaySdk;
  }
  return alipaySdk = new AlipaySdk({
    appId: Deno.env.get("ALIPAY_APPID") as string,
    privateKey: Deno.env.get("APP_PRIVATE_KEY") as string,
    alipayPublicKey: Deno.env.get("ALIPAY_PUBLIC_KEY"),
    gateway: "https://openapi.alipay.com/gateway.do",
    // keyType: "PKCS8",
  });
}
