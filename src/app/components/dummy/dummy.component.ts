import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { UserApiService } from '../../../services/user-api.service';
import { DummyApiService, I_Dummy } from '../../../services/dummy-api.service';
import { HobbieComponent } from '../hobbie/hobbie.component';
import { take } from 'rxjs/operators';

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

  $userList = this.userService.$selectUserList();
  $hobbies = this.userService.$selectHobbies();

  $dummyData= signal<I_Dummy | null>(null);
  $error= signal<string | null>(null);

  ngOnInit(): void {
    this.initDummyWorks();
  }

  private initDummyWorks(): void {
    this.dummyService
      .fetchDummyData()
      .pipe(take(1))
      .subscribe({
        next: (value) => {
          this.$dummyData.set(value);
        },
        error: (error) => {
          this.$error.set(error);
        },
      });
  }
}
