import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { I_HOBBIE, I_USER_ITEM, UserService } from '../../../services/user.service';
import { DummyService, I_Dummy } from '../../../services/dummy.service';
import { HobbieComponent } from '../hobbie/hobbie.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'dummy',
  standalone: true,
  imports: [HobbieComponent],
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DummyComponent implements OnInit {
  private userService = inject(UserService);
  private dummyService = inject(DummyService);

  $userList!: Signal<I_USER_ITEM[]>;
  $hobbies!: Signal<I_HOBBIE[]>;
  $dummyData!: WritableSignal<I_Dummy | null>;
  $error!: WritableSignal<string | null>;

  ngOnInit(): void {
    this.initializeSignals();
    this.initDummyWorks();
  }

  private initializeSignals(): void{
    this.$userList = this.userService.$selectUserList();
    this.$hobbies = this.userService.$selectHobbies();
  
    this.$dummyData= signal(null);
    this.$error= signal(null);
  
  };

  private initDummyWorks(): void {
    this.$error.set(null);
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
