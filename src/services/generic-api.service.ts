import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, catchError } from 'rxjs/operators';

import { joinOptions, setErrorMessage } from '../utils/shared.utils';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';
import { Observable } from 'rxjs';

@Injectable()
export abstract class GenericApiService {
  private http = inject(HttpClient);

 /**
  * Realiza la petición http a la api correspondiente usando httpClient de angular
  * @param {E_API_METHOD} method  Http método. GET | POST | PUT | DELETE | PATCH
  * @param {string} url endpoint URL
  * @param {I_OBJECT} options  Objeto con las opciones HTTP  a enviar en la petición.
  * @returns Observable<T> con la respuesta de la petición
  */
  protected requestApi<T>(
    method: E_API_METHOD,
    url: string,
    options?: I_OBJECT
  ): Observable<T> {
    const joinedOptions = joinOptions(options);
    return this.http.request<T>(method, url, <Object>joinedOptions).pipe(
      delay(1000), //TESTING PROPOSAL. DELETE ON PRODUCTION
      catchError((error) => {
        throw setErrorMessage(error);
      })
    );
  }
}
