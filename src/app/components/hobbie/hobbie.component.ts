import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { I_HOBBIE, UserService } from '../../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'hobbie',
  standalone: true,
  imports: [],
  templateUrl: './hobbie.component.html',
  styleUrl: './hobbie.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HobbieComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef)
  ;
  public $hobbies = input<Array<I_HOBBIE>>();
  public prueba!: number;
  
  ngOnInit(): void {
    (this.userService.$selectUserRandomNumber(true) as Observable<number>)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: number) => {
        this.prueba = value;
        this.cdr.detectChanges();
      });
  }
}
