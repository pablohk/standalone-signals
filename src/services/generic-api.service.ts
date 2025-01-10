import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, catchError } from 'rxjs/operators';

import { joinOptions, setErrorMessage } from '../utils/shared.utils';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';

@Injectable()
export abstract class GenericApiService {
  private http = inject(HttpClient);

  protected getRequestApi<T>(
    method: E_API_METHOD,
    url: string,
    options?: I_OBJECT
  ) {
    const joinedOptions = joinOptions(options);
    return this.http.request<T>(method, url, <Object>joinedOptions).pipe(
      delay(1000), //TESTING PROPOSAL. DELETE ON PRODUCTION
      catchError((error) => {
        throw setErrorMessage(error);
      })
    );
  }
}
