import { Injectable, signal } from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD } from '../models/sharedModels';

export interface I_Dummy {
  id: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DummyApiService extends GenericApiService {
  private readonly BASE_PATH = 'http://localhost:3000';
  private readonly DUMMY_ENDPOINT = '/dummy';
  
  private $dummyState = signal<I_Dummy | null>(null);

  constructor() {
    super();
  }

  // Selectors
  public selectDummyData() {
    return this.$dummyState;
  }

  // Actions
  public fetchDummyData() {
    this.getRequestApiWithoutState<I_Dummy>(
      E_API_METHOD.GET,
      `${this.BASE_PATH}${this.DUMMY_ENDPOINT}`,
    ).subscribe((response) => {
      this.reducerSetDummyData(response);
    });
  }

  // Reducers
  private reducerSetDummyData(data: I_Dummy) {
    this.$dummyState.set(data);
  }
}
