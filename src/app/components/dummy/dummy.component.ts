import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dummy',
  standalone: true,
  imports: [],
  template: `<p>dummy works!</p>`,
  styleUrl: './dummy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DummyComponent { }
