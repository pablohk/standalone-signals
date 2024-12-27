import { WritableSignal } from "@angular/core";

export interface I_OBJECT {
  [key: string]: any;
}

export enum E_API_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
