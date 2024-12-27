import { I_OBJECT } from "../models/sharedModels";

export const INITIAL_STATE = {
  loading: false,
  error: null,
};

export const setErrorMessage = (error: any): string => {
  return JSON.stringify(error);
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
