import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Injector, input, OnInit } from '@angular/core';
import { I_HOBBIE, UserService } from '../../../services/user.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
  private readonly inj = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef)
  ;
  public $hobbies = input<Array<I_HOBBIE>>();
  public prueba!: number;
  
  ngOnInit(): void {
    (this.userService.$selectUserRandomNumber(this.inj) as Observable<number>)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: number) => {
        this.prueba = value;
        this.cdr.detectChanges();
      });
      
    // toObservable(this.userService.$selectUserRandomNumber(this.inj), {
    //   injector: this.inj,
    // })
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value: number) => {
    //     this.prueba = value;
    //     this.cdr.detectChanges();
    //   });
  }
}
