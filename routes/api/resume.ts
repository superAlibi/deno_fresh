import { Handlers } from "$fresh/server.ts";
import { CredentialMeta, UpdateCredential } from "../../denokv/index.ts";

export const handler: Handlers = {
  async GET() {
    const now = Temporal.Now.instant(),
      zoned = now.toZonedDateTimeISO("Asia/Shanghai").round('millisecond')
        .toString();
    const credit: CredentialMeta = {
      createAt: zoned,
      corporateName: now.epochMilliseconds.toString(),
      duration: 7,
      durationUnit: "days",
      drives: [],
    };
    const result = await UpdateCredential(credit, now.epochMilliseconds);

    if (result?.ok) {
      return new Response(
        JSON.stringify(
          [
            zoned,
            now.epochMilliseconds,
          ],
        ),
      );
    }
    return new Response("时间戳写入失败", { status: 500 });
  },
};
