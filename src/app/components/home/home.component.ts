import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HobbieComponent } from '../hobbie/hobbie.component';
import { UserApiService } from '../../../services/user-api.service';
import { NgClass } from '@angular/common';

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
  private userService = inject(UserApiService);

  $loadingUserList = this.userService.selectUserLoading();
  $errorUserList = this.userService.selectUserError();
  $userList = this.userService.selectUserList();

  $loadingHobbie = this.userService.selectUserHobbieLoading();
  $errorHobbie = this.userService.selectUserHobbieError();
  $hobbies = this.userService.selectHobbies();

  $userId = signal<string>('');

  ngOnInit(): void {
    this.userService.fetchUserList();
  }

  showUserHobbies(id: string) {
    this.$userId.set(id);
    this.userService.fetchHobbies(id);
  }

  reloadUserList() {
    this.$userId.set('');
    this.userService.resetHobbies();
    this.userService.fetchUserList();
  }

  reloadUserHobbies() {
    if (this.$userId()) {
      this.userService.fetchHobbies(this.$userId());
    }
  }
}
