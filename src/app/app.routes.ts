import { Routes } from '@angular/router';
import { DummyComponent } from './components/dummy/dummy.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'dummy', component: DummyComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
