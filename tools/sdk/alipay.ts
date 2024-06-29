import { AlipaySdk } from "alipaysdk";

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
  });
}
