import { Handlers } from "$fresh/server.ts";
import {
  DeleteCredit,
  GetCredit,
  GetCreditList,
  UpdateCredential,
} from "../../denokv/index.ts";

export const handler: Handlers = {
  /**
   * 仅仅用于生成测试数据,并无其他大勇
   * @returns
   */
  async GET(req) {
    const url = new URL(req.url);
    const credit = url.searchParams.get("credential");
    if (credit) {
      return new Response(
        JSON.stringify(await GetCredit(Number.parseInt(credit))),
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );
    } else {
      return new Response(
        JSON.stringify(await GetCreditList()),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
  async POST(req) {
    const value = await req.json();
    const result = await UpdateCredential(value);
    if (result.ok) {
      return new Response(JSON.stringify(value.id), {
        headers: {
          "content-type": "application/json",
        },
      });
    }
    return new Response("创建失败", { status: 500 });
  },
  async DELETE(req) {
    const credits: number[] = await req.json();
    await DeleteCredit(credits);
    return new Response("已删除", {
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
