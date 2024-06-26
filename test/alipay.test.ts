import { getAlipaySDKInstane } from "../tools/sdk/alipay.ts?test";

Deno.test("test alipay sdk", async (t) => {
  const alipay = getAlipaySDKInstane();
  await t.step("test query", async (t) => {
    const result = await alipay.curl("POST", "alipay.trade.page.pay", {
      body: {
        bizContent: {
          outTradeNo: "123456",
          productCode: "FAST_INSTANT_TRADE_PAY",
          totalAmount: "0.01",
        },
      },
    });
    console.log(result);
  });
});
