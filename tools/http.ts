import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import { AESCBC } from "./crypto/aes.ts";

type RequestInterceptor = (
  req: InterceptorConfig,
) => Omit<InterceptorConfig, "data"> | Promise<Omit<InterceptorConfig, "data">>;
type ResponseInterceptor<T = unknown> = (
  resp: Response,
) => T | Promise<T>;
interface HTTPToolOptions extends RequestInit {
  params?: string[][] | Record<string, string> | string | URLSearchParams;
  data?: Record<string, unknown>;
  requestInterceptor?: RequestInterceptor;
  responseInterceptor?: ResponseInterceptor;
}
interface InterceptorConfig extends HTTPToolOptions {
  url: string;
}
type EventType = "beforeRequest" | "afterResponse";
class InterceptorEvent extends Event {
  public config?: HTTPToolOptions;
  data: Request | Response;
  constructor(
    eventType: EventType,
    data: Request | Response,
  ) {
    super(eventType);
    this.data = data;
  }
}
type RespLisener = (req: Response) => void;
type ReqLisener = (req: Request) => void;
type Listener = RespLisener | ReqLisener;
class SyncEventDispatcher {
  events: Record<string, Listener[]>;
  constructor() {
    this.events = {}; // 用来存储事件类型及对应的处理函数列表
  }
  addEventListener(eventName: "afterResponse", listener: RespLisener): void;
  addEventListener(eventName: "beforeRequest", listener: ReqLisener): void;
  /**
   * 添加事件监听器
   * @param {string} eventName 事件名称
   * @param {Function} listener 事件处理函数
   */
  addEventListener(eventName: EventType, listener: Listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  /**
   * 触发事件，同步执行所有监听该事件的处理函数
   * @param {string} eventName 事件名称
   * @param {*} [detail] 传递给事件处理函数的参数
   */
  dispatchEvent(event: InterceptorEvent) {
    const listeners = this.events[event.type];
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(event.data as Request & Response); // 执行事件处理函数，可传入参数
        } catch (error) {
          console.error(`Error handling '${event.type}' event:`, error);
        }
      }
    }
  }

  /**
   * 移除事件监听器
   * @param {string} eventName 事件名称
   * @param {Function} [listener] 要移除的特定事件处理函数，如果不传则移除该事件的所有监听器
   */
  removeEventListener(eventName: string, listener: Listener) {
    if (this.events[eventName]) {
      if (listener) {
        this.events[eventName] = this.events[eventName].filter((l) =>
          l !== listener
        );
      } else {
        delete this.events[eventName];
      }
    }
  }
}
export class HTTPTool extends SyncEventDispatcher {
  public baseURL: string;
  constructor(
    baseURL: string,
    public options: HTTPToolOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    },
  ) {
    super();
    if (baseURL.endsWith("/")) {
      this.baseURL = baseURL.slice(0);
    } else {
      this.baseURL = baseURL + "/";
    }
  }
  static concatURL(baseURL: string, url: string) {
    if (!baseURL.endsWith("/")) {
      baseURL += "/";
    }
    if (url.startsWith("/")) {
      return baseURL + url.slice(1);
    }
    return baseURL + url;
  }
  private getFormatedURL(url: string) {
    return HTTPTool.concatURL(this.baseURL, url);
  }
  /**
   * 如果options中存在data,那么会忽略body
   * @param url
   * @param options
   * @returns
   */
  async request<T = unknown>(
    url: string,
    options: Omit<HTTPToolOptions, "url"> = {},
  ) {
    let { params, data, body, requestInterceptor, responseInterceptor } =
      options;

    let req: Request;
    if (requestInterceptor) {
      const { url: originalURL, ...ops } = await requestInterceptor({
        url,
        ...options,
      });
      const urlObj = new URL(this.getFormatedURL(originalURL), location.href);
      if (params) {
        if (params instanceof URLSearchParams) {
          urlObj.search = params.toString();
        } else {
          urlObj.search = new URLSearchParams(params).toString();
        }
      }
      const config = {
        body,
        ...this.options,
        ...ops,
      };
      req = new Request(urlObj, config);
    } else {
      if (data) {
        try {
          body = JSON.stringify(data);
        } catch (e) {
          console.error("JSONization failure of data parameter:", e?.message);
          return Promise.reject(e);
        }
      }
      const urlObj = new URL(this.getFormatedURL(url), location.href);
      if (params) {
        if (params instanceof URLSearchParams) {
          urlObj.search = params.toString();
        } else {
          urlObj.search = new URLSearchParams(params).toString();
        }
      }
      req = new Request(urlObj, {
        ...this.options,
        ...options,
        body,
      });
    }

    const e = new InterceptorEvent("beforeRequest", req);
    this.dispatchEvent(e);

    return fetch(req).then((resp) => {
      this.dispatchEvent(new InterceptorEvent("afterResponse", resp));
      if (responseInterceptor) {
        return responseInterceptor(resp) as T;
      }
      if (resp.ok) {
        return resp.json() as T;
      }
      return Promise.reject(resp);
    });
  }
  get<T = unknown>(
    url: string,
    options: Omit<HTTPToolOptions, "url" | "body" | "data"> = {},
  ) {
    return this.request<T>(url, {
      ...this.options,
      ...options,
      method: "GET",
    });
  }
  post<T = unknown>(url: string, options: Omit<HTTPToolOptions, "url"> = {}) {
    return this.request<T>(url, {
      ...this.options,
      ...options,
      method: "POST",
    });
  }
}

const textDecoder = new TextDecoder(), textEncoder = new TextEncoder();
const Whitelist = ["/api/common"];
export const createRequestInterceptor = (
  aes: AESCBC,
  whitelist: string[] = Whitelist,
) => {
  const requestInterceptor: RequestInterceptor = async (
    options: InterceptorConfig,
  ) => {
    const { url, data, ...ops } = options;
    console.log(url);

    const has = whitelist.some((item) => url.includes(item));
    if (has) {
      const req = new Request(url, ops);
      return req;
    }

    if (data) {
      let originalData: string;
      if (typeof data === "string") {
        originalData = data || "";
      } else {
        originalData = JSON.stringify(data) || "";
      }
      const bin = textEncoder.encode(originalData);
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const ciphertext = await aes.encrypt(bin, iv);
      console.log(ciphertext);

      ops.body = JSON.stringify({
        data: encodeBase64(ciphertext),
        iv: encodeBase64(iv),
      });
    }

    const config = { url, ...ops };

    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {} as Record<string, string>;
      }
      (config.headers as Record<string, string>)["Authorization"] = "Bearer " +
        token;
    }

    return config;
  };
  return requestInterceptor;
};

export const createResponseInterceptor = (
  aes: AESCBC,
  whitelist: string[] = Whitelist,
) => {
  const responseInterceptor = async (resp: Response) => {
    const json = await resp.json();
    const { data, iv, message } = json;

    if (resp.ok) {
      try {
        const bin = decodeBase64(data);
        const ivBin = decodeBase64(iv);

        if (whitelist.some((item) => resp.url.includes(item))) {
          return json;
        }
        const plaintext = await aes.encrypt(bin, ivBin);
        return JSON.parse(textDecoder.decode(plaintext));
      } catch (e) {
        console.error("意外:无法解码数据:",e.message);
        console.warn('无法解密数据:将返回原json')
        return json;
      }
    } else {
      return Promise.reject(message);
    }
  };
  return responseInterceptor;
};

const http = new HTTPTool("/api/");
http.addEventListener("beforeRequest", (req) => {
  console.log(req);
});
http.addEventListener("afterResponse", (resp) => {
  console.log(resp);
});
export { http };
