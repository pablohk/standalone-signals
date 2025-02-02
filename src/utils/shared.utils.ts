import { Injector, Signal } from "@angular/core";
import { I_OBJECT, SignalOrObs } from "../models/sharedModels";
import { toObservable } from "@angular/core/rxjs-interop";

export const setErrorMessage = (error: any): string => {
  return JSON.stringify(error?.message);// IMPLEMENTAR UNA FUNCION QUE DEVUELVA UN MENSAJE DE ERROR
};

  export const joinOptions= (customOptions: I_OBJECT | undefined): I_OBJECT =>{
    const GENERIC_OPTIONS ={
      headers:{
        'Content-Type': 'application/json',
      },
    };
    if(!customOptions){
      return GENERIC_OPTIONS;
    }
    return {
      ...GENERIC_OPTIONS,
      ...customOptions,
    };
  }

  export const signalOrObservable = <T,D>(
    signalFn: Signal<T>,
    isObs: D,
    inj: Injector
  ) => {
    const response = isObs
      ? toObservable(signalFn, { injector: inj })
      : signalFn;
    return response as SignalOrObs<T, D>;
  }