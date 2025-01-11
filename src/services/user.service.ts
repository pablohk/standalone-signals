import {
  computed,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD, I_OBJECT } from '../models/sharedModels';
import { finalize, take } from 'rxjs/operators';

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
export class UserService extends GenericApiService {
  private readonly BASE_PATH = 'http://localhost:3000';
  private readonly USER_ENDPOINT = '/users';
  private readonly USER_HOBBIES_ENDPOINT = '/hobbies';

  private _$userState!: WritableSignal<I_USER>;
  private _$userLoading: I_OBJECT<WritableSignal<boolean>> = {};
  private _$userError: I_OBJECT<WritableSignal<string | null>> = {};

  constructor() {
    super();
    this.initializeSignals();
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
  /**
   * Fetches the user list from the API and updates the store with the retrieved data.
   * 
   * This method performs the following actions:
   * 1. Sets the loading state for the user list in the store to `true`.
   * 2. Clears any existing errors for the user list in the store.
   * 3. Makes an API request to fetch the user list.
   * 4. On successful response, updates the store with the retrieved user list.
   * 5. On error response, sets the error state for the user list in the store.
   * 6. Finally, sets the loading state for the user list in the store to `false`.
   * 
   * @returns {void}
   */
  public fetchUserList() {
    this.storeSetLoading(USER_SERVICE_ID.USER_LIST, true);
    this.storeSetError(USER_SERVICE_ID.USER_LIST, null);

    this.requestApi<Array<I_USER_ITEM>>(
      E_API_METHOD.GET,
      `${this.BASE_PATH}${this.USER_ENDPOINT}`
    )
      .pipe(
        take(1),
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

  /**
   * Fetches the hobbies of a user by their ID.
   * 
   * @param id - The ID of the user whose hobbies are to be fetched.
   * @param force - Optional parameter to force the fetch operation even if the user ID matches the selected user ID. Defaults to false.
   * 
   * This method checks if the provided user ID is different from the currently selected user ID or if the fetch operation is forced.
   * If either condition is true, it sets the loading state and clears any existing errors for the user hobbies.
   * It then makes an API request to fetch the hobbies of the user.
   * 
   * The API request is made using the GET method with the user ID as a parameter.
   * On successful response, it updates the store with the fetched hobbies.
   * On error, it sets the error state for the user hobbies.
   * 
   * The loading state is reset to false once the API request is completed, regardless of success or failure.
   */
  public fetchHobbies(id: string, force = false) {
    if (this._$userState().userIdSelected !== id || force) {
      this.storeSetLoading(USER_SERVICE_ID.USER_HOBBIES, true);
      this.storeSetError(USER_SERVICE_ID.USER_HOBBIES, null);

      const options = {
        params: {
          userId: id,
        },
      };

      this.requestApi<Array<I_HOBBIE>>(
        E_API_METHOD.GET,
        `${this.BASE_PATH}${this.USER_HOBBIES_ENDPOINT}`,
        options
      )
        .pipe(
          take(1),
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
  /**
   * Resets the store by reinitializing the signals.
   * This method is intended to be used internally to ensure
   * that the signals are set to their initial state.
   * 
   */
  private storeReset(): void {
    this.initializeSignals();
  }

  /**
   * Updates the state with a new list of users.
   *
   * @param response - An array of user items to update the user list with.
   */
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
