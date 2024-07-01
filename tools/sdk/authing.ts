import {AuthenticationClient} from 'authing'
export const resumeAuhtingSDK = new AuthenticationClient({
  appId: Deno.env.get('AUTHING_APP_ID')!,
  appHost: 'https://worker-xjm-resume.authing.cn',
})