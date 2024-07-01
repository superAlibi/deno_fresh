import {AuthenticationClient} from 'authing'
const redirect_uri = new URL(Deno.env.get("location")!);
    redirect_uri.pathname = "/api/authing/parsecode";
    
export const resumeAuhtingSDK = new AuthenticationClient({
  appId: Deno.env.get('AUTHING_APP_ID')!,
  appHost: 'https://worker-xjm-resume.authing.cn',
  secret: Deno.env.get('AUTHING_APP_SECRET')!,
  redirectUri: redirect_uri.toString(),
})