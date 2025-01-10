import { effect, Injectable } from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD } from '../models/sharedModels';
import { take } from 'rxjs/operators';

export interface I_Dummy {
  id: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class DummyApiService extends GenericApiService {
  private readonly BASE_PATH = 'http://localhost:3000';
  private readonly DUMMY_ENDPOINT = '/dummy';

  constructor() {
    super();
  }

  // No manejamos aquí el estado,  devolvemos el observable directamente y donde se use se manejará el error
  public fetchDummyData() {
    return this.getRequestApi<I_Dummy>(
      E_API_METHOD.GET,
      `${this.BASE_PATH}${this.DUMMY_ENDPOINT}`
    ).pipe(take(1));
  }
}
