import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
   title = input('');

    value = input('');

    icon = input('');

    color = input('#2F80ED');
}
