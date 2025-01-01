import {
  computed,
  inject,
  Injectable,
  Inject,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, finalize, delay, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { joinOptions, setErrorMessage } from '../utils/shared.utils';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';

@Injectable()
export abstract class GenericApiService {
  private http = inject(HttpClient);

  private _$apiLoading: I_OBJECT<WritableSignal<boolean>> = {};
  private _$apiError: I_OBJECT<WritableSignal<string | null>> = {};

  constructor(@Inject('') private readonly endpointsIds?: I_OBJECT) {
    if (this.endpointsIds) {
      Object.values(this.endpointsIds).forEach((keyName) =>
        this.initializeSignals(keyName)
      );
    }
  }

  protected $selecApiLoading: I_OBJECT<Signal<boolean>> = {};
  protected $selectApiError: I_OBJECT<Signal<string | null>> = {};

  protected getRequestApi<T>(
    method: E_API_METHOD,
    url: string,
    endpointId: string,
    options?: I_OBJECT
  ) {
    return this.baseRequest<T>(method, url, options, endpointId);
  }

  protected getRequestApiWithoutState<T>(
    method: E_API_METHOD,
    url: string,
    options?: I_OBJECT
  ) {
    return this.baseRequest<T>(method, url, options);
  }

  protected setLoading(endpointId: string, value: boolean): void {
    this._$apiLoading[endpointId].set(value);
  }

  protected setError(endpointId: string, value: string | null): void {
    this._$apiError[endpointId].set(value);
  }

  private initializeSignals(keyName: string): void {
    this._$apiLoading[keyName] = signal<boolean>(false);
    this._$apiError[keyName] = signal<string | null>(null);
    this.$selecApiLoading[keyName] = computed(() => this._$apiLoading[keyName]());
    this.$selectApiError[keyName] = computed(() => this._$apiError[keyName]());
  }

  private baseRequest<T>(
    method: E_API_METHOD,
    url: string,
    options?: I_OBJECT,
    endpointId?: string
  ) {
    const joinedOptions = joinOptions(options);
    const request = this.http
      .request<T>(method, url, <Object>joinedOptions)
      .pipe(
        take(1),
        delay(1000)  //TESTING PROPOSAL. DELETE ON PRODUCTION
      );

    return endpointId ? this.withState(request, endpointId) : request;
  }

  private withState<T>(request: Observable<T>, endpointId: string) {
    this._$apiLoading[endpointId].set(true);
    this._$apiError[endpointId].set(null);

    return request.pipe(
      catchError((error) => {
        this._$apiError[endpointId].set(setErrorMessage(error));
        throw error;
      }),
      finalize(() => this._$apiLoading[endpointId].set(false))
    );
  }
}
