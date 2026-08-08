import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell';
import {Dashboard} from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: Dashboard
      }
    ]
  }
];
