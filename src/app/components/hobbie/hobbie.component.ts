import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { I_HOBBIE } from '../../../services/user-api.service';

@Component({
  selector: 'hobbie',
  standalone: true,
  imports: [],
  templateUrl: './hobbie.component.html',
  styleUrl: './hobbie.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HobbieComponent { 
  public $hobbies = input<Array<I_HOBBIE>>();
}
