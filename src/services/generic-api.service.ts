import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, finalize, delay, catchError } from 'rxjs/operators';

import {
  INITIAL_STATE,
  joinOptions,
  setErrorMessage,
} from '../utils/shared.utils';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';

@Injectable()
export  abstract class GenericApiService {
  private http = inject(HttpClient);

  private _$apiLoading = signal<boolean>(INITIAL_STATE.loading);
  private _$apiError = signal<string | null>(INITIAL_STATE.error);

  protected $apiLoading: Signal<boolean> = computed(() => this._$apiLoading());
  protected $apiError: Signal<string | null> = computed(() => this._$apiError());

  protected getRequestApi<T>(
    method: E_API_METHOD,
    url: string,
    options?: I_OBJECT
  ) {
    this._$apiLoading.set(true);
    this._$apiError.set(null);
    const joinedOptions = joinOptions(options);

    return this.http.request<T>(method, url, <Object>joinedOptions).pipe(
      take(1),
      delay(1000),// TESTING PURPOSES. DELETE THIS LINE
      catchError((error) => {
        this._$apiError.set(setErrorMessage(error));
        throw error;
      }),
      finalize(() => this._$apiLoading.set(false))
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
