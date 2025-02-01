import {
  computed,
  inject,
  Injectable,
  Injector,
  signal,
  Signal,
} from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { E_API_METHOD, I_OBJECT, SignalOrObs } from '../models/sharedModels';
import { finalize, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

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
  randomNumber: number;
}

export interface I_USER_STATE extends I_USER {
  loading: I_OBJECT<boolean>;
  error: I_OBJECT<string | null>;
}

const initialUserState: I_USER_STATE = {
  userList: [],
  hobbies: [],
  userIdSelected: null,
  randomNumber: 0,
  loading: {},
  error: {}
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

  private readonly _$state = signal<I_USER_STATE>(initialUserState);

  private readonly inj = inject(Injector);

  constructor() {
    super();
    this.initializeSignals();
  }

  // SELECTORS
  public readonly $selectUserListLoading = (): Signal<boolean> =>
    computed(() => this._$state().loading[USER_SERVICE_ID.USER_LIST] ?? false);

  public readonly $selectUserListError = (): Signal<string | null> =>
    computed(() => this._$state().error[USER_SERVICE_ID.USER_LIST] ?? null);

  public readonly $selectUserList = (): Signal<I_USER_ITEM[]> =>
    computed(() => this._$state().userList);

  public readonly $selectUserIdSelected = (): Signal<string | null> =>
    computed(() => this._$state().userIdSelected);

  public readonly $selectUserHobbieLoading = (): Signal<boolean> =>
    computed(
      () => this._$state().loading[USER_SERVICE_ID.USER_HOBBIES] ?? false
    );

  public readonly $selectUserHobbieError = (): Signal<string | null> =>
    computed(() => this._$state().error[USER_SERVICE_ID.USER_HOBBIES] ?? null);

  public readonly $selectHobbies = (): Signal<I_HOBBIE[]> =>
    computed(() => this._$state().hobbies);

  public $selectUserRandomNumber(asObservable = false): SignalOrObs<number> {
    const randomNumberSignal = computed(() => this._$state().randomNumber);
    return this.signalOrObservable(randomNumberSignal, asObservable);
  }

  private signalOrObservable<T>(
    signalFn: Signal<T>,
    asObservable: boolean
  ): SignalOrObs<T> {
    const response = asObservable
      ? toObservable(signalFn, { injector: this.inj })
      : signalFn;
    return response as SignalOrObs<T>;
  }

  // ACCTIONS
  public fetchUserList() {
    // Si esta en estado loading evitar que haga una nueva llamada
    // En algunos casos puede que queramos hacer esa llamada y en tal caso
    // no incluiríamos esta comprobación
    if (!this._$state().loading[USER_SERVICE_ID.USER_LIST]) {
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
          error: (error: Error) => {
            this.storeSetError(USER_SERVICE_ID.USER_LIST, error.message);
          },
        });
    }
  }

  public fetchHobbies(id: string, force = false) {
    // Si esta en estado loading evitar que haga una nueva llamada
    // En algunos casos puede que queramos hacer esa llamada y en tal caso
    // no incluiríamos esta comprobación
    if (!this._$state().loading[USER_SERVICE_ID.USER_HOBBIES] 
      && (this._$state().userIdSelected !== id || force)) {
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

  public getUserRandomNumber(): void {
    const value = Math.floor(Math.random() * 100);
    this.storeSetRandomNumber(value);
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

  private storeSetRandomNumber(value: number): void {
    this.updateState({ randomNumber: value });
  }

  private storeSetLoading(keyname: string, value: boolean) {
    this._$state.update((state) => ({
      ...state,
      loading: {
        ...state.loading,
        [keyname]: value,
      },
    }));
  }

  private storeSetError(keyname: string, value: string | null) {
    this._$state.update((state) => ({
      ...state,
      error: {
        ...state.error,
        [keyname]: value || value === null ?  value : 'ERROR DESCONOCIDO',
      },
    }));
  }

  // HELPERS
  private initializeSignals(): void {
    this._$state.update((_state) => ({
      ..._state,
      loading: {},
      error: {},
    }));
  }

  private updateState(payload: I_OBJECT): void {
    this._$state.update((_state) => ({
      ..._state,
      ...payload,
    }));
  }
}
