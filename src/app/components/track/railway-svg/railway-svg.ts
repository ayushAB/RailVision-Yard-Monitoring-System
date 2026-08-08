import { Component } from '@angular/core';

@Component({
  selector: 'app-railway-svg',
  imports: [],
  templateUrl: './railway-svg.html',
  styleUrl: './railway-svg.css',
})
export class RailwaySvg {
  sleepers = Array.from({ length: 45 }, (_, i) => i);
}
