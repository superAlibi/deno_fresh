import { UserInfo } from "./denokv/user.ts";
/**
 * 本应用业务相应加密结构体
 */
export interface STDReq {
    data: string;
    iv: string;
}
/**
 * 常规解析上下文
 */
export interface ParsedCTX<T = STDReq> {
    reqbody: T;
    userInfo: UserInfo;
    query: URLSearchParams;
}
