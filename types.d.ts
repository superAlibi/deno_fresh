/**
 * 本应用业务相应加密结构体
 */
export interface STDReq {
  data: string;
  iv: string;
}
/**
 * 常规解析上下文
 * t=表示请求体的json类型
 * UI=表示当前请求用户信息
 */
export interface ParsedCTX<T = STDReq, UI = unknown> {
  reqbody: T;
  userInfo: UI;
  query: URLSearchParams;
}
