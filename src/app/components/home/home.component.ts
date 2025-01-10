import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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

  $loadingUserList = this.userService.$selectUserListLoading();
  $errorUserList = this.userService.$selectUserListError();
  $userList = this.userService.$selectUserList();
  $userIdSelected = this.userService.$selectUserIdSelected();

  $loadingHobbie = this.userService.$selectUserHobbieLoading();
  $errorHobbie = this.userService.$selectUserHobbieError();
  $hobbies = this.userService.$selectHobbies();

  ngOnInit(): void {
    this.initHomeWorks();
  }

  public showUserHobbies(id: string): void {
    this.userService.fetchHobbies(id);
  }

  public reloadUserList(): void {
    this.userService.fetchUserList();
  }

  public reloadUserHobbies(): void {
    if(this.$userIdSelected() !== null){
      this.userService.fetchHobbies(this.$userIdSelected() as string, true);
    }
  }

  private initHomeWorks():void {
    this.userService.resetState();
    this.userService.fetchUserList();
  }

}
