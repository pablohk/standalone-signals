import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { HobbieComponent } from '../hobbie/hobbie.component';
import {
  I_HOBBIE,
  I_USER_ITEM,
  UserService,
} from '../../../services/user.service';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'home',
  standalone: true,
  imports: [HobbieComponent, NgClass],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  $loadingUserList!: Signal<boolean>;
  $errorUserList!: Signal<string | null>;
  $userList!: Signal<I_USER_ITEM[]>;
  $userIdSelected!: Signal<string | null>;
  $userRandomNumber!: Signal<number>;

  $loadingHobbie!: Signal<boolean>;
  $errorHobbie!: Signal<string | null>;
  $hobbies!: Signal<I_HOBBIE[]>;

  prueba!: number;

  constructor() {
    // this.loggerSignals();
  }

  ngOnInit(): void {
    this.initializeSignals();
    this.initHomeWorks();
  }

  public showUserHobbies(id: string): void {
    this.userService.fetchHobbies(id);
  }

  public reloadUserList(): void {
    this.userService.fetchUserList();
  }

  public reloadUserHobbies(): void {
    if (this.$userIdSelected() !== null) {
      this.userService.fetchHobbies(this.$userIdSelected() as string, true);
    }
  }

  private initializeSignals(): void {
    this.$loadingUserList = this.userService.$selectUserListLoading<false>(false);
    this.$errorUserList = this.userService.$selectUserListError<false>(false);
    this.$userList = this.userService.$selectUserList<false>(false);
    this.$userIdSelected = this.userService.$selectUserIdSelected<false>(false);
    this.$userRandomNumber =
      this.userService.$selectUserRandomNumber<false>(false);

    this.$loadingHobbie = this.userService.$selectUserHobbieLoading<false>(false);
    this.$errorHobbie = this.userService.$selectUserHobbieError<false>(false);
    this.$hobbies = this.userService.$selectHobbies<false>(false);
  }

  private initHomeWorks(): void {
    this.userService.resetState();
    this.userService.fetchUserList();
    this.subscribePrueba();
  }

  private loggerSignals(): void {
    effect(() => {
      console.log(
        '---HomeComponent: $loadingUserList: ',
        this.$loadingUserList()
      );
      console.log('---HomeComponent: $errorUserList: ', this.$errorUserList());
      console.log('---HomeComponent: $userList: ', this.$userList());

      console.log(
        '---HomeComponent: $userIdSelected: ',
        this.$userIdSelected()
      );

      console.log(
        '---HomeComponent: $userRandomNumber: ',
        this.$userRandomNumber()
      );

      console.log('---HomeComponent: $loadingHobbie: ', this.$loadingHobbie());
      console.log('---HomeComponent: $errorHobbie: ', this.$errorHobbie());
      console.log('---HomeComponent: $hobbies: ', this.$hobbies());
    });
  }

  getRandomNumber(): void {
    this.userService.getUserRandomNumber();
  }

  public subscribePrueba(): void {
    this.userService.$selectUserRandomNumber<true>(true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: number) => {
        this.prueba = value;
      });
  }
}
