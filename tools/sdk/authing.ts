import { AuthenticationClient } from "authing";

let resumeAuhtingSDK: AuthenticationClient;
export const getResumeAuthingSDK = () => {
  if (resumeAuhtingSDK) {
    return resumeAuhtingSDK;
  }
  return resumeAuhtingSDK = new AuthenticationClient({
    appId: Deno.env.get("AUTHING_APP_ID")!,
    appHost: "https://worker-xjm-resume.authing.cn",
    appSecret: Deno.env.get("AUTHING_SECRET_KEY")!,
    redirectUri: Deno.env.get("location") + "/api/authing/parsecode",
  });
};
