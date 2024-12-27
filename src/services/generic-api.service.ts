import { computed, inject, Injectable, Inject, Signal, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, finalize, delay, catchError } from 'rxjs/operators';

import {
  joinOptions,
  setErrorMessage,
} from '../utils/shared.utils';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';

@Injectable()
export  abstract class GenericApiService {
  private http = inject(HttpClient);

  private _$apiLoading: { [key: string]: WritableSignal<boolean> } = {};
  private _$apiError: { [key: string]: WritableSignal<string | null> } = {};

  protected $apiLoading: { [key: string]: Signal<boolean> } = {};
  protected $apiError: { [key: string]: Signal<string | null> } = {};

  constructor(@Inject('') private readonly endpointsIds: I_OBJECT){

    for(let e in  this.endpointsIds){
      const keyName = endpointsIds[e];
      this._$apiLoading[keyName]= signal<boolean>(false);
      this._$apiError[keyName]= signal<string | null>(null);

      this.$apiLoading[keyName] = computed(() => this._$apiLoading[keyName]());
      this.$apiError[keyName] = computed(() => this._$apiError[keyName]());
    }

  }

  protected getRequestApi<T>(
    method: E_API_METHOD,
    url: string,
    endpointId: string,
    options?: I_OBJECT
  ) {    
    this._$apiLoading[endpointId].set(true);
    this._$apiError[endpointId].set(null);
    const joinedOptions = joinOptions(options);

    return this.http.request<T>(method, url, <Object>joinedOptions).pipe(
      take(1),
      delay(1000),// TESTING PURPOSES. DELETE THIS LINE
      catchError((error) => {
        this._$apiError[endpointId].set(setErrorMessage(error));
        throw error;
      }),
      finalize(() => this._$apiLoading[endpointId].set( false))
    );
  }

  protected getRequestApiWithoutState<T>(
    method: E_API_METHOD,
    url: string,
    options?: I_OBJECT
  ) {
    const joinedOptions = joinOptions(options);

    return this.http.request<T>(method, url, <Object>joinedOptions).pipe(
      take(1),
      delay(1000),// TESTING PURPOSES. DELETE THIS LINE
      catchError((error) => {
        throw error;
      })
    );
  }
}
