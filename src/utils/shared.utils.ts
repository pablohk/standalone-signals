import { I_OBJECT } from "../models/sharedModels";

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
