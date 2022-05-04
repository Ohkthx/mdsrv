export interface RESTResponse {
  code: number;
  message: string;
  data: object;
  created: string;
}

export function newResponse(
  code: number,
  msg: string,
  data?: object,
): RESTResponse {
  return {
    code: code,
    message: msg,
    data: data ?? {},
    created: new Date().toISOString(),
  };
}
