import {
  computed,
  effect,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';
import { delay, finalize, take } from 'rxjs/operators';

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

  private _$userState!: WritableSignal<I_USER>;
  private _$userLoading: I_OBJECT<WritableSignal<boolean>> = {};
  private _$userError: I_OBJECT<WritableSignal<string | null>> = {};

  constructor() {
    super();
    this.initializeSignals();
    effect(() => {
      console.log('---effect: loading object', this._$userLoading);
      console.log('---effect: error object', this._$userError);
      console.log('---effect: userState:', this._$userState());
      console.log(
        '---effect: USER_LIST loading:' +
          this.$selectUserListLoading()() +
          ' ,error:',

        this.$selectUserListError()()
      );
      console.log(
        '---effect: USER_HOBBIES loading:' +
          this.$selectUserHobbieLoading()() +
          ' ,error',
        this.$selectUserHobbieError()()
      );
    });
  }

  // SELECTORS
  public $selectUserListLoading = () =>
    computed(() => this._$userLoading[USER_SERVICE_ID.USER_LIST]());

  public $selectUserListError = () =>
    computed(() => this._$userError[USER_SERVICE_ID.USER_LIST]());

  public $selectUserList = () => computed(() => this._$userState().userList);

  public $selectUserIdSelected = () =>
    computed(() => this._$userState().userIdSelected);

  public $selectUserHobbieLoading = () =>
    computed(() => this._$userLoading[USER_SERVICE_ID.USER_HOBBIES]());

  public $selectUserHobbieError = () =>
    computed(() => this._$userError[USER_SERVICE_ID.USER_HOBBIES]());

  public $selectHobbies = () => computed(() => this._$userState().hobbies);

  // ACCTIONS
  public fetchUserList() {
    this.storeSetLoading(USER_SERVICE_ID.USER_LIST, true);
    this.storeSetError(USER_SERVICE_ID.USER_LIST, null);

    this.getRequestApi<Array<I_USER_ITEM>>(
      E_API_METHOD.GET,
      `${this.BASE_PATH}${this.USER_ENDPOINT}`
    )
      .pipe(
        take(1),
        delay(1000), //TESTING PROPOSAL. DELETE ON PRODUCTION
        finalize(() => this.storeSetLoading(USER_SERVICE_ID.USER_LIST, false))
      )
      .subscribe({
        next: (response) => {
          this.storeUpdateUserList(response);
        },
        error: (error) => {
          this.storeSetError(USER_SERVICE_ID.USER_LIST, error);
        },
      });
  }

  public fetchHobbies(id: string, force = false) {
    if (this._$userState().userIdSelected !== id || force) {
      const options = {
        params: {
          userId: id,
        },
      };
      this.storeSetLoading(USER_SERVICE_ID.USER_HOBBIES, true);
      this.storeSetError(USER_SERVICE_ID.USER_HOBBIES, null);

      this.getRequestApi<Array<I_HOBBIE>>(
        E_API_METHOD.GET,
        `${this.BASE_PATH}${this.USER_HOBBIES_ENDPOINT}`,
        options
      )
        .pipe(
          take(1),
          delay(1000), //TESTING PROPOSAL. DELETE ON PRODUCTION
          finalize(() =>
            this.storeSetLoading(USER_SERVICE_ID.USER_HOBBIES, false)
          )
        )
        .subscribe({
          next: (response) => {
            this.storeUpdateHobbies(response, id);
          },
          error: (error) => {
            this.storeSetError(USER_SERVICE_ID.USER_HOBBIES, error);
          },
        });
    }
  }

  public resetState(): void {
    this.storeReset();
  }

  // REDUCRES
  private storeReset(): void {
    this.initializeSignals();
  }

  private storeUpdateUserList(response: I_USER_ITEM[]): void {
    this.updateState({ userList: response, hobbies: [], userIdSelected: null });
  }

  private storeUpdateHobbies(response: I_HOBBIE[], id: string): void {
    this.updateState({ hobbies: response, userIdSelected: id });
  }

  private storeSetLoading(keyname: string, value: boolean) {
    this._$userLoading[keyname].set(value);
  }

  private storeSetError(keyname: string, value: string | null) {
    this._$userError[keyname].set(value);
  }

  // HELPERS
  private initializeSignals(): void {
    this._$userState = signal<I_USER>(initialUserState);
    Object.values(USER_SERVICE_ID).forEach((keyName) => {
      this._$userLoading[keyName] = signal<boolean>(false);
      this._$userError[keyName] = signal<string | null>(null);
    });
  }

  private updateState(payload: I_OBJECT): void {
    this._$userState.update((_state) => ({
      ..._state,
      ...payload,
    }));
  }
}
