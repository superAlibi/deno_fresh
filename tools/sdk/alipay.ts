import { AlipaySdk ,AlipaySdkConfig} from "alipaysdk";
const alipaySdk = new AlipaySdk({
  appId: Deno.env.get("ALIPAY_APPID") as string,
  privateKey: "xxxxxxxxxx",
  alipayPublicKey: Deno.env.get("ALIPAY_PUBLICKEY"),
});

export { alipaySdk };
