import { computed, effect, Injectable, signal } from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';

export interface I_HOBBIE {
  id: string;
  name: string;
  userId: string;
}

export interface I_USER_ITEM {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface I_USER {
  userList: Array<I_USER_ITEM>;
  hobbies: Array<I_HOBBIE>;
  userIdSelected: string | null;
}

const initialUserState: I_USER = {
  userList: [],
  hobbies: [],
  userIdSelected: null,
};

const USER_SERVICE_ID = {
  USER_LIST: 'USER_LIST',
  USER_HOBBIES: 'USER_HOBBIES',
};

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends GenericApiService {
  private readonly BASE_PATH = 'http://localhost:3000';
  private readonly USER_ENDPOINT = '/users';
  private readonly USER_HOBBIES_ENDPOINT = '/hobbies';
  
  private _$userState = signal<I_USER>(initialUserState);
 
  constructor() {
    super(USER_SERVICE_ID);
    effect(() =>
      console.log(
        '---effect: USER_LIST',
        this.$selecApiLoading[USER_SERVICE_ID.USER_LIST](),
        this.$selectApiError[USER_SERVICE_ID.USER_LIST](),
        ', USER_HOBBIES',
        this.$selecApiLoading[USER_SERVICE_ID.USER_HOBBIES](),
        this.$selectApiError[USER_SERVICE_ID.USER_HOBBIES](),
        ', userState:',
        this._$userState()
      )
    );
  }
  // SELECTORS
  public $selectUserLoading = computed(() =>
    this.$selecApiLoading[USER_SERVICE_ID.USER_LIST]()
  );

  public $selectUserError = computed(() =>
    this.$selectApiError[USER_SERVICE_ID.USER_LIST]()
  );

  public $selectUserList = computed(() => this._$userState().userList);

  public $selectUserIdSelected = computed(
    () => this._$userState().userIdSelected
  );

  public $selectUserHobbieLoading = computed(() =>
    this.$selecApiLoading[USER_SERVICE_ID.USER_HOBBIES]()
  );

  public $selectUserHobbieError = computed(() =>
    this.$selectApiError[USER_SERVICE_ID.USER_HOBBIES]()
  );

  public $selectHobbies = computed(() => this._$userState().hobbies);

  // ACCTIONS
  public fetchUserList() {
    this.getRequestApi<Array<I_USER_ITEM>>(
      E_API_METHOD.GET,
      `${this.BASE_PATH}${this.USER_ENDPOINT}`,
      USER_SERVICE_ID.USER_LIST
    ).subscribe((response) => {
      this.storeUserList(response);
    });
  }

  public fetchHobbies(id: string, force = false) {
    if (this._$userState().userIdSelected !== id || force) {
      const options = {
        params: {
          userId: id,
        },
      };

      this.getRequestApi<Array<I_HOBBIE>>(
        E_API_METHOD.GET,
        `${this.BASE_PATH}${this.USER_HOBBIES_ENDPOINT}`,
        USER_SERVICE_ID.USER_HOBBIES,
        options
      ).subscribe((response) => {
        this.storeHobbies(response, id);
      });
    }
  }

  // REDUCRES
  private storeUserList(response: I_USER_ITEM[]): void {
    this.updateState({ userList: response, hobbies: [], userIdSelected: null });
  }

  private storeHobbies(response: I_HOBBIE[], id: string): void {
    this.updateState({ hobbies: response, userIdSelected: id });
  }

  private updateState(payload: I_OBJECT): void {
    this._$userState.update((_state) => ({
      ..._state,
      ...payload,
    }));
  }
}
