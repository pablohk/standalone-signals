import { Injectable } from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD } from '../models/sharedModels';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface I_Dummy {
  id: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class DummyService extends GenericApiService {
  private readonly BASE_PATH = 'http://localhost:3000';
  private readonly DUMMY_ENDPOINT = '/dummy';

  constructor() {
    super();
  }

  // No manejamos aquí el estado,  devolvemos el observable directamente y donde se use se manejará el error
  /**
   * Fetches dummy data from the API.
   * The observable completes after emitting one value.
   * @returns {Observable<I_Dummy>} An observable containing the dummy data.
   */
  public fetchDummyData(): Observable<I_Dummy> {
    return this.requestApi<I_Dummy>(
      E_API_METHOD.GET,
      `${this.BASE_PATH}${this.DUMMY_ENDPOINT}`
    ).pipe(take(1));
  }
}
