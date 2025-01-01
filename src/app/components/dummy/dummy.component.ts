import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { UserApiService } from '../../../services/user-api.service';
import { DummyApiService } from '../../../services/dummy-api.service';
import { HobbieComponent } from '../hobbie/hobbie.component';

@Component({
  selector: 'dummy',
  standalone: true,
  imports: [HobbieComponent],
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DummyComponent implements OnInit {
  private userService = inject(UserApiService);
  private dummyService = inject(DummyApiService);

  $userList = this.userService.$selectUserList;
  $hobbies = this.userService.$selectHobbies;

  $dummyData = this.dummyService.selectDummyData();

  ngOnInit(): void {
    this.initDummyWorks();
  }

  private initDummyWorks():void {
    this.dummyService.fetchDummyData();
  }
}
