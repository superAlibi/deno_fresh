import { UserInfo } from "./denokv/user.ts";

export interface PCTX{
    userInfo:UserInfo,
    query:URLSearchParams
}