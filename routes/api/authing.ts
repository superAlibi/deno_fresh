import { Handlers } from "$fresh/server.ts";
import { ParsedCTX } from "../../types.d.ts";
// import { resumeAuhtingSDK } from "../../tools/sdk/authing.ts";

export const handler: Handlers<ParsedCTX> = {
  GET(req, ctx) {
    // resumeAuhtingSDK.getA
    const code=ctx.data.query.get('code')
    if(!code){
      return new Response(JSON.stringify({
        code:400,
        message:'code is required'
      }))
    }
    const state=ctx.data.query.get('state')
    const urlObj=new URL('https://worker-xjm-resume.authing.cn/oidc/token')
    const {searchParams}=urlObj
    searchParams.append('code',code)
    searchParams.append('client_id',Deno.env.get('AUTHING_APP_ID')!)
    searchParams.append('client_secret',Deno.env.get('AUTHING_SECRET_KEY')!)
    searchParams.append('grant_type','authorization_code')
    searchParams.append('grant_type','authorization_code')
    console.log(urlObj.toString());
    
    fetch(urlObj,{
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
    }).then(RESP=>{
      return RESP.json()
    }).then(d=>{
      console.log(JSON.stringify(d))
    })
    return new Response(JSON.stringify(ctx.data.query.toString()));
  },
};
