import { computed, effect, Injectable, signal } from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD } from '../models/sharedModels';

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
}

const initialUserState: I_USER = {
  userList: [],
  hobbies: [],
};

const USER_SERVICE_ID = {
  USER_LIST: 'USER_LIST',
  USER_HOBBIES: 'USER_HOBBIES'
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends GenericApiService {
  private readonly BASE_PATH = 'http://localhost:3000';
  private readonly USER_ENDPOINT = '/users';
  private readonly USER_HOBBIES_ENDPOINT = '/hobbies';
  
  private $userState = signal<I_USER>(initialUserState);

  private _$userLoading = this.$apiLoading;
  private _$userErrorMessage = this.$apiError;
  private _$userList = computed(() => this.$userState().userList);
  private _$hobbies = computed(() => this.$userState().hobbies);

  constructor() {
    super(USER_SERVICE_ID);
    effect(()=>console.log('---effect: USER_LIST', 
      this._$userLoading[USER_SERVICE_ID.USER_LIST](), 
      this._$userErrorMessage[USER_SERVICE_ID.USER_LIST](),
      ', USER_HOBBIES',
      this._$userLoading[USER_SERVICE_ID.USER_HOBBIES](), 
      this._$userErrorMessage[USER_SERVICE_ID.USER_HOBBIES](),
    ))
  }

  // Selectors
  public selectUserLoading() {
    return this._$userLoading[USER_SERVICE_ID.USER_LIST];
  }

  public selectUserError() {
    return this._$userErrorMessage[USER_SERVICE_ID.USER_LIST];
  }

  public selectUserList() {
    return this._$userList;
  }

  public selectUserHobbieLoading() {
    return this._$userLoading[USER_SERVICE_ID.USER_HOBBIES];
  }

  public selectUserHobbieError() {
    return this._$userErrorMessage[USER_SERVICE_ID.USER_HOBBIES];
  }

  public selectHobbies() {
    return this._$hobbies;
  }

  // Actions
  public fetchUserList() {
    this.getRequestApi<Array<I_USER_ITEM>>(
      E_API_METHOD.GET,
      `${this.BASE_PATH}${this.USER_ENDPOINT}`,
      USER_SERVICE_ID.USER_LIST
    ).subscribe((response) => {
      this.reducerSetUserList(response);
    });
  }

  public fetchHobbies(id: string) {
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
      this.reducerSetUserHobbies(response);
    });
  }

  // public fetchHobbies(id: string) {
  //   this._$userHobbieLoading.set(true);
  //   this._$userHobbieErrorMessage.set(null);
  //   const options = {
  //     params: {
  //       userId: id,
  //     },
  //   };

  //   this.getRequestApiWithoutState<Array<I_HOBBIE>>(
  //     E_API_METHOD.GET,
  //     `${this.BASE_PATH}${this.USER_HOBBIES_ENDPOINT}`,
  //     options
  //   )
  //     .pipe(finalize(() => this._$userHobbieLoading.set(false)))
  //     .subscribe({
  //       next: (response) => {
  //         this.reducerSetUserHobbies(response);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         this._$userHobbieErrorMessage.set(setErrorMessage(error));
  //       },
  //     });
  // }

  public resetHobbies() {
    this.reducerResetHobbies();
  }

  // Reducers
  private reducerResetHobbies() {
    this.$userState.update((_state) => ({
      ..._state,
      hobbies: [],
    }));
  }

  private reducerSetUserList(userList: Array<I_USER_ITEM>) {
    this.$userState.update((_state) => ({
      ..._state,
      userList,
    }));
  }

  private reducerSetUserHobbies(hobbies: Array<I_HOBBIE>) {
    this.$userState.update((_state) => ({
      ..._state,
      hobbies,
    }));
  }
}
