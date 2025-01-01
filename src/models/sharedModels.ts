export interface I_OBJECT<T=any> {
  [key: string]: T;
}

export enum E_API_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
