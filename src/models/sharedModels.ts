import { Signal } from "@angular/core";
import { Observable } from "rxjs";

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

export type SignalOrObs <T,D> = D extends true
  ? Observable<T>
  : Signal<T>;

