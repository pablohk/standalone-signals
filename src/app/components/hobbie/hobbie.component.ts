import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { I_HOBBIE, UserService } from '../../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'hobbie',
  standalone: true,
  imports: [AsyncPipe],
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
  public prueba$!: Observable<number>;

  ngOnInit(): void {
    const obsRandom = this.userService.$selectUserRandomNumber(true);
    this.prueba$ = obsRandom;

    obsRandom.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: number) => {
        this.prueba = value;
        // this.cdr.detectChanges(); // => si no hubiese el async pipe con prueba$. se necesita forzar el refresco
      });
  }
}
